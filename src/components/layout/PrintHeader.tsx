import { formatDate } from '@/lib/utils/format';

interface PrintHeaderProps {
  coupleName: string;
}

export function PrintHeader({ coupleName }: PrintHeaderProps) {
  return (
    <div className="print-only">
      <div className="mb-6 flex items-end justify-between border-b border-sand-200 pb-4">
        <div className="font-serif text-base text-cocoa-900">
          Welcome <em className="italic text-champagne-700">Weddings</em>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-cocoa-400">
          Briefing — {coupleName} — {formatDate(new Date())}
        </div>
      </div>
    </div>
  );
}
