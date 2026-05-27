export function parseString(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length === 0 ? null : s;
}

export function parseMultiSelect(value: unknown): string[] {
  if (value == null) return [];
  return String(value)
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function parseBoolean(value: unknown): boolean | null {
  if (value == null) return null;
  const s = String(value).trim().toUpperCase();
  if (s === 'TRUE' || s === 'SIM' || s === 'YES') return true;
  if (s === 'FALSE' || s === 'NÃO' || s === 'NAO' || s === 'NO') return false;
  return null;
}

export function parseNumber(value: unknown): number | null {
  if (value == null) return null;
  const s = String(value).trim().replace(/\./g, '').replace(',', '.');
  if (s.length === 0) return null;
  const n = Number(s.replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

/**
 * Retorna a data como ISO string para sobreviver à serialização Next.js
 * (Server→Client props). null se o valor estiver vazio ou não parseável.
 */
export function parseSubmittedAt(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (s.length === 0) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
