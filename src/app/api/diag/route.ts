import { COLUMN_INDEX } from '@/lib/sheets/schema';

/**
 * Diagnóstico de configuração em produção. Não expõe nenhum secret.
 * Use para validar provisionamento Vercel antes de assumir que o app está quebrado.
 *
 * GET /api/diag → JSON com status de cada peça do pipeline.
 */
export const dynamic = 'force-dynamic';

interface DiagResult {
  use_mock: boolean;
  has_supabase_url: boolean;
  has_supabase_anon: boolean;
  has_sheets_id: boolean;
  has_sheets_tab: boolean;
  sheets_tab_value: string | null;
  auth_allowed_domains: string | null;
  sa_json_present: boolean;
  sa_json_length?: number;
  sa_parse_ok?: boolean;
  sa_parse_error?: string;
  sa_project_id?: string;
  sa_client_email?: string;
  sa_private_key_id_prefix?: string;
  sa_has_private_key?: boolean;
  sa_private_key_format_ok?: boolean;
  sa_private_key_starts_with_begin?: boolean;
  sa_private_key_has_literal_backslash_n?: boolean;
  sa_private_key_has_real_newline?: boolean;
  fetch_attempted?: boolean;
  fetch_ok?: boolean;
  fetch_row_count?: number;
  first_row_token_prefix?: string;
  fetch_error_code?: number | string;
  fetch_error_message?: string;
}

export async function GET() {
  const result: DiagResult = {
    use_mock: process.env.USE_MOCK_DATA === '1',
    has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_supabase_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    has_sheets_id: !!process.env.GOOGLE_SHEETS_ID,
    has_sheets_tab: !!process.env.GOOGLE_SHEETS_TAB,
    sheets_tab_value: process.env.GOOGLE_SHEETS_TAB ?? null,
    auth_allowed_domains: process.env.AUTH_ALLOWED_DOMAINS ?? null,
    sa_json_present: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  };

  const rawSA = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (rawSA) {
    result.sa_json_length = rawSA.length;
    try {
      const sa = JSON.parse(rawSA) as Record<string, string>;
      result.sa_parse_ok = true;
      result.sa_project_id = sa.project_id;
      result.sa_client_email = sa.client_email;
      result.sa_private_key_id_prefix = sa.private_key_id?.slice(0, 8) ?? '?';
      result.sa_has_private_key = !!sa.private_key;
      if (sa.private_key) {
        result.sa_private_key_format_ok =
          sa.private_key.includes('BEGIN PRIVATE KEY') &&
          sa.private_key.includes('END PRIVATE KEY');
        result.sa_private_key_starts_with_begin = sa.private_key.startsWith('-----BEGIN');
        result.sa_private_key_has_literal_backslash_n = sa.private_key.includes('\\n');
        result.sa_private_key_has_real_newline = sa.private_key.includes('\n');
      }
    } catch (err) {
      result.sa_parse_ok = false;
      result.sa_parse_error = (err as Error).message;
    }
  }

  if (
    !result.use_mock &&
    result.sa_parse_ok &&
    process.env.GOOGLE_SHEETS_ID &&
    process.env.GOOGLE_SHEETS_TAB
  ) {
    result.fetch_attempted = true;
    try {
      const { getSheetsClient } = await import('@/lib/sheets/client');
      const sheets = getSheetsClient();
      const r = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: `${process.env.GOOGLE_SHEETS_TAB}!A2:BP`,
      });
      const rows = r.data.values ?? [];
      result.fetch_ok = true;
      result.fetch_row_count = rows.length;
      const tok = rows[0]?.[COLUMN_INDEX.token];
      result.first_row_token_prefix = tok ? `${tok.slice(0, 6)}…` : '(vazio)';
    } catch (err) {
      result.fetch_ok = false;
      const e = err as { code?: number | string; message?: string };
      result.fetch_error_code = e.code;
      result.fetch_error_message = e.message;
    }
  }

  return Response.json(result);
}
