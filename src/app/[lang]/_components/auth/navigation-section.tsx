'use client';

import useUserSessionQuery from '@/hooks/use-user-session';
import { NavigationItem } from '../header';
import Link from 'next/link';
import { safeSendGAEvent } from '@/lib/analytics';

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
    <ul className='hidden lg:flex gap-10'>
      {navigations.map((nav: NavigationItem) => (
        <li key={nav.name}>
          <Link
            className='text-sm font-medium'
            href={nav.href}
            onClick={(e) => {
              onNavigationClicked(nav.gaEvent || '');
            }}
          >
            {nav.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
