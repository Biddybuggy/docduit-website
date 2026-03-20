'use client';

const isDemoMode = process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true';
const consultHref = (locale: string) =>
  isDemoMode ? `/${locale}/consultation` : `/${locale}/under-maintenance`;

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronDown, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import MessengerV2 from '../../(chat)/consultation/_components/messenger-v2';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface FloatingChatComponentProps {
  vocabularies: any;
  locale: string;
}

export default function FloatingChatComponent({
  vocabularies,
  locale,
}: FloatingChatComponentProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('r');
  return (
    <>
      <div className='fixed bottom-0 md:bottom-4 right-0 md:right-4 max-w-lg md:min-w-[400px] z-666 flex flex-col items-end'>
        {isChatOpen ? (
          <Card className='shadow-lg'>
            <CardHeader className='bg-docduit-blue rounded-t-lg py-2'>
              <div className='flex justify-between items-center'>
                <Link
                  href={consultHref(locale)}
                  onClick={() =>
                    (window.location.href = consultHref(locale))
                  }
                >
                  <SquareArrowOutUpRight size={24} color='white' />
                </Link>
                <div className='text-white text-center'>
                  <p className='font-semibold text-lg'>Docduit</p>
                  <p className='font-light'>Dokter Urusan Duit</p>
                </div>
                <Button
                  onClick={() => {
                    router.push(`/${locale}`, { scroll: false });
                    setIsChatOpen(false);
                  }}
                  variant='link'
                >
                  <ChevronDown size={24} color='white' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='flex flex-col min-w-full md:min-w-[400px] md:max-w-[400px] md:h-[500px] overflow-auto'>
                <MessengerV2
                  vocabularies={vocabularies}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='mb-2 mr-2'>
            <Button
              className='min-w-14 min-h-14'
              variant='link'
              onClick={() => {
                router.push(consultHref(locale));
              }}
            >
              <Image
                src='/icons/docduit-icon.svg'
                alt='docduit-icon'
                className='w-14 h-14'
                width={14}
                height={14}
              />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
