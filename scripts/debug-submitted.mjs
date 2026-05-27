#!/usr/bin/env node
// Diagnóstico: imprime os valores BO (submitted_at) e BP (token) de até 10 linhas.

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
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = google.sheets({ version: 'v4', auth });

const r = await sheets.spreadsheets.values.get({
  spreadsheetId: env.GOOGLE_SHEETS_ID,
  range: `${env.GOOGLE_SHEETS_TAB}!A2:BP`,
});
const rows = r.data.values ?? [];
console.log(`Total: ${rows.length} linhas\n`);

console.log('idx | submitted_at (BO=66)       | token len | new Date() parse');
console.log('----+-----------------------------+-----------+------------------');
for (let i = 0; i < Math.min(10, rows.length); i++) {
  const row = rows[i];
  const submittedRaw = row[66] ?? '';
  const tokenRaw = row[67] ?? '';
  const d = new Date(submittedRaw);
  const parsed = isNaN(d.getTime()) ? 'INVÁLIDO' : d.toISOString();
  console.log(`${String(i).padStart(3)} | ${String(submittedRaw).padEnd(28)} | ${String(tokenRaw.length).padEnd(9)} | ${parsed}`);
}

console.log('\nTipo de valor BO da primeira linha:', typeof rows[0]?.[66]);
console.log('Comprimento total da primeira linha:', rows[0]?.length);
