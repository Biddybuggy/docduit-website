'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoldSavingSchema from './gold-saving/gold-schema';
import GoldSavingSimulation from './gold-saving/gold-simulation';
import Link from 'next/link';
import { referalLink } from '@/lib/constants';
import useUserSessionQuery from '@/hooks/use-user-session';
import { safeSendGAEvent } from '@/lib/analytics';

interface LayoutProps {
  vocabularies: any;
  total: number;
  monthlyToSave: number;
  onChangeActiveState: (
    state: 'input' | 'calculation' | 'gold' | 'forex',
  ) => void;
  className?: string;
  term: number;
}

export default function GoldSavingResult({
  vocabularies,
  total,
  monthlyToSave,
  term,
  onChangeActiveState,
  className,
}: LayoutProps) {
  const { userInfo } = useUserSessionQuery();
  const {
    backToResult: backText,
    schema: schemaText,
    simulation: simulationText,
    goldSavingSection: { title, open: openSavingText },
  } = vocabularies;

  return (
    <div
      className={cn(
        'w-full flex flex-col gap-20 lg:gap-8 bg-white px-8 pt-8 lg:pt-28 lg:px-24 items-center justify-between overflow-auto',
        className,
      )}
    >
      <div className='w-full flex flex-col gap-8 items-center justify-center'>
        <div className='flex flex-col gap-2 text-center'>
          <img
            src='/illustrations/coin-stack.svg'
            alt='coin-stack'
            className='mx-auto'
          />
          <p className='font-bold text-xl lg:text-3xl text-center'>{title}</p>
        </div>
        <Tabs defaultValue='schema'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger className='rounded-l-full' value='schema'>
              {schemaText}
            </TabsTrigger>
            <TabsTrigger className='rounded-r-full' value='simulation'>
              {simulationText}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='schema'>
            <GoldSavingSchema
              vocabularies={vocabularies}
              total={total}
              monthlyToSave={monthlyToSave}
              term={term}
            />
          </TabsContent>
          <TabsContent value='simulation'>
            <GoldSavingSimulation
              monthlyToSave={monthlyToSave}
              vocabularies={vocabularies}
            />
          </TabsContent>
        </Tabs>

        <div className='flex flex-col gap-2'>
          <Link
            href={referalLink}
            target='_blank'
            onClick={(e) => {
              e.preventDefault();
              safeSendGAEvent('event', 'click_treasury_referral', {
                link: referalLink,
                email: userInfo?.email,
                fullName: userInfo?.name,
              });
              window.open(referalLink, '_blank');
            }}
          >
            <Button size='lg' variant='yellow'>
              {openSavingText}
            </Button>
          </Link>
          <Button
            onClick={() => onChangeActiveState('calculation')}
            variant='link'
          >
            {backText}
          </Button>
        </div>
      </div>
    </div>
  );
}
