import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ children, className }: EmptyStateProps) {
  return (
    <div className={cn('py-4 text-body-sm italic text-cocoa-400', className)}>
      {children ?? 'Nenhuma resposta nesta seção.'}
    </div>
  );
}
