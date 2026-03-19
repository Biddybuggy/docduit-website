'use client';
import { useState } from 'react';
import { CalculationInputs } from '@/lib/interfaces';
import CalculationSection from './calculation';
import { cn, getCalculationResult } from '@/lib/utils';
import CalculationResultSection from '../../_components/calculation-result';
import GoldSavingResult from '../../_components/gold-saving-result';
import ForexSavingResult from '../../_components/forex-saving-result';

interface LayoutProps {
  vocabularies: any;
}

export default function IndexPage({ vocabularies }: LayoutProps) {
  const {
    vehicle: { label: titleSubject, title, subtitle },
  } = vocabularies;
  const [calculationInput, setCalculationInput] = useState<CalculationInputs>({
    label: titleSubject,
    term: 5,
    price: 100000,
    downPayment: 0,
    budget: 100000,
  });
  const [activeState, setActiveState] = useState<
    'input' | 'calculation' | 'gold' | 'forex'
  >('input');

  const calcResult = getCalculationResult(calculationInput);
  const { minusDP, monthlyToSaveDP } = calcResult;
  const resultProps = {
    ...calcResult,
    isUmroh: false,
    withDp: true,
  };

  const handleSubmission = (data: any) => {
    setCalculationInput((prev) => ({ ...prev, ...data }));
    if (activeState === 'input') setActiveState('calculation');
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 mt-20 lg:mt-0 lg:h-screen'>
      <div
        className={cn(
          'w-full bg-white flex items-center justify-center',
          activeState !== 'input' && 'hidden',
        )}
      >
        <div className='flex flex-col gap-2 text-center'>
          <img
            src='/illustrations/motor-calc.svg'
            alt='Vehicle'
            className='mx-auto'
          />
          <div className='text-4xl font-bold'>{title}</div>
          <div className='text-sm'>{subtitle}</div>
        </div>
      </div>
      <CalculationSection
        vocabularies={vocabularies}
        onSubmit={handleSubmission}
        className={activeState !== 'input' ? 'hidden lg:flex' : ''}
      />
      <CalculationResultSection
        onChangeActiveState={setActiveState}
        calculatorType='vehicle'
        titleSubject={titleSubject}
        vocabularies={vocabularies}
        calculation={resultProps}
        className={activeState === 'calculation' ? 'flex' : 'hidden'}
      />
      <GoldSavingResult
        onChangeActiveState={setActiveState}
        vocabularies={vocabularies}
        total={minusDP}
        monthlyToSave={monthlyToSaveDP}
        className={activeState === 'gold' ? 'flex' : 'hidden'}
        term={calculationInput.term}
      />
      <ForexSavingResult
        onChangeActiveState={setActiveState}
        vocabularies={vocabularies}
        total={minusDP}
        monthlyToSave={monthlyToSaveDP}
        className={activeState === 'forex' ? 'flex' : 'hidden'}
        term={calculationInput.term}
      />
    </div>
  );
}
