import { revalidateTag } from 'next/cache';

/**
 * Invalida o cache de couples / aggregates manualmente.
 * Usado quando o cache do unstable_cache fica stale (ex.: primeiro deploy
 * com env vars erradas cacheou [], e ajustes posteriores não refletem).
 */
export const dynamic = 'force-dynamic';

export async function POST() {
  revalidateTag('couples');
  revalidateTag('aggregates');
  return Response.json({ ok: true, invalidated: ['couples', 'aggregates'] });
}

// Permitir GET também pra facilitar chamada via browser
export async function GET() {
  return POST();
}
