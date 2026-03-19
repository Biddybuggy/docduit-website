import { Input } from '../ui/input';
import { formatMonth } from '@/lib/utils';

interface InputCurrencyProps {
  setValue: (e: any) => void;
  value: number;
  isMonth?: boolean;
  monthLable?: string;
  monthLabelPlural?: string;
}

export default function InputCalculationNumber({
  setValue,
  value,
  isMonth = false,
  monthLable,
  monthLabelPlural,
}: InputCurrencyProps) {
  return (
    <Input
      onChange={(e) => {
        const amount = Number(e.target.value.replace(/\D/g, ''));
        setValue(amount);
        const formattedAmount = new Intl.NumberFormat('id-ID').format(amount);
        e.target.value = formattedAmount;
      }}
      onClick={(e) => e.currentTarget.select()}
      value={
        isMonth
          ? `${value} ${formatMonth(value, { singular: monthLable, plural: monthLabelPlural })}`
          : `Rp ${value.toLocaleString('id-ID')}`
      }
      className='ring-0 border-0 !bg-transparent text-center !font-semibold !text-4xl text-docduit-blue underline-offset-4 underline decoration-1'
    />
  );
}
