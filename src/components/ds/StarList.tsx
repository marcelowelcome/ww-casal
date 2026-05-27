import { cn } from '@/lib/utils/cn';

interface StarListProps {
  items: React.ReactNode[];
  className?: string;
}

export function StarList({ items, className }: StarListProps) {
  if (items.length === 0) return null;
  return (
    <ul className={cn('m-0 list-none space-y-1.5 p-0 text-body-sm text-cocoa-800', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span aria-hidden className="pt-0.5 text-xs text-champagne-500">
            ✦
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
