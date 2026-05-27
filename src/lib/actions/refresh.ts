'use server';

import { revalidateTag } from 'next/cache';

export async function refreshCouples(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    revalidateTag('couples');
    return { ok: true };
  } catch (err) {
    console.error('[actions] refreshCouples failed', err);
    return { ok: false, error: 'Não foi possível atualizar agora. Tente novamente em instantes.' };
  }
}
