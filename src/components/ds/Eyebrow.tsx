import { cn } from '@/lib/utils/cn';

interface EyebrowProps {
  children: React.ReactNode;
  ornament?: boolean;
  className?: string;
}

export function Eyebrow({ children, ornament = false, className }: EyebrowProps) {
  return (
    <div className={cn('eyebrow', className)}>
      {ornament ? <>— {children} —</> : children}
    </div>
  );
}
