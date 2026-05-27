'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SidebarNavItem {
  id: string;
  label: string;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  eyebrow?: string;
  className?: string;
}

export function SidebarNav({ items, eyebrow = 'Seções', className }: SidebarNavProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Seções do briefing"
      className={cn('ww-sidebar py-8 pl-6 pr-3', className)}
    >
      <div className="mb-3.5 text-[9px] font-medium uppercase tracking-[3px] text-champagne-500">
        {eyebrow}
      </div>
      <ul className="m-0 list-none p-0">
        {items.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn(
                '-ml-3 block border-l-2 border-transparent px-3 py-1.5 text-xs leading-[18px] transition-colors',
                s.id === active
                  ? 'border-l-champagne-500 bg-sand-50 font-medium text-cocoa-900'
                  : 'text-cocoa-700 hover:text-cocoa-900',
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
