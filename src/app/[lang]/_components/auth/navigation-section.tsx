'use client';

import useUserSessionQuery from '@/hooks/use-user-session';
import { NavigationItem } from '../header';
import Link from 'next/link';
import { safeSendGAEvent } from '@/lib/analytics';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface INavigationSection {
  navigations: NavigationItem[];
}
export default function NavigationSection({ navigations }: INavigationSection) {
  const { userInfo } = useUserSessionQuery();
  const onNavigationClicked = (gaEvent: string) => {
    safeSendGAEvent('event', gaEvent, {
      email: userInfo?.email,
      name: userInfo?.name,
    });
  };
  return (
    <ul className='hidden lg:flex items-center gap-6 xl:gap-8'>
      {navigations.map((nav: NavigationItem) => (
        <li key={nav.name}>
          {nav.children?.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-1 text-sm font-medium'>
                {nav.name}
                <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                {nav.children.map((child) => (
                  <DropdownMenuItem key={child.name} asChild>
                    <Link
                      href={child.href ?? '#'}
                      onClick={() => onNavigationClicked(child.gaEvent || '')}
                    >
                      {child.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              className='text-sm font-medium'
              href={nav.href ?? '#'}
              onClick={() => {
                onNavigationClicked(nav.gaEvent || '');
              }}
            >
              {nav.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
