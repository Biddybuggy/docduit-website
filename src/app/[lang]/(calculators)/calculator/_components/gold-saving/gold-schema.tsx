import { getCumltvSumWCAGR } from '@/lib/utils';
import GoldChart, { GoldChartDataType } from './gold-chart';
import { goldCAGR } from '@/lib/constants';

interface LayoutProps {
  vocabularies: any;
  monthlyToSave: number;
  term: number;
  total: number;
}

export default function GoldSavingSchema({
  vocabularies,
  monthlyToSave,
  term,
  total,
}: LayoutProps) {
  const {
    goldSavingSection: {
      monthly,
      savedMoney: savedMoneyText,
      normalSaving,
      goldSaving,
      disclaimerSchema,
    },
  } = vocabularies;
  const cumulativeCAGR = getCumltvSumWCAGR(monthlyToSave, term, goldCAGR);
  const totalIncreased = cumulativeCAGR[term - 1];
  const data: GoldChartDataType[] = Array.from(
    { length: term },
    (_, index) => ({
      month: `${index + 1}`,
      common: (index + 1) * Math.round(monthlyToSave),
      gold: cumulativeCAGR[index],
    }),
  );
  return (
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
      <div className='flex flex-col items-center justify-center gap-2 border'>
        <div className='hidden lg:flex flex-col items-start justify-center p-4'>
          <div className='flex gap-2 items-center'>
            <span className='rounded-full bg-docduit-red/50 w-6 h-4' />
            <span className='text-gray-400'>{normalSaving}</span>
            <span className='font-semibold'>
              Rp&nbsp;{total.toLocaleString('id-ID')}
            </span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className='rounded-full bg-docduit-yellow/50 w-6 h-4' />
            <span className='text-gray-400'>{goldSaving}</span>
            <span className='font-semibold'>
              Rp&nbsp;{totalIncreased.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
        <div className='flex lg:hidden flex-col gap-4 items-start justify-center p-4 w-full'>
          <div className='flex flex-col items-center border-l-8 border-docduit-red/50 w-full px-2'>
            <span className='text-gray-400 w-full'>{normalSaving}</span>
            <span className='font-semibold w-full'>
              Rp&nbsp;{total.toLocaleString('id-ID')}
            </span>
          </div>
          <div className='flex flex-col items-center border-l-8 border-docduit-yellow/50 w-full px-2'>
            <span className='text-gray-400 w-full'>{goldSaving}</span>
            <span className='font-semibold w-full'>
              Rp&nbsp;{totalIncreased.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
        <GoldChart vocabularies={vocabularies} data={data} />
      </div>
      <p className='text-xs font-light'>{disclaimerSchema}</p>
    </div>
  );
}
