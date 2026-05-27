import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="ww-page-header bg-paper border-b border-sand-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link
          href="/casais"
          className="font-serif text-lg leading-none text-cocoa-900"
          aria-label="Início — Painel de Briefings Welcome Weddings"
        >
          Welcome <em className="italic text-champagne-500">Weddings</em>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 sm:flex">
          <Link
            href="/casais"
            className="text-[11px] uppercase tracking-wider text-cocoa-700 hover:text-cocoa-900"
          >
            Casais
          </Link>
          <Link
            href="/dashboard"
            className="text-[11px] uppercase tracking-wider text-cocoa-700 hover:text-cocoa-900"
          >
            Tendências
          </Link>
        </nav>

        <div className="text-[10px] uppercase tracking-[3px] text-cocoa-400">
          Painel de Briefings
        </div>
      </div>
    </header>
  );
}
