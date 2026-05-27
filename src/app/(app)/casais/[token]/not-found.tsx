import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-8">
      <div className="eyebrow mb-3">— Briefing não encontrado —</div>
      <h1 className="mb-3 font-serif text-h2 text-cocoa-900">
        Esse <em>token</em> não existe
      </h1>
      <p className="mb-8 text-body text-cocoa-700">
        Verifique o link ou confirme se o casal já preencheu o briefing. Tokens vêm da coluna BP da
        planilha de respostas.
      </p>
      <Link
        href="/casais"
        className="inline-block rounded-sm bg-cocoa-900 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-paper hover:bg-cocoa-800"
      >
        Voltar para casais
      </Link>
    </div>
  );
}
