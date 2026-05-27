import { Eyebrow } from '@/components/ds';
import type { Couple } from '@/types/couple';
import { coupleDisplayName, formatShortDate } from '@/lib/utils/format';

interface CoupleHeroProps {
  couple: Couple;
}

export function CoupleHero({ couple }: CoupleHeroProps) {
  const n1 = couple.identificacao.noivo_1.nome;
  const n2 = couple.identificacao.noivo_2.nome;
  const displayName = coupleDisplayName(n1, n2);

  return (
    <header className="pb-8">
      <Eyebrow ornament>Briefing do casal</Eyebrow>
      <h1 className="font-serif text-display font-normal leading-tight text-cocoa-900">
        {n1 ?? displayName}{' '}
        {n2 ? (
          <>
            &amp; <em className="italic text-champagne-500">{n2}</em>
          </>
        ) : null}
      </h1>
      <p className="mt-3 text-caption text-cocoa-400">
        Briefing recebido em {formatShortDate(couple.submitted_at)}
        <span className="mx-2 text-cocoa-300">·</span>
        Token <code className="font-mono text-[11px] text-cocoa-500">{couple.id}</code>
      </p>
    </header>
  );
}
