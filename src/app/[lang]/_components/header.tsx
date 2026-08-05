'use client';
import { Globe, Menu, HelpCircle } from 'lucide-react';
import { OPEN_ONBOARDING_EVENT } from './onboarding/onboarding-modal';
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
import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '../_utils/dictionaries';
import AuthenticationSection from './auth/authentication-section';
import { ReactQueryProvider } from '@/lib/react-query';
import NavigationSection from './auth/navigation-section';
import NavigationMobileSection from './auth/navigation-mobile-section';
import { useState } from 'react';

export type NavigationItem = {
  name: string;
  /** Omitted for group headers, which only open a dropdown of `children`. */
  href?: string;
  gaEvent?: string;
  /** Desktop collapses these into a dropdown; mobile lists them inline. */
  children?: NavigationItem[];
};

export const LocalesButton = ({
  label,
  onBeforeNavigate,
}: {
  label?: string;
  onBeforeNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const getLocaleHref = (targetLocale: Locale) => {
    const currentPath = pathname || '/id';
    const segments = currentPath.split('/');

    if (segments[1] === 'id' || segments[1] === 'en') {
      segments[1] = targetLocale;
      return segments.join('/') || `/${targetLocale}`;
    }

    return `/${targetLocale}${currentPath}`;
  };

  const handleLocaleClick = (targetLocale: Locale) => {
    // Close the Sheet first so Radix can clean up body pointer-events
    // before navigation unmounts the component.
    onBeforeNavigate?.();
    setTimeout(() => router.push(getLocaleHref(targetLocale)), 0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={`flex gap-2 items-center hover:bg-black/15 focus:bg-black/15 rounded-full ${
            label ? 'p-4' : 'p-2'
          }`}
        >
          <Globe size={20} />
          {label ? <p className='font-semibold'>{label}</p> : <></>}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {onBeforeNavigate ? (
          <>
            <DropdownMenuItem onClick={() => handleLocaleClick('id')}>
              🇮🇩 Bahasa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLocaleClick('en')}>
              🇺🇸 English
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <Link href={getLocaleHref('id')}>🇮🇩 Bahasa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={getLocaleHref('en')}>🇺🇸 English</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TakeTourButton = ({
  label,
  showLabel = false,
  onClick,
}: {
  label?: string;
  /** Desktop shows the icon alone (tooltip only); the mobile sheet shows text. */
  showLabel?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={() => {
      onClick?.();
      window.dispatchEvent(new Event(OPEN_ONBOARDING_EVENT));
    }}
    title={label}
    aria-label={label}
    className='flex items-center gap-2 rounded-full p-2 hover:bg-black/15 focus:bg-black/15'
  >
    <HelpCircle size={20} />
    {showLabel && label ? (
      <span className='font-semibold'>{label}</span>
    ) : null}
  </button>
);

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
            <TakeTourButton
              label={vocabularies.navigation.takeTour}
              showLabel
              onClick={() => setIsOpen(false)}
            />
            <AuthenticationSection vocabularies={vocabularies} />
            <LocalesButton label={language} onBeforeNavigate={() => setIsOpen(false)} />
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
  const consultHref =
    process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true'
      ? `/${lang}/consultation`
      : `/${lang}/under-maintenance`;
  const navigations: NavigationItem[] = [
    { name: vocabularies.navigation.home, href: `/${lang}/#` },
    {
      name: vocabularies.navigation.consult,
      href: consultHref,
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
    {
      // The two long tool names are what crowd the signed-in bar, so on desktop
      // they live behind a single "Tools" dropdown.
      name: vocabularies.navigation.tools ?? (lang === 'id' ? 'Alat' : 'Tools'),
      children: [
        {
          name:
            vocabularies.navigation.financialTwin ?? 'Financial Twin Simulator',
          href: `/${lang}/financial-twin-simulator`,
          gaEvent: 'navigate_to_financial_twin_simulator',
        },
        {
          name:
            vocabularies.navigation.workflowAutomator ?? 'Workflow Automator',
          href: `/${lang}/financial-workflow-automator`,
          gaEvent: 'navigate_to_financial_workflow_automator',
        },
      ],
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
          <div className='hidden lg:flex gap-1 items-center'>
            <TakeTourButton label={vocabularies.navigation.takeTour} />
            <LocalesButton />
            <AuthenticationSection vocabularies={vocabularies} compact />
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
