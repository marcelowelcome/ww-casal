#!/usr/bin/env node
/**
 * Valida que a credencial GOOGLE_SERVICE_ACCOUNT_JSON consegue ler a planilha.
 * Não imprime PII — apenas contadores, primeiros caracteres e diagnóstico.
 *
 * Uso: node scripts/validate-sheets.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { google } from 'googleapis';

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  const text = readFileSync(path, 'utf8');
  const env = {};
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip surrounding quotes (single or double)
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    // Last occurrence wins (matches Next.js/dotenv behavior)
    env[key] = value;
  }
  return env;
}

function redactToken(token) {
  if (!token) return '(vazio)';
  if (token.length <= 8) return `${token.slice(0, 2)}***`;
  return `${token.slice(0, 4)}***${token.slice(-3)} (len=${token.length})`;
}

async function main() {
  console.log('— Validador Google Sheets —\n');

  const env = loadEnvLocal();

  const required = ['GOOGLE_SERVICE_ACCOUNT_JSON', 'GOOGLE_SHEETS_ID', 'GOOGLE_SHEETS_TAB'];
  const missing = required.filter((k) => !env[k]);
  if (missing.length) {
    console.error(`✗ Faltam variáveis em .env.local: ${missing.join(', ')}`);
    process.exit(1);
  }

  let credentials;
  try {
    credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error('✗ GOOGLE_SERVICE_ACCOUNT_JSON é inválido:', err.message);
    process.exit(1);
  }

  console.log('✓ JSON da service account parseou');
  console.log(`  project_id     : ${credentials.project_id}`);
  console.log(`  client_email   : ${credentials.client_email}`);
  console.log(`  private_key_id : ${credentials.private_key_id?.slice(0, 8)}…`);
  console.log(`  has private_key: ${Boolean(credentials.private_key)}`);
  console.log('');

  console.log(`  GOOGLE_SHEETS_ID  : ${env.GOOGLE_SHEETS_ID}`);
  console.log(`  GOOGLE_SHEETS_TAB : ${env.GOOGLE_SHEETS_TAB}`);
  console.log('');

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // 1) Metadata da planilha
  let meta;
  try {
    const r = await sheets.spreadsheets.get({
      spreadsheetId: env.GOOGLE_SHEETS_ID,
      fields: 'properties.title,sheets.properties(title,gridProperties)',
    });
    meta = r.data;
  } catch (err) {
    console.error('✗ Falha ao acessar a planilha:');
    console.error(`  status : ${err.code ?? '?'}`);
    console.error(`  message: ${err.message}`);
    if (String(err.message).includes('does not have permission') || err.code === 403) {
      console.error('');
      console.error('  Provável causa: a planilha não foi compartilhada com a service account.');
      console.error(`  Compartilhe com: ${credentials.client_email}`);
      console.error('  Permissão: Viewer.');
    }
    if (err.code === 404) {
      console.error('');
      console.error('  Provável causa: GOOGLE_SHEETS_ID está errado.');
    }
    process.exit(1);
  }

  console.log(`✓ Acesso à planilha confirmado`);
  console.log(`  Título da planilha: "${meta.properties.title}"`);
  console.log(`  Abas:`);
  for (const s of meta.sheets ?? []) {
    const rows = s.properties.gridProperties?.rowCount ?? '?';
    const cols = s.properties.gridProperties?.columnCount ?? '?';
    const marker = s.properties.title === env.GOOGLE_SHEETS_TAB ? ' ← TAB CONFIGURADA' : '';
    console.log(`    - "${s.properties.title}" (${rows} linhas × ${cols} cols)${marker}`);
  }
  console.log('');

  const tabExists = meta.sheets?.some((s) => s.properties.title === env.GOOGLE_SHEETS_TAB);
  if (!tabExists) {
    console.error(`✗ A aba "${env.GOOGLE_SHEETS_TAB}" não existe nessa planilha.`);
    console.error('  Ajuste GOOGLE_SHEETS_TAB no .env.local conforme a lista acima.');
    process.exit(1);
  }

  // 2) Header (linha 1) — pega tudo (até ZZ pra cobrir qualquer largura)
  const headerResp = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GOOGLE_SHEETS_ID,
    range: `${env.GOOGLE_SHEETS_TAB}!1:1`,
  });
  const header = headerResp.data.values?.[0] ?? [];
  console.log(`✓ Header lido — ${header.length} colunas`);
  console.log('');

  function colLetter(i) {
    let s = '';
    let n = i;
    do {
      s = String.fromCharCode(65 + (n % 26)) + s;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return s;
  }

  console.log('  Mapeamento posicional do header:');
  for (let i = 0; i < header.length; i++) {
    const label = (header[i] ?? '').toString().slice(0, 70);
    console.log(`    ${colLetter(i).padStart(3, ' ')} [${String(i).padStart(2, '0')}]  ${label}`);
  }
  console.log('');

  // 3) Sample dados — primeira linha
  const dataResp = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GOOGLE_SHEETS_ID,
    range: `${env.GOOGLE_SHEETS_TAB}!A2:ZZ`,
  });
  const rows = dataResp.data.values ?? [];

  console.log(`✓ Dados lidos — ${rows.length} linhas (sem header)`);

  // 4) Tentar achar as colunas de token/timestamp olhando as últimas posições
  const lastIdx = header.length - 1;
  const penultIdx = header.length - 2;
  console.log(`  Coluna ${colLetter(lastIdx)} (idx ${lastIdx}) — provável token`);
  console.log(`  Coluna ${colLetter(penultIdx)} (idx ${penultIdx}) — provável submitted_at`);
  if (rows.length > 0) {
    const sample = rows[0];
    console.log(`  Amostra última col: "${redactToken(sample[lastIdx])}"`);
    console.log(`  Amostra penúltima : "${sample[penultIdx] ?? '(vazio)'}"`);
  }

  console.log('');
  console.log('— Validação concluída com sucesso —');
}

main().catch((err) => {
  console.error('✗ Erro inesperado:', err);
  process.exit(1);
});
