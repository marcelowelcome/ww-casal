import { format, formatDistanceToNowStrict, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Server Components passam Date; Client Components recebem string ISO após
 * serialização. Aceitamos ambos os formatos transparentemente.
 */
type DateLike = Date | string | null | undefined;

function toDate(value: DateLike): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  const d = new Date(value);
  return isValid(d) ? d : null;
}

export function formatDate(date: DateLike, pattern = "dd 'de' MMMM 'de' yyyy"): string {
  const d = toDate(date);
  if (!d) return '—';
  return format(d, pattern, { locale: ptBR });
}

export function formatShortDate(date: DateLike): string {
  return formatDate(date, "dd 'de' MMM yyyy");
}

export function formatRelative(date: DateLike): string {
  const d = toDate(date);
  if (!d) return '—';
  return `há ${formatDistanceToNowStrict(d, { locale: ptBR })}`;
}

export function coupleDisplayName(
  noivo1Nome: string | null,
  noivo2Nome: string | null,
): string {
  const a = noivo1Nome?.trim();
  const b = noivo2Nome?.trim();
  if (a && b) return `${a} e ${b}`;
  return a ?? b ?? 'Casal sem nome';
}

export function initials(noivo1Nome: string | null, noivo2Nome: string | null): string {
  const a = noivo1Nome?.trim()?.[0]?.toUpperCase();
  const b = noivo2Nome?.trim()?.[0]?.toUpperCase();
  return `${a ?? ''}${b ?? ''}` || '—';
}
