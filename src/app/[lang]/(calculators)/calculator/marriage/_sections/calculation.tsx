import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn, formatMonth } from '@/lib/utils';
import { useState } from 'react';
import PriceDetailsDrawerButton from './price-details';
import InputCalculationNumber from '@/components/shared/input-calculation-number';

interface LayoutProps {
  vocabularies: any;
  onSubmit: (args: any) => void;
  className?: string;
}

export default function CalculationSection({
  className,
  vocabularies,
  onSubmit,
}: LayoutProps) {
  const {
    calculate,
    month,
    months,
    marriage: {
      questions: {
        package: packageQuestion,
        packageOption,
        terms: termsQuestion,
        budget: budgetQuestion,
      },
    },
  } = vocabularies;

  const standardPrice = 175000000;
  const luxuryPrice = 775000000;

  const [term, setTerm] = useState<number>(5);
  const [price, setPrice] = useState<number>(42000000);
  const [customPrice, setCustomPrice] = useState<number>(42000000);
  const [budget, setBudget] = useState<number>(200000);
  const [selectedPackage, setSelectedPackage] = useState<string>('economic');

  const changePackage = (packageType: string, price: number) => {
    setSelectedPackage(packageType);
    setPrice(price);
  };

  const handleDetailSubmit = (totalAmount: any) => {
    setCustomPrice(totalAmount);
  };

  const handleSubmit = () => {
    onSubmit({ term, price, budget });
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col gap-20 lg:gap-8 bg-white lg:bg-docduit-lightblue px-8 py-8 lg:py-28 lg:px-24 items-center justify-between',
        className,
      )}
    >
      <div className='w-full flex flex-col gap-8 items-center justify-center'>
        <div className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-lg font-normal'>{packageQuestion}</p>
            <div className='flex flex-col gap-3'>
              <div
                onClick={() => changePackage('economic', customPrice)}
                className={cn(
                  'relative rounded-lg border-2 border-docduit-blue p-2 flex flex-col justify-center items-center cursor-pointer hover:bg-docduit-blue hover:text-white',
                  selectedPackage === 'economic'
                    ? 'text-white bg-docduit-blue'
                    : 'text-docduit-blue bg-transparent',
                )}
              >
                <p className='font-semibold'>{packageOption.economic}</p>
                <p className='text-2xl font-bold'>
                  Rp{customPrice.toLocaleString('id-ID')}
                </p>
                <PriceDetailsDrawerButton
                  onDetailSubmit={handleDetailSubmit}
                  vocabularies={vocabularies}
                />
              </div>
              <div
                onClick={() => changePackage('standard', standardPrice)}
                className={cn(
                  'relative rounded-lg border-2 border-docduit-blue p-2 flex flex-col justify-center items-center cursor-pointer hover:bg-docduit-blue hover:text-white',
                  selectedPackage === 'standard'
                    ? 'text-white bg-docduit-blue'
                    : 'text-docduit-blue bg-transparent',
                )}
              >
                <p className='font-semibold'>{packageOption.standard}</p>
                <p className='text-2xl font-bold'>
                  Rp{standardPrice.toLocaleString('id-ID')}
                </p>
              </div>
              <div
                onClick={() => changePackage('luxury', luxuryPrice)}
                className={cn(
                  'relative rounded-lg border-2 border-docduit-blue p-2 flex flex-col justify-center items-center cursor-pointer hover:bg-docduit-blue hover:text-white',
                  selectedPackage === 'luxury'
                    ? 'text-white bg-docduit-blue'
                    : 'text-docduit-blue bg-transparent',
                )}
              >
                <p className='font-semibold'>{packageOption.luxury}</p>
                <p className='text-2xl font-bold'>
                  Rp{luxuryPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-lg font-normal'>{termsQuestion}</p>
            <Slider
              onValueChange={(value) => setTerm(value[0])}
              className='bg-docduit-yellow rounded-lg'
              defaultValue={[term]}
              value={[term]}
              max={24}
              step={1}
            />
            <div className='flex justify-between'>
              <p className='text-sm font-light'>
                0 {months || month || formatMonth(2)}
              </p>
              <p className='text-sm font-light'>
                24 {months || month || formatMonth(2)}
              </p>
            </div>
            <InputCalculationNumber
              value={term}
              setValue={setTerm}
              isMonth
              monthLable={month}
              monthLabelPlural={months}
            />
          </div>
        </div>
        <div className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <p className='text-lg font-normal'>{budgetQuestion}</p>
            <Slider
              onValueChange={(value) => setBudget(value[0])}
              className='bg-docduit-yellow rounded-lg'
              defaultValue={[budget]}
              value={[budget]}
              max={800000000}
              step={100000}
            />
            <div className='flex justify-between'>
              <p className='text-sm font-light'>Rp100.000</p>
              <p className='text-sm font-light'>Rp800.000.000</p>
            </div>
            <InputCalculationNumber value={budget} setValue={setBudget} />
          </div>
        </div>
      </div>
      <Button onClick={handleSubmit} size='lg' variant='red'>
        {calculate}
      </Button>
    </div>
  );
}
