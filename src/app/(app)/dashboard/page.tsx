import { getAggregates } from '@/lib/sheets/queries';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { Eyebrow, EmptyState } from '@/components/ds';

export const revalidate = 600;

export default async function DashboardPage() {
  const a = await getAggregates();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
      <Eyebrow ornament>Tendências</Eyebrow>
      <h1 className="mb-3 font-serif text-h1 font-normal text-cocoa-900">
        Visão <em className="italic text-champagne-500">agregada</em>
      </h1>
      <p className="mb-10 max-w-2xl text-body text-cocoa-700">
        Visão geral dos briefings recebidos. Use para identificar padrões e calibrar planejamento. Os
        números abaixo refletem o cache atual (5 a 10 minutos).
      </p>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Casais com briefing" value={a.total} />
        <MetricCard label="Preenchidos nos últimos 30 dias" value={a.submittedLast30Days} />
        <MetricCard
          label="Casamentos nos próximos 6 meses"
          value={a.weddingsInNext6Months}
          hint="Considera apenas datas reconhecíveis no campo de data/período."
        />
      </div>

      {a.total === 0 ? (
        <EmptyState>
          Ainda não há briefings suficientes para gerar tendências. Volte assim que os primeiros
          casais preencherem.
        </EmptyState>
      ) : (
        <>
          <DashboardCharts
            destinations={a.destinations}
            budgetBuckets={a.budgetBuckets}
            guestBuckets={a.guestBuckets}
            ceremonyFormat={a.ceremonyFormat}
          />

          {a.ceremonyType.length > 0 ? (
            <section className="mt-10 rounded-sm border border-sand-200 bg-paper p-6">
              <h3 className="mb-4 font-serif text-h3 font-normal text-cocoa-900">
                Tipo de <em className="italic text-champagne-500">cerimônia</em>
              </h3>
              <ul className="space-y-2.5">
                {a.ceremonyType.map((i) => (
                  <li
                    key={i.type}
                    className="flex items-baseline justify-between gap-4 border-b border-sand-200 pb-2 last:border-b-0"
                  >
                    <span className="text-body text-cocoa-800">{i.type}</span>
                    <span className="text-caption text-cocoa-500">{i.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
