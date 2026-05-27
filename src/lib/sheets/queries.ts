import { unstable_cache } from 'next/cache';
import { COLUMN_INDEX } from './schema';
import { parseCoupleRow } from './row-parser';
import { MOCK_ROWS } from './fixtures';
import type { Couple } from '@/types/couple';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID ?? '';
const TAB = process.env.GOOGLE_SHEETS_TAB ?? 'WW | Questionario Casal';
const USE_MOCK = process.env.USE_MOCK_DATA === '1';

async function fetchCouplesRaw(): Promise<string[][]> {
  if (USE_MOCK) return MOCK_ROWS;

  try {
    const { getSheetsClient } = await import('./client');
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A2:BP`,
    });
    return response.data.values ?? [];
  } catch (err) {
    console.error('[sheets] fetchCouplesRaw failed', err);
    return [];
  }
}

export const getCouples = unstable_cache(
  async (): Promise<Couple[]> => {
    const rows = await fetchCouplesRaw();
    return rows
      .filter((row) => row[COLUMN_INDEX.token])
      .map((row) => {
        try {
          return parseCoupleRow(row);
        } catch (err) {
          console.error('[sheets] parse failed for token', row[COLUMN_INDEX.token], err);
          return null;
        }
      })
      .filter((c): c is Couple => c !== null)
      .sort((a, b) => {
        const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
        const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
        return bTime - aTime;
      });
  },
  ['couples'],
  { revalidate: 300, tags: ['couples'] },
);

export async function getCoupleByToken(token: string): Promise<Couple | null> {
  const couples = await getCouples();
  return couples.find((c) => c.id === token) ?? null;
}

export interface Aggregates {
  total: number;
  submittedLast30Days: number;
  weddingsInNext6Months: number;
  destinations: { name: string; count: number }[];
  budgetBuckets: { bucket: string; count: number }[];
  guestBuckets: { bucket: string; count: number }[];
  ceremonyFormat: { format: string; count: number }[];
  ceremonyType: { type: string; count: number }[];
}

function parseBudgetToNumber(raw: string | null): number | null {
  if (!raw) return null;
  const clean = raw.replace(/[^\d,]/g, '').replace(',', '.');
  const n = Number(clean);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function bucketBudget(value: number): string {
  if (value < 100_000) return 'Até R$ 100k';
  if (value < 200_000) return 'R$ 100k – 200k';
  if (value < 300_000) return 'R$ 200k – 300k';
  if (value < 400_000) return 'R$ 300k – 400k';
  if (value < 600_000) return 'R$ 400k – 600k';
  return 'Acima de R$ 600k';
}

function bucketGuests(value: number): string {
  if (value < 30) return 'Até 30';
  if (value < 60) return '30 – 60';
  if (value < 100) return '60 – 100';
  if (value < 150) return '100 – 150';
  return 'Mais de 150';
}

function extractDestinationLabel(text: string | null): string | null {
  if (!text) return null;
  const first = text.split(/[.,;]/)[0]?.trim();
  return first && first.length <= 60 ? first : null;
}

export const getAggregates = unstable_cache(
  async (): Promise<Aggregates> => {
    const couples = await getCouples();
    const now = Date.now();
    const days30 = 30 * 24 * 60 * 60 * 1000;
    const months6 = 6 * 30 * 24 * 60 * 60 * 1000;

    const destinationsMap = new Map<string, number>();
    const budgetBucketsMap = new Map<string, number>();
    const guestBucketsMap = new Map<string, number>();
    const formatMap = new Map<string, number>();
    const typeMap = new Map<string, number>();

    let submittedLast30Days = 0;
    let weddingsInNext6Months = 0;

    for (const c of couples) {
      if (c.submitted_at) {
        const t = new Date(c.submitted_at).getTime();
        if (!isNaN(t) && now - t <= days30) {
          submittedLast30Days += 1;
        }
      }

      const dateText = c.data.especifica ?? c.data.periodo;
      if (dateText) {
        const parsed = new Date(dateText);
        if (!isNaN(parsed.getTime())) {
          const delta = parsed.getTime() - now;
          if (delta > 0 && delta <= months6) weddingsInNext6Months += 1;
        }
      }

      const dest =
        extractDestinationLabel(c.destino.gostaram) ?? extractDestinationLabel(c.destino.sonhos);
      if (dest) destinationsMap.set(dest, (destinationsMap.get(dest) ?? 0) + 1);

      const budget = parseBudgetToNumber(c.producao.orcamento);
      if (budget != null) {
        const b = bucketBudget(budget);
        budgetBucketsMap.set(b, (budgetBucketsMap.get(b) ?? 0) + 1);
      }

      if (c.convidados.numero != null) {
        const b = bucketGuests(c.convidados.numero);
        guestBucketsMap.set(b, (guestBucketsMap.get(b) ?? 0) + 1);
      }

      if (c.cerimonia.formato) {
        formatMap.set(c.cerimonia.formato, (formatMap.get(c.cerimonia.formato) ?? 0) + 1);
      }

      if (c.cerimonia.tipo) {
        typeMap.set(c.cerimonia.tipo, (typeMap.get(c.cerimonia.tipo) ?? 0) + 1);
      }
    }

    const toSorted = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

    return {
      total: couples.length,
      submittedLast30Days,
      weddingsInNext6Months,
      destinations: toSorted(destinationsMap).slice(0, 10),
      budgetBuckets: [...budgetBucketsMap.entries()].map(([bucket, count]) => ({ bucket, count })),
      guestBuckets: [...guestBucketsMap.entries()].map(([bucket, count]) => ({ bucket, count })),
      ceremonyFormat: [...formatMap.entries()].map(([format, count]) => ({ format, count })),
      ceremonyType: [...typeMap.entries()].map(([type, count]) => ({ type, count })),
    };
  },
  ['aggregates'],
  { revalidate: 600, tags: ['couples', 'aggregates'] },
);
