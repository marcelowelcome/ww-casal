'use client';

import { useMemo, useState } from 'react';
import type { Couple } from '@/types/couple';
import { CoupleListItem } from './CoupleListItem';
import { EmptyState } from '@/components/ds';
import { coupleDisplayName } from '@/lib/utils/format';

interface CoupleSearchProps {
  couples: Couple[];
}

export function CoupleSearch({ couples }: CoupleSearchProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return couples;
    return couples.filter((c) => {
      const name = coupleDisplayName(
        c.identificacao.noivo_1.nome,
        c.identificacao.noivo_2.nome,
      ).toLowerCase();
      return name.includes(q);
    });
  }, [couples, query]);

  return (
    <div className="space-y-6">
      <div className="ww-search">
        <label className="block">
          <span className="sr-only">Buscar casal por nome</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome do casal…"
            className="w-full rounded-md border border-sand-200 bg-paper px-4 py-3 text-body text-cocoa-800 placeholder:text-cocoa-300 focus:border-champagne-500 focus:outline-none"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>Nenhum casal encontrado com esse nome.</EmptyState>
      ) : (
        <div className="overflow-hidden rounded-sm border border-sand-200 bg-paper">
          {filtered.map((c) => (
            <CoupleListItem key={c.id} couple={c} />
          ))}
        </div>
      )}

      <p className="text-caption text-cocoa-400">
        {filtered.length} {filtered.length === 1 ? 'casal' : 'casais'} de {couples.length}.
      </p>
    </div>
  );
}
