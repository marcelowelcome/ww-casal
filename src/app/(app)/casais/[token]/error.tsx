'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ds';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[casal/detail] route error', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-8">
      <h1 className="mb-3 font-serif text-h2 text-cocoa-900">
        Não foi possível carregar este <em>briefing</em>
      </h1>
      <p className="mb-8 text-body text-cocoa-700">
        Tente atualizar em alguns instantes. Se o problema persistir, fale com o time técnico.
      </p>
      <div className="flex justify-center gap-3">
        <Button onClick={reset} variant="secondary" size="md">
          Tentar novamente
        </Button>
        <Link href="/casais" className="text-caption uppercase tracking-wider text-cocoa-700 self-center">
          Voltar para casais
        </Link>
      </div>
    </div>
  );
}
