import { cn } from '@/lib/utils/cn';

type Density = 'dense' | 'comfortable' | 'spacious';

interface KVItem {
  label: string;
  value: React.ReactNode;
}

interface KeyValueListProps {
  items: KVItem[];
  density?: Density;
  className?: string;
}

const GAP_BY_DENSITY: Record<Density, string> = {
  dense: 'gap-y-2',
  comfortable: 'gap-y-3.5',
  spacious: 'gap-y-6',
};

function isEmpty(value: React.ReactNode): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function KeyValueList({ items, density = 'comfortable', className }: KeyValueListProps) {
  if (items.length === 0) return null;
  return (
    <dl
      className={cn(
        'grid grid-cols-[minmax(140px,170px)_1fr] gap-x-6',
        GAP_BY_DENSITY[density],
        className,
      )}
    >
      {items.map(({ label, value }) => (
        <KeyValueRow key={label} label={label} value={value} />
      ))}
    </dl>
  );
}

export function KeyValueRow({ label, value }: KVItem) {
  return (
    <>
      <dt className="pt-1 text-label font-medium uppercase tracking-wider text-cocoa-400">
        {label}
      </dt>
      <dd className="m-0 text-body-sm leading-6 text-cocoa-800">
        {isEmpty(value) ? <span className="text-cocoa-300">—</span> : value}
      </dd>
    </>
  );
}
