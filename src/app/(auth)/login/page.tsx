import { LoginButton } from './LoginButton';
import { allowedDomainsLabel } from '@/lib/auth/allowed-domains';

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized_domain: 'Sua conta não tem permissão para acessar este painel.',
  callback_failed: 'Não foi possível concluir o login. Tente novamente em instantes.',
};

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;
  const allowed = allowedDomainsLabel();

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-100 px-6">
      <div className="w-full max-w-md rounded-md border border-sand-200 bg-paper px-10 py-12 text-center">
        <div className="mb-2 font-serif text-2xl text-cocoa-900">
          Welcome <em className="italic text-champagne-500">Weddings</em>
        </div>
        <div className="mb-10 text-[10px] uppercase tracking-[3px] text-cocoa-400">
          Painel de Briefings
        </div>

        {errorMessage ? (
          <p className="mb-6 rounded-sm bg-terracotta-50 px-4 py-3 text-body-sm text-terracotta-700">
            {errorMessage}
          </p>
        ) : null}

        <LoginButton />

        {allowed ? (
          <p className="mt-6 text-caption text-cocoa-400">
            Acesso restrito a contas {allowed}.
          </p>
        ) : null}
      </div>
    </main>
  );
}
