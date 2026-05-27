'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Aggregates } from '@/lib/sheets/queries';
import { EmptyState } from '@/components/ds';

const PALETTE = ['#B8956A', '#7B603E', '#9A8C77', '#4A3F33', '#C2B197', '#6B7A4A', '#B2604A', '#C99F2E'];

interface ChartsProps {
  destinations: Aggregates['destinations'];
  budgetBuckets: Aggregates['budgetBuckets'];
  guestBuckets: Aggregates['guestBuckets'];
  ceremonyFormat: Aggregates['ceremonyFormat'];
}

function ChartFrame({
  title,
  children,
  empty,
}: {
  title: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="rounded-sm border border-sand-200 bg-paper p-6">
      <h3 className="mb-4 font-serif text-h3 font-normal text-cocoa-900">{title}</h3>
      {empty ? (
        <EmptyState>Dados insuficientes para este recorte.</EmptyState>
      ) : (
        <div className="h-72">{children}</div>
      )}
    </div>
  );
}

export function DashboardCharts({
  destinations,
  budgetBuckets,
  guestBuckets,
  ceremonyFormat,
}: ChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartFrame title="Destinos mais escolhidos" empty={destinations.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={destinations}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke="#E8DFD3" strokeDasharray="3 3" />
            <XAxis type="number" stroke="#9A8C77" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#4A3F33"
              fontSize={12}
              width={120}
            />
            <Tooltip cursor={{ fill: '#FAF6F0' }} />
            <Bar dataKey="count" fill="#B8956A" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="Faixa de orçamento" empty={budgetBuckets.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetBuckets} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="#E8DFD3" strokeDasharray="3 3" />
            <XAxis dataKey="bucket" stroke="#4A3F33" fontSize={11} />
            <YAxis stroke="#9A8C77" fontSize={12} allowDecimals={false} />
            <Tooltip cursor={{ fill: '#FAF6F0' }} />
            <Bar dataKey="count" fill="#7B603E" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="Número de convidados" empty={guestBuckets.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={guestBuckets} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="#E8DFD3" strokeDasharray="3 3" />
            <XAxis dataKey="bucket" stroke="#4A3F33" fontSize={12} />
            <YAxis stroke="#9A8C77" fontSize={12} allowDecimals={false} />
            <Tooltip cursor={{ fill: '#FAF6F0' }} />
            <Bar dataKey="count" fill="#C2B197" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="Formato de cerimônia" empty={ceremonyFormat.length === 0}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie
              data={ceremonyFormat}
              dataKey="count"
              nameKey="format"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={2}
            >
              {ceremonyFormat.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}
