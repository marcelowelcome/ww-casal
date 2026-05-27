import { SectionHeader } from '@/components/ds';
import { cn } from '@/lib/utils/cn';

interface BriefingSectionProps {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function BriefingSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: BriefingSectionProps) {
  return (
    <section
      id={id}
      className={cn('ww-section scroll-mt-24 border-b border-sand-200 py-10 last:border-b-0', className)}
    >
      <SectionHeader eyebrow={eyebrow} eyebrowOrnament title={title} level="section" />
      <div className="space-y-5">{children}</div>
    </section>
  );
}
