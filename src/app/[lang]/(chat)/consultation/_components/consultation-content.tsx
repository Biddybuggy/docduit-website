'use client';
import { Suspense, useState } from 'react';
import HistoryChatContent from './history-chat-content';
import { PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import NewConsultationBtn from './new-consultation-btn';
import AuthDialog from '@/app/[lang]/_components/auth/auth-dialog';
import MessengerV2 from './messenger-v2';
import { useAuth } from '@/hooks/useAuth';

const isDemoMode = process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true';

interface ConsultationContentProps {
  vocabularies: any;
}

export default function ConsultationContent({
  vocabularies,
}: ConsultationContentProps) {
  const [showHistory, setShowHistory] = useState(true);
  const { user, isLoading } = useAuth();
  const showAuthDialog = !isDemoMode && !isLoading && !user;
  const showHistorySidebar = !isDemoMode;

  return (
    <>
      <div className='flex h-[calc(100vh-80px)]'>
        {showHistorySidebar && (
          <div
            className={cn(
              'min-w-[260px] max-w-[260px] bg-docduit-blue overflow-auto',
              showHistory ? 'hidden lg:flex' : 'hidden',
            )}
          >
            <div className='flex flex-col py-6 px-4 text-white h-full w-full'>
              <div className='flex gap-4 justify-end mb-4'>
                <NewConsultationBtn />
                <PanelLeft
                  size={24}
                  color='white'
                  onClick={() => setShowHistory(false)}
                  className='cursor-pointer'
                />
              </div>
              <Suspense fallback={null}>
                <HistoryChatContent vocabularies={vocabularies} />
              </Suspense>
            </div>
          </div>
        )}
        <div className='w-full flex flex-col gap-4'>
          {showHistorySidebar ? (
            <div
              className={cn(
                'flex gap-4 items-end mb-4 p-4',
                showHistory ? 'hidden' : 'hidden lg:flex',
              )}
            >
              <PanelLeft
                size={24}
                color='black'
                className='cursor-pointer'
                onClick={() => setShowHistory(true)}
              />
              <NewConsultationBtn color='black' />
            </div>
          ) : (
            <div className='flex gap-4 items-end mb-4 p-4 justify-end'>
              <NewConsultationBtn color='black' />
            </div>
          )}
          <Suspense fallback={null}>
            <MessengerV2
              className='mx-5 lg:mx-32 xl:mx-64 my-8 lg:my-12'
              vocabularies={vocabularies}
            />
          </Suspense>
        </div>
      </div>

      {showAuthDialog && (
        <AuthDialog
          isOpen={true}
          setIsOpen={() => {}}
          vocabularies={vocabularies}
          keepOpen={true}
          showBackLink={true}
        />
      )}
    </>
  );
}
