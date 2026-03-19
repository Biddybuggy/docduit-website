'use client';

import useUserSessionQuery from '@/hooks/use-user-session';
import { NavigationItem } from '../header';
import Link from 'next/link';
import { safeSendGAEvent } from '@/lib/analytics';

interface INavigationSection {
  navigations: NavigationItem[];
  callbackFn: () => void;
}
export default function NavigationMobileSection({
  callbackFn,
  navigations,
}: INavigationSection) {
  const { userInfo } = useUserSessionQuery();
  const onNavigationClicked = (gaEvent: string) => {
    safeSendGAEvent('event', gaEvent, {
      email: userInfo?.email,
      name: userInfo?.name,
    });
  };
  return (
    <div className='space-y-6'>
      <nav className='space-y-1'>
        {navigations.map((nav, idx) => (
          <Link
            key={idx}
            href={nav.href}
            className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium'
            prefetch={false}
            onClick={() => {
              callbackFn();
              onNavigationClicked(nav.gaEvent || '');
            }}
          >
            {nav.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
