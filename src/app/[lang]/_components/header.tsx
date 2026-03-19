'use client';
import { Globe, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { Locale } from '../_utils/dictionaries';
import AuthenticationSection from './auth/authentication-section';
import { ReactQueryProvider } from '@/lib/react-query';
import NavigationSection from './auth/navigation-section';
import NavigationMobileSection from './auth/navigation-mobile-section';
import { useState } from 'react';

export type NavigationItem = {
  name: string;
  href: string;
  gaEvent?: string;
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
          <Link href='/id' onClick={() => (window.location.href = '/id')}>
            🇮🇩 Bahasa
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='/en' onClick={() => (window.location.href = '/en')}>
            🇺🇸 English
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SheetSidenav = ({
  vocabularies,
  locale,
  menuNavigations,
  language,
}: {
  menuNavigations: NavigationItem[];
  language: string;
  locale: Locale;
  vocabularies: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Menu size={20} strokeWidth={2} />
      </SheetTrigger>
      <SheetContent className='bg-docduit-blue' side='left'>
        <SheetHeader>
          <SheetTitle className='justify-start text-start'>
            <Link href={`/${locale}`}>
              <span className='font-epilogue font-bold text-white'>
                Docduit
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className='flex h-full flex-col justify-between py-6 px-4 text-white'>
          <NavigationMobileSection
            navigations={menuNavigations}
            callbackFn={() => setIsOpen(false)}
          />
          <div className='flex flex-col gap-4'>
            <AuthenticationSection vocabularies={vocabularies} />
            <LocalesButton label={language} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface HeaderComponentProps {
  lang: Locale;
  vocabularies: any;
}

export default function HeaderComponent({
  lang,
  vocabularies,
}: HeaderComponentProps) {
  const navigations: NavigationItem[] = [
    { name: vocabularies.navigation.home, href: `/${lang}/#` },
    {
      name: vocabularies.navigation.consult,
      href: `/${lang}/under-maintenance`,
      gaEvent: 'navigate_to_consultation',
    },
    {
      name: vocabularies.navigation.aboutUs,
      href: `/${lang}/#testimonies`,
      gaEvent: 'click_testimonies_section',
    },
    {
      name: vocabularies.navigation.calculator,
      href: `/${lang}/#calculators`,
      gaEvent: 'click_calculators_section',
    },
    {
      name: vocabularies.navigation.articles,
      href: `/${lang}/#articles`,
      gaEvent: 'click_articles_section',
    },
  ];

  return (
    <ReactQueryProvider>
      <header className='fixed top-0 left-0 w-full bg-docduit-blue text-white shadow-md z-50 h-14 lg:h-20 flex items-center rounded-b-[1.25rem]'>
        <nav className='w-full flex justify-between px-5 lg:px-24 items-center'>
          <Link href={`/${lang}`}>
            <span className='font-epilogue font-bold lg:text-2xl'>Docduit</span>
          </Link>
          <NavigationSection navigations={navigations} />
          <div className='hidden lg:flex gap-4 items-center'>
            <LocalesButton />
            <AuthenticationSection vocabularies={vocabularies} />
          </div>
          <div className='lg:hidden'>
            <SheetSidenav
              vocabularies={vocabularies}
              locale={lang}
              menuNavigations={navigations}
              language={vocabularies.common.language}
            />
          </div>
        </nav>
      </header>
    </ReactQueryProvider>
  );
}
