import { getCouples } from '@/lib/sheets/queries';
import { CoupleSearch } from '@/components/couple/CoupleSearch';
import { Eyebrow } from '@/components/ds';
import { EmptyState } from '@/components/ds';

export const revalidate = 300;

export default async function CasaisPage() {
  const couples = await getCouples();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      <Eyebrow ornament>Briefings</Eyebrow>
      <h1 className="mb-2 font-serif text-h1 font-normal text-cocoa-900">
        Casais em <em className="italic text-champagne-500">planejamento</em>
      </h1>
      <p className="mb-10 text-body text-cocoa-700">
        {couples.length === 0
          ? 'Nenhum briefing recebido até o momento.'
          : 'Lista de casais com briefing já preenchido. Clique em qualquer item para abrir o briefing completo.'}
      </p>

      {couples.length === 0 ? (
        <EmptyState>
          Nenhum casal apareceu na planilha. Verifique a conexão com o Google Sheets ou aguarde o
          próximo preenchimento.
        </EmptyState>
      ) : (
        <CoupleSearch couples={couples} />
      )}
    </div>
  );
}
