import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface InputCurrencyProps {
  id?: string;
  label?: string;
  customIcon?: any;
  onChangeHandler?: (e: any) => void;
}

export default function InputCurrency({
  id,
  label,
  customIcon,
  onChangeHandler,
  ...props
}: InputCurrencyProps) {
  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='currency'>{label}</Label>
      <div className='relative'>
        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500 dark:text-gray-400'>
          {customIcon ? customIcon : 'Rp'}
        </span>
        <Input
          id={id}
          type='text'
          placeholder='Amount'
          className='pl-10 border border-black'
          {...props}
          onChange={(e) => {
            const amount = Number(e.target.value.replace(/\D/g, ''));
            const formattedAmount = new Intl.NumberFormat('id-ID').format(
              amount,
            );
            e.target.value = formattedAmount;
            if (onChangeHandler) {
              onChangeHandler(e);
            }
          }}
        />
      </div>
    </div>
  );
}
