'use client';

import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * A Card whose header doubles as a collapse toggle. By default the body is
 * always visible on desktop (>=lg) and only mobile respects the `open` state,
 * so the card renders like a normal Card on desktop. Pass `desktopCollapsible`
 * for secondary sections that should also collapse on desktop — the chevron
 * then shows at every breakpoint and `open` is honored everywhere.
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
  desktopCollapsible = false,
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
  desktopCollapsible?: boolean;
  children: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className={cn('py-4', headerClassName)}>
        <button
          type='button'
          onClick={onToggle}
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between gap-2 text-left',
            !desktopCollapsible && 'lg:cursor-default',
          )}
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
              'h-4 w-4 shrink-0 text-slate-400 transition-transform',
              !desktopCollapsible && 'lg:hidden',
              open && 'rotate-180',
            )}
          />
        </button>
      </CardHeader>
      <CardContent
        className={cn(
          !open && (desktopCollapsible ? 'hidden' : 'hidden lg:block'),
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
