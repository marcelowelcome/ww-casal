import { cn } from '@/lib/utils/cn';
import { Eyebrow } from './Eyebrow';

type Level = 'page' | 'section' | 'subsection';

interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  eyebrowOrnament?: boolean;
  title: React.ReactNode;
  level?: Level;
  className?: string;
  id?: string;
  as?: 'h1' | 'h2' | 'h3';
}

const SIZE_BY_LEVEL: Record<Level, string> = {
  page: 'ww-display',
  section: 'ww-h2',
  subsection: 'ww-h3',
};

const MARGIN_BY_LEVEL: Record<Level, string> = {
  page: 'mb-6',
  section: 'mb-5',
  subsection: 'mb-4',
};

export function SectionHeader({
  eyebrow,
  eyebrowOrnament = false,
  title,
  level = 'section',
  className,
  id,
  as,
}: SectionHeaderProps) {
  const HeadingTag = as ?? (level === 'page' ? 'h1' : level === 'section' ? 'h2' : 'h3');

  return (
    <header className={cn(MARGIN_BY_LEVEL[level], className)} id={id}>
      {eyebrow ? <Eyebrow ornament={eyebrowOrnament}>{eyebrow}</Eyebrow> : null}
      <HeadingTag className={SIZE_BY_LEVEL[level]}>{title}</HeadingTag>
    </header>
  );
}
