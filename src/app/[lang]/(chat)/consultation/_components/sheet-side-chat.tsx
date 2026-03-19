'use client';
import { Menu } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';

const SheetSideChat = ({
  vocabularies,
  language,
}: {
  vocabularies: any;
  language: string;
}) => {
  const [openSheet, setOpenSheet] = useState(false);
  const { user } = useAuth();
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger>
        <Menu size={24} color='black' className='cursor-pointer' />
      </SheetTrigger>
      <ReactQueryProvider>
        <SheetContent
          useOverlay
          className='bg-docduit-blue overflow-auto'
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
          <SheetHeader>
            <SheetTitle className='justify-start text-start'></SheetTitle>
          </SheetHeader>
          <div className='flex flex-col py-6 px-4 text-white h-full w-full justify-between'>
            <Suspense fallback={null}>
              <HistoryChatContent
                vocabularies={vocabularies}
                onHistoryClick={() => setOpenSheet(false)}
              />
            </Suspense>
            <div className='flex flex-col'>
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
