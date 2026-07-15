'use client';

import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * A Card whose header doubles as a collapse toggle on mobile. On desktop
 * (>=lg) the body is always visible and the chevron is hidden, so the card
 * renders exactly like a normal Card; only mobile respects the `open` state.
 */
export function CollapsibleCard({
  title,
  open,
  onToggle,
  className,
  headerClassName,
  contentClassName,
  titleClassName,
  accessory,
  children,
}: {
  title: ReactNode;
  open: boolean;
  onToggle: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  accessory?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className={cn('pb-3', headerClassName)}>
        <button
          type='button'
          onClick={onToggle}
          aria-expanded={open}
          className='flex w-full items-center justify-between gap-2 text-left lg:cursor-default'
        >
          <span
            className={cn(
              'flex items-center gap-2 text-base font-semibold leading-tight text-slate-900',
              titleClassName,
            )}
          >
            {accessory}
            {title}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-slate-400 transition-transform lg:hidden',
              open && 'rotate-180',
            )}
          />
        </button>
      </CardHeader>
      <CardContent className={cn(!open && 'hidden lg:block', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
