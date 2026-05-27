const allowed = (process.env.AUTH_ALLOWED_DOMAINS ?? '')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && allowed.includes(domain);
}

export function allowedDomainsLabel(): string {
  if (allowed.length === 0) return '';
  if (allowed.length === 1) return `@${allowed[0]}`;
  const last = allowed[allowed.length - 1];
  const rest = allowed.slice(0, -1).map((d) => `@${d}`);
  return `${rest.join(', ')} ou @${last}`;
}
