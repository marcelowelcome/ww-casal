'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ds';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[dashboard] route error', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-8">
      <h1 className="mb-3 font-serif text-h2 text-cocoa-900">
        Não foi possível carregar as <em>tendências</em>
      </h1>
      <p className="mb-8 text-body text-cocoa-700">
        Tente novamente em alguns instantes.
      </p>
      <Button onClick={reset} variant="secondary" size="md">
        Tentar novamente
      </Button>
    </div>
  );
}
