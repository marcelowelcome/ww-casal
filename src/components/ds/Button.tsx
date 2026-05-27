import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-champagne-500 hover:bg-champagne-600 text-paper font-bold',
  secondary: 'bg-cocoa-900 hover:bg-cocoa-800 text-paper font-bold',
  ghost: 'text-champagne-700 hover:text-champagne-800 hover:bg-sand-50 font-medium',
};

const SIZES: Record<Size, string> = {
  lg: 'h-[54px] px-7 text-xs tracking-wider uppercase',
  md: 'h-11 px-5 text-xs tracking-wider uppercase',
  sm: 'h-8 px-3 text-[11px] tracking-wide uppercase',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-sm transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    />
  );
});
