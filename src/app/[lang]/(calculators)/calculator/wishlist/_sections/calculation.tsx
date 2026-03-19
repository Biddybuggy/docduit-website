import InputCalculationNumber from '@/components/shared/input-calculation-number';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { formatMonth } from '@/lib/utils';

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
    wishlist: {
      questions: {
        what: whatQuestion,
        terms: termsQuestion,
        price: priceQuestion,
        budget: budgetQuestion,
      },
    },
  } = vocabularies;

  const [what, setWhat] = useState<string>('Donasi');
  const [term, setTerm] = useState<number>(5);
  const [price, setPrice] = useState<number>(5000000);
  const [budget, setBudget] = useState<number>(200000);

  const handleSubmit = () => {
    onSubmit({ term, price, budget, label: what });
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
            <p className='text-lg font-normal'>{whatQuestion}</p>
            <Input
              onChange={(e) => setWhat(e.target.value)}
              value={what}
              className='ring-0 border-0 !bg-transparent text-center !font-semibold !text-4xl text-docduit-blue underline underline-offset-4 decoration-1'
            />
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
            <p className='text-lg font-normal'>{priceQuestion}</p>
            <Slider
              onValueChange={(value) => setPrice(value[0])}
              className='bg-docduit-yellow rounded-lg'
              defaultValue={[price]}
              value={[price]}
              max={100000000}
              step={100000}
            />
            <div className='flex justify-between'>
              <p className='text-sm font-light'>Rp100.000</p>
              <p className='text-sm font-light'>Rp100.000.000</p>
            </div>
            <InputCalculationNumber value={price} setValue={setPrice} />
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
              max={30000000}
              step={100000}
            />
            <div className='flex justify-between'>
              <p className='text-sm font-light'>Rp100.000</p>
              <p className='text-sm font-light'>Rp30.000.000</p>
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
