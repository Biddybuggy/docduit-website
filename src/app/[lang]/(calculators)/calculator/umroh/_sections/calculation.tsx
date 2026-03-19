import InputCalculationNumber from '@/components/shared/input-calculation-number';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

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
    monthNames,
    umroh: {
      questions: {
        selectMonth,
        month: monthText,
        year: yearText,
        selectYear,
        when: whenQuestion,
        price: priceQuestion,
        budget: budgetQuestion,
      },
    },
  } = vocabularies;

  // Calendar related
  const months = Object.keys(monthNames).map((key) => monthNames[key]);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [price, setPrice] = useState<number>(5000000);
  const [budget, setBudget] = useState<number>(200000);
  const term = (year - currentYear) * 12 + (month - currentMonth);

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
            <p className='text-lg font-normal'>{whenQuestion}</p>
            <Popover>
              <PopoverTrigger>
                <div className='flex w-full gap-2 rounded-xl p-4 justify-between items-center bg-white text-docduit-blue border-4 border-docduit-blue hover:bg-docduit-blue hover:text-white'>
                  <p className='font-bold text-2xl hover:text-inherit'>
                    {monthNames[month]}&nbsp;
                    {year}
                  </p>
                  <CalendarDays
                    className='hover:text-inherit'
                    size={32}
                    strokeWidth={2}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className='flex gap-4'>
                  <Select
                    value={month.toString()}
                    onValueChange={(e) => setMonth(Number(e))}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder={selectMonth} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{monthText}</SelectLabel>
                        {months.map(
                          (month, idx) =>
                            (year > currentYear ||
                              idx >= new Date().getMonth()) && (
                              <SelectItem
                                key={idx}
                                value={(idx + 1).toString()}
                              >
                                {month}
                              </SelectItem>
                            ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    value={year.toString()}
                    onValueChange={(e) => setYear(Number(e))}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder={selectYear} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{yearText}</SelectLabel>
                        {Array.from({ length: 11 }, (_, idx) => {
                          const year = new Date().getFullYear() + idx;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
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
