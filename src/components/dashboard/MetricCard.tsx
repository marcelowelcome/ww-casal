interface MetricCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-sm border border-sand-200 bg-paper p-6">
      <div className="mb-2 text-[10px] uppercase tracking-[2px] text-cocoa-400">{label}</div>
      <div className="font-serif text-3xl text-cocoa-900">{value}</div>
      {hint ? <div className="mt-2 text-caption text-cocoa-500">{hint}</div> : null}
    </div>
  );
}
