import { cn } from '@/lib/utils/cn';

interface DividerProps {
  className?: string;
}

export function HairlineDivider({ className }: DividerProps) {
  return <hr className={cn('my-9 border-0 border-t border-sand-200', className)} />;
}

export function OrnamentDivider({ className }: DividerProps) {
  return (
    <div
      aria-hidden
      className={cn('ww-ornament py-6 text-center font-serif text-champagne-500', className)}
      style={{ letterSpacing: '8px', fontSize: '13px' }}
    >
      • • •
    </div>
  );
}
