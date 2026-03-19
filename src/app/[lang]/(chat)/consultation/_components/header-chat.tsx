'use client';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Locale } from '../../../_utils/dictionaries';
import MobileNavigationContents from './mobile-navigation-contents';
import { ReactQueryProvider } from '@/lib/react-query';
import AuthenticationSection from '@/app/[lang]/_components/auth/authentication-section';

type NavigationItem = {
  name: string;
  href: string;
};

export const LocalesButton = ({ label }: { label?: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='flex gap-2 items-center hover:bg-black/15 focus:bg-black/15 p-4 rounded-full'>
          <Globe size={20} />
          {label ? <p className='font-semibold'>{label}</p> : <></>}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link
            href='/id/under-maintenance'
            onClick={() =>
              (window.location.href = '/id/under-maintenance')
            }
          >
            🇮🇩 Bahasa
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href='/en/under-maintenance'
            onClick={() =>
              (window.location.href = '/en/under-maintenance')
            }
          >
            🇺🇸 English
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface HeaderComponentProps {
  lang: Locale;
  vocabularies: any;
}

export default function HeaderChatComponent({
  lang,
  vocabularies,
}: HeaderComponentProps) {
  const navigations: NavigationItem[] = [
    { name: vocabularies.navigation.home, href: `/${lang}/#` },
    {
      name: vocabularies.navigation.consult,
      href: `/${lang}/under-maintenance`,
    },
    { name: vocabularies.navigation.aboutUs, href: `/${lang}/#testimonies` },
    { name: vocabularies.navigation.calculator, href: `/${lang}/#calculators` },
    { name: vocabularies.navigation.articles, href: `/${lang}/#articles` },
  ];

  return (
    <ReactQueryProvider>
      <header className='fixed top-0 left-0 w-full bg-white z-50 h-14 lg:h-20 flex items-center lg:border-b-2 lg:border-docduit-blue'>
        {/* Mobile view navigation */}
        <nav className='w-full flex lg:hidden justify-between px-5 items-center'>
          <MobileNavigationContents vocabularies={vocabularies} lang={lang} />
        </nav>

        {/* Web view navigations */}
        <nav className='w-full hidden lg:flex justify-between px-24 items-center'>
          <Link href={`/${lang}/`}>
            <p className='font-epilogue font-bold lg:text-2xl'>
              Doc<span className='text-docduit-blue'>duit</span>
            </p>
          </Link>
          <ul className='hidden lg:flex gap-10'>
            {navigations.map((nav) => (
              <li key={nav.name}>
                <a className='text-sm font-medium' href={nav.href}>
                  {nav.name}
                </a>
              </li>
            ))}
          </ul>
          <div className='hidden lg:flex gap-4 items-center'>
            <LocalesButton />
            <AuthenticationSection vocabularies={vocabularies} />
          </div>
        </nav>
      </header>
    </ReactQueryProvider>
  );
}
