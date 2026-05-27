import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCoupleByToken } from '@/lib/sheets/queries';
import { BRIEFING_SECTIONS } from '@/types/couple';
import { CoupleHero } from '@/components/couple/CoupleHero';
import { PrintHeader } from '@/components/layout/PrintHeader';
import { PrintButton } from '@/components/couple/PrintButton';
import { RefreshButton } from '@/components/couple/RefreshButton';
import { SidebarNav, type SidebarNavItem } from '@/components/ds';
import { coupleDisplayName } from '@/lib/utils/format';
import {
  SectionIdentificacao,
  SectionPorQueWelcome,
  SectionDestino,
  SectionData,
  SectionCasamentoCivil,
  SectionFilhos,
  SectionCerimonia,
  SectionHistoria,
  SectionExpectativas,
  SectionViagem,
  SectionHotel,
  SectionConvidados,
  SectionDocumentos,
  SectionConvites,
  SectionPadrinhos,
  SectionFornecedores,
  SectionProducao,
} from '@/components/couple/BriefingSections';
import type { Couple } from '@/types/couple';

export const revalidate = 300;

const SECTION_COMPONENTS = {
  identificacao: SectionIdentificacao,
  por_que_welcome: SectionPorQueWelcome,
  destino: SectionDestino,
  data: SectionData,
  casamento_civil: SectionCasamentoCivil,
  filhos: SectionFilhos,
  cerimonia: SectionCerimonia,
  historia: SectionHistoria,
  expectativas: SectionExpectativas,
  viagem: SectionViagem,
  hotel: SectionHotel,
  convidados: SectionConvidados,
  documentos: SectionDocumentos,
  convites: SectionConvites,
  padrinhos: SectionPadrinhos,
  fornecedores: SectionFornecedores,
  producao: SectionProducao,
} as const satisfies Record<
  (typeof BRIEFING_SECTIONS)[number]['id'],
  (props: { couple: Couple }) => React.ReactNode
>;

const sidebarItems: SidebarNavItem[] = BRIEFING_SECTIONS.map((s) => ({ id: s.id, label: s.label }));

export default async function CouplePage({ params }: { params: { token: string } }) {
  const couple = await getCoupleByToken(params.token);
  if (!couple) notFound();

  const displayName = coupleDisplayName(
    couple.identificacao.noivo_1.nome,
    couple.identificacao.noivo_2.nome,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <PrintHeader coupleName={displayName} />

      <div className="ww-body grid grid-cols-1 gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="screen-only hidden lg:block">
          <div className="sticky top-8">
            <SidebarNav items={sidebarItems} />
          </div>
        </aside>

        <div>
          <div className="screen-only mb-2 flex items-center justify-between">
            <Link
              href="/casais"
              className="text-caption uppercase tracking-wider text-cocoa-500 hover:text-cocoa-800"
            >
              ← Voltar para casais
            </Link>
            <div className="flex items-center gap-3">
              <RefreshButton />
              <PrintButton />
            </div>
          </div>

          <CoupleHero couple={couple} />

          <div>
            {BRIEFING_SECTIONS.map((s) => {
              const Component = SECTION_COMPONENTS[s.id];
              return <Component key={s.id} couple={couple} />;
            })}
          </div>

          <div className="ww-ornament py-12 text-center font-serif text-champagne-500"
               style={{ letterSpacing: '8px', fontSize: '13px' }}>
            • • •
          </div>
        </div>
      </div>
    </div>
  );
}
