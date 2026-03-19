'use client';
import { CalculationResultProps } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';
import { BarChartComponent, ChartDataType } from './bar-charts';
import { cn, formatMonth } from '@/lib/utils';

interface LayoutProps {
  calculatorType: string;
  titleSubject: string;
  vocabularies: any;
  calculation: CalculationResultProps;
  className?: string;
  onChangeActiveState: (
    state: 'input' | 'calculation' | 'gold' | 'forex',
  ) => void;
}

export default function CalculationResultSection({
  calculatorType,
  titleSubject,
  vocabularies,
  calculation,
  className,
  onChangeActiveState,
}: LayoutProps) {
  const {
    back: backText,
    in: inText,
    on: onText,
    common: { goldBtn: goldBtnText, forexBtn: forexBtnText, otherInstrument },
  } = vocabularies;
  const calculatorTypeVocab = vocabularies[calculatorType];
  const {
    result: {
      titleIntro,
      amountToSave,
      yourMoney: budgetText,
      minus: minusText,
      savedMoney,
    },
  } = calculatorTypeVocab;

  const {
    budget,
    minus,
    minusDP,
    monthlyToSave,
    monthlyToSaveDP,
    installment36Month,
    term,
    isUmroh,
    withDp,
    dateText,
  } = calculation;

  const monthText = formatMonth(term, {
    singular: vocabularies?.month,
    plural: vocabularies?.months,
  });

  const chartData: ChartDataType[] = Array.from(
    { length: term },
    (_, index) => ({
      month: `${index + 1}`,
      balance:
        (index + 1) *
        (withDp ? Math.round(monthlyToSaveDP) : Math.round(monthlyToSave)),
    }),
  );

  return (
    <div
      className={cn(
        'w-full flex flex-col gap-20 lg:gap-8 bg-white px-8 py-8 lg:py-28 lg:px-24 items-center justify-between',
        className,
      )}
    >
      <div className='w-full flex flex-col gap-8 items-center justify-center'>
        <div className='flex'>
          <p className='font-bold text-xl lg:text-3xl text-center'>
            {titleIntro}&nbsp;
            <span className='text-docduit-blue'>{titleSubject === "Electronics" ? "" : titleSubject === "Marriage" ? "" :titleSubject === "Vehicle" ? "" : titleSubject === "Others" ? "" :titleSubject}</span>&nbsp;
            {isUmroh ? onText : inText}&nbsp;
            {isUmroh ? (
              <span className='text-docduit-blue'>{dateText}</span>
            ) : (
              <span className='text-docduit-blue'>
                {term}&nbsp;
                {monthText}
              </span>
            )}
          </p>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-sm text-center'>{amountToSave}</p>
          <div className='bg-docduit-lightblue border border-black rounded-full p-2'>
            <p className='font-semibold text-lg text-center'>
              Rp&nbsp;
              {withDp
                ? Math.round(monthlyToSaveDP).toLocaleString('id-ID')
                : Math.round(monthlyToSave).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 w-full'>
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-sm text-center'>{budgetText}</p>
            <div className='bg-docduit-lightyellow border border-black rounded-full p-2'>
              <p className='font-bold text-center w-full'>
                Rp&nbsp;
                {withDp
                  ? installment36Month.toLocaleString('id-ID')
                  : budget.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-sm text-center'>{minusText}</p>
            <div className='bg-docduit-lightred border border-black rounded-full p-2 w-full'>
              <p className='font-bold text-center'>
                Rp&nbsp;
                {withDp
                  ? minusDP.toLocaleString('id-ID')
                  : minus.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className=''>{savedMoney}</p>
          <BarChartComponent data={chartData} />
        </div>
        <p className='text-center'>{otherInstrument}</p>
        <div className='flex flex-col lg:flex-row gap-2'>
          <Button
            onClick={() => onChangeActiveState('gold')}
            variant='yellow'
            size='lg'
          >
            {goldBtnText}
          </Button>
          <Button
            onClick={() => onChangeActiveState('forex')}
            size='lg'
            variant='blue'
          >
            {forexBtnText}
          </Button>
          <Button
            onClick={() => onChangeActiveState('input')}
            className='lg:hidden'
            variant='link'
          >
            {backText}
          </Button>
        </div>
      </div>
    </div>
  );
}
