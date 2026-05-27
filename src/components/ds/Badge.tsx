import { cn } from '@/lib/utils/cn';

type Variant = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  accent: 'bg-champagne-100 text-champagne-700',
  neutral: 'bg-sand-50 text-cocoa-700',
  success: 'bg-moss-50 text-moss-700',
  warning: 'bg-mustard-50 text-mustard-700',
  danger: 'bg-terracotta-50 text-terracotta-700',
};

export function Badge({ children, variant = 'accent', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
