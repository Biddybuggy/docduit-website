'use client';
import { Button } from '@/components/ui/button';
import { cn, getCumltvSumWCAGR } from '@/lib/utils';
import { forexReferalLink, usdCAGR } from '@/lib/constants';
import ForexChart, { ForexChartDataType } from './forex-saving/forex-chart';
import Link from 'next/link';
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

export default function ForexSavingResult({
  vocabularies,
  total,
  monthlyToSave,
  onChangeActiveState,
  className,
  term,
}: LayoutProps) {
  const { userInfo } = useUserSessionQuery();
  const {
    backToResult: backText,
    forexSavingSection: {
      title,
      open: openSavingText,
      savedMoney: savedMoneyText,
      monthly,
      normalSaving,
      forexSaving,
      disclaimer,
    },
  } = vocabularies;
  const cumulativeCAGR = getCumltvSumWCAGR(monthlyToSave, term, usdCAGR);
  const totalIncreased = cumulativeCAGR[term - 1];
  const data: ForexChartDataType[] = Array.from(
    { length: term },
    (_, index) => ({
      month: `${index + 1}`,
      common: (index + 1) * Math.round(monthlyToSave),
      forex: cumulativeCAGR[index],
    }),
  );
  return (
    <div
      className={cn(
        'w-full flex flex-col gap-20 lg:gap-8 bg-white px-8 py-8 lg:py-28 lg:px-24 items-center justify-between overflow-auto',
        className,
      )}
    >
      <div className='w-full flex flex-col gap-8 items-center justify-center'>
        <div className='flex flex-col gap-2 text-center'>
          <img
            src='/illustrations/forex-saving.svg'
            alt='forex-saving'
            className='mx-auto'
          />
          <p className='font-bold text-xl lg:text-3xl text-center'>{title}</p>
        </div>
        <div className='w-full flex flex-col gap-4 items-center justify-center'>
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-sm text-center'>{monthly}</p>
            <div className='bg-docduit-lightblue border border-black rounded-full p-2'>
              <p className='font-semibold text-lg text-center'>
                Rp&nbsp;{Math.round(monthlyToSave).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <p className=''>{savedMoneyText}</p>
          <div>
            <div className='flex flex-col gap-2 border justify-center items-center'>
              <div className='flex flex-col items-start justify-center p-4'>
                <div className='flex gap-2 items-center'>
                  <span className='rounded-full bg-docduit-red w-6 h-4' />
                  <span className='text-gray-400'>{normalSaving}</span>
                  <span className='font-semibold'>
                    Rp&nbsp;{total.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='flex gap-2 items-center'>
                  <span className='rounded-full bg-docduit-blue w-6 h-4' />
                  <span className='text-gray-400'>{forexSaving}</span>
                  <span className='font-semibold'>
                    Rp&nbsp;{totalIncreased.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              <ForexChart data={data} />
            </div>
            <p className='text-xs font-light mt-2'>{disclaimer}</p>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <Link
            href={forexReferalLink}
            target='_blank'
            onClick={(e) => {
              e.preventDefault();
              safeSendGAEvent('event', 'click_danamon_referral', {
                link: forexReferalLink,
                email: userInfo?.email,
                fullName: userInfo?.name,
              });
              window.open(forexReferalLink, '_blank');
            }}
          >
            <Button size='lg' variant='blue'>
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
