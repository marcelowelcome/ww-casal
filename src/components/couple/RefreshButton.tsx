'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { refreshCouples } from '@/lib/actions/refresh';
import { Button } from '@/components/ds';

export function RefreshButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await refreshCouples();
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="screen-only flex items-center gap-3">
      <Button type="button" variant="ghost" size="md" onClick={handleClick} disabled={isPending}>
        {isPending ? 'Atualizando…' : 'Atualizar agora'}
      </Button>
      {error ? <span className="text-caption text-terracotta-700">{error}</span> : null}
    </div>
  );
}
