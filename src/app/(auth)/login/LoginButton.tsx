'use client';

import { useState, useTransition } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Button } from '@/components/ds';

export function LoginButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLogin() {
    setError(null);
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowser();
        const { error: supabaseError } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            scopes: 'email openid',
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (supabaseError) {
          console.error('[login] signInWithOAuth failed', supabaseError);
          setError('Não foi possível iniciar o login. Tente novamente.');
        }
      } catch (err) {
        console.error('[login] unexpected error', err);
        setError('Não foi possível iniciar o login. Tente novamente.');
      }
    });
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={handleLogin}
        disabled={isPending}
      >
        {isPending ? 'Conectando…' : 'Entrar com Microsoft'}
      </Button>
      {error ? <p className="text-caption text-terracotta-700">{error}</p> : null}
    </div>
  );
}
