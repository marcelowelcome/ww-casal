import { cn } from '@/lib/utils/cn';

interface PullQuoteProps {
  children: React.ReactNode;
  cite?: string;
  className?: string;
}

export function PullQuote({ children, cite, className }: PullQuoteProps) {
  return (
    <blockquote
      cite={cite}
      className={cn(
        'my-5 border-l-2 border-champagne-500 py-1.5 pl-5 font-serif text-base italic leading-7 text-cocoa-700',
        className,
      )}
    >
      {children}
    </blockquote>
  );
}
