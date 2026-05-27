import Link from 'next/link';
import { coupleDisplayName, formatShortDate } from '@/lib/utils/format';
import type { Couple } from '@/types/couple';

interface CoupleListItemProps {
  couple: Couple;
}

export function CoupleListItem({ couple }: CoupleListItemProps) {
  const name = coupleDisplayName(
    couple.identificacao.noivo_1.nome,
    couple.identificacao.noivo_2.nome,
  );
  const destino = couple.destino.gostaram ?? couple.destino.sonhos ?? null;
  const numero = couple.convidados.numero;
  const submitted = couple.submitted_at ? formatShortDate(couple.submitted_at) : null;

  return (
    <Link
      href={`/casais/${couple.id}`}
      className="group block border-b border-sand-200 bg-paper px-6 py-5 transition-colors first:rounded-t-sm last:rounded-b-sm last:border-b-0 hover:bg-sand-50"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-h3 font-normal leading-tight text-cocoa-900">{name}</h3>
          {destino ? (
            <p className="mt-1 line-clamp-1 text-caption text-cocoa-500">{destino}</p>
          ) : null}
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1 text-right">
          {submitted ? (
            <span className="text-caption text-cocoa-700">Briefing {submitted}</span>
          ) : (
            <span className="text-caption text-cocoa-300">Data não registrada</span>
          )}
          {numero != null ? (
            <span className="text-caption text-cocoa-400">{numero} convidados</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
