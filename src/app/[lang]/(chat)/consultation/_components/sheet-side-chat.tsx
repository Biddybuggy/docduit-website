'use client';
import Link from 'next/link';
import { Home, Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import HistoryChatContent from './history-chat-content';
import { ReactQueryProvider } from '@/lib/react-query';
import NewConsultationBtn from './new-consultation-btn';
import { Suspense, useState } from 'react';
import AuthenticationSection from '@/app/[lang]/_components/auth/authentication-section';
import { LocalesButton } from './header-chat';

const SheetSideChat = ({
  vocabularies,
  language,
}: {
  vocabularies: any;
  language: string;
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger>
        <Menu size={24} color='black' className='cursor-pointer' />
      </SheetTrigger>
      <ReactQueryProvider>
        <SheetContent
          useOverlay
          className='flex h-[100dvh] flex-col overflow-hidden bg-docduit-blue p-0'
          side='left'
          customCloseControl={
            <div className='absolute top-4 left-0 px-5 flex justify-between w-full'>
              <SheetClose className='rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
                <Menu strokeWidth={2} size={24} color='white' />
                <span className='sr-only'>Close</span>
              </SheetClose>
              <NewConsultationBtn
                onNewConsultClick={() => setOpenSheet(false)}
              />
            </div>
          }
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Consultation menu</SheetTitle>
          </SheetHeader>
          <div className='flex min-h-0 flex-1 flex-col px-4 pb-4 pt-20 text-white'>
            <div className='flex min-h-0 flex-1 flex-col gap-4'>
              <Link
                href={`/${language}`}
                className='flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15'
                onClick={() => setOpenSheet(false)}
              >
                <Home size={18} />
                <span>{vocabularies.navigation.home}</span>
              </Link>
              <div className='flex min-h-0 flex-1'>
                <Suspense fallback={null}>
                  <HistoryChatContent
                    vocabularies={vocabularies}
                    onHistoryClick={() => setOpenSheet(false)}
                  />
                </Suspense>
              </div>
            </div>
            <div className='flex shrink-0 flex-col pt-4'>
              <AuthenticationSection vocabularies={vocabularies} />
              <LocalesButton label={vocabularies.common.language} />
            </div>
          </div>
        </SheetContent>
      </ReactQueryProvider>
    </Sheet>
  );
};

export default SheetSideChat;
