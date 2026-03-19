import { cn } from '@/lib/utils';
import { useState } from 'react';
import GoldPricesChart from './gold-prices-chart';
import { hourlyChart } from '@/lib/constants/gold-price-charts/hourly-chart';
import { monthlyChart } from '@/lib/constants/gold-price-charts/monthly-chart';
import { threeMonthChart } from '@/lib/constants/gold-price-charts/three-month-chart';
import { yearlyChart } from '@/lib/constants/gold-price-charts/yearly-chart';
import { sixMonthChart } from '@/lib/constants/gold-price-charts/six-month-chart';
import { fiveYearChart } from '@/lib/constants/gold-price-charts/five-year-chart';
import { goldBuyPrice, goldSellPrice } from '@/lib/constants';

interface LayoutProps {
  vocabularies: any;
  monthlyToSave: number;
}

export default function GoldSavingSimulation({
  vocabularies,
  monthlyToSave,
}: LayoutProps) {
  const {
    goldSavingSection: {
      disclaimerSimulation,
      simulation: { rp, gram, buy, sell, day, month, year },
    },
  } = vocabularies;
  const [ticker, setTicker] = useState<
    '1day' | '1month' | '3month' | '6month' | '1year' | '5year'
  >('1day');
  const gramAfforded = monthlyToSave / goldBuyPrice;
  const [pricesChartData, setPricesChartData] = useState(hourlyChart.data);

  return (
    <div className='w-full flex flex-col gap-4 items-center justify-center'>
      <div className='flex gap-4 w-full'>
        <div className='w-full bg-white border border-black rounded-xl p-2'>
          <p className='text-sm'>{rp}</p>
          <p className='font-semibold text-lg'>
            Rp&nbsp;{monthlyToSave.toLocaleString('id-ID')}
          </p>
        </div>
        <div className='w-full  bg-white border border-black rounded-xl p-2'>
          <p className='text-sm'>{gram}</p>
          <p className='font-semibold text-lg'>{gramAfforded.toFixed(3)}</p>
        </div>
      </div>
      <div className='flex gap-4 w-full justify-center'>
        <div className='bg-white p-2'>
          <p className='text-sm text-center'>{buy}</p>
          <p className='font-semibold text-lg text-center'>
            Rp&nbsp;{goldBuyPrice.toLocaleString('id-ID')}{' '}
            <span className='text-sm'>/gram</span>
          </p>
        </div>
        <div className='bg-white p-2'>
          <p className='text-sm text-center'>{sell}</p>
          <p className='font-semibold text-lg text-center'>
            Rp&nbsp;{goldSellPrice.toLocaleString('id-ID')}{' '}
            <span className='text-sm'>/gram</span>
          </p>
        </div>
      </div>
      <div className='max-w-[300px] lg:max-w-[500px] overflow-x-auto'>
        <div className='flex gap-4 flex-nowrap justify-center text-nowrap w-max'>
          <div
            className={cn(
              'border border-docduit-blue bg-white text-docduit-blue py-2 px-4 rounded-full cursor-pointer',
              ticker === '1day' && 'bg-docduit-blue text-white',
            )}
            onClick={() => {
              setTicker('1day');
              setPricesChartData(hourlyChart.data);
            }}
          >
            1 {day}
          </div>
          <div
            className={cn(
              'border border-docduit-blue bg-white text-docduit-blue py-2 px-4 rounded-full cursor-pointer',
              ticker === '1month' && 'bg-docduit-blue text-white',
            )}
            onClick={() => {
              setTicker('1month');
              setPricesChartData(monthlyChart.data);
            }}
          >
            1 {month}
          </div>
          <div
            className={cn(
              'border border-docduit-blue bg-white text-docduit-blue py-2 px-4 rounded-full cursor-pointer',
              ticker === '3month' && 'bg-docduit-blue text-white',
            )}
            onClick={() => {
              setTicker('3month');
              setPricesChartData(threeMonthChart.data);
            }}
          >
            3 {month}
          </div>
          <div
            className={cn(
              'border border-docduit-blue bg-white text-docduit-blue py-2 px-4 rounded-full cursor-pointer',
              ticker === '6month' && 'bg-docduit-blue text-white',
            )}
            onClick={() => {
              setTicker('6month');
              setPricesChartData(sixMonthChart.data);
            }}
          >
            6 {month}
          </div>
          <div
            className={cn(
              'border border-docduit-blue bg-white text-docduit-blue py-2 px-4 rounded-full cursor-pointer',
              ticker === '1year' && 'bg-docduit-blue text-white',
            )}
            onClick={() => {
              setTicker('1year');
              setPricesChartData(yearlyChart.data);
            }}
          >
            1 {year}
          </div>
          <div
            className={cn(
              'border border-docduit-blue bg-white text-docduit-blue py-2 px-4 rounded-full cursor-pointer',
              ticker === '5year' && 'bg-docduit-blue text-white',
            )}
            onClick={() => {
              setTicker('5year');
              setPricesChartData(fiveYearChart.data);
            }}
          >
            5 {year}
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 border'>
          <GoldPricesChart data={pricesChartData} />
        </div>
        <p className='text-xs italic'>{disclaimerSimulation}</p>
      </div>
    </div>
  );
}
