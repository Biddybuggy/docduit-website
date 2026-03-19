import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useForm, Controller } from 'react-hook-form';
import { Edit, Info, Users2 } from 'lucide-react';
import InputCurrency from '@/components/shared/input-currency';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';

interface LayoutProps {
  vocabularies: any;
  onDetailSubmit: (data: any) => void;
}

export default function PriceDetailsDrawerButton({
  vocabularies,
  onDetailSubmit,
}: LayoutProps) {
  const {
    marriage: { tooltip, details: detailsText },
  } = vocabularies;

  const {
    title,
    event: eventText,
    catering: cateringText,
    souvenir: souvenirText,
    invitation: invitationText,
  } = detailsText;

  const sejuta = 1000000;
  const formDefaultValues = {
    venue: (6 * sejuta).toLocaleString('id-ID'),
    mc: (1 * sejuta).toLocaleString('id-ID'),
    wo: (5 * sejuta).toLocaleString('id-ID'),
    makeup: (2 * sejuta).toLocaleString('id-ID'),
    outfit: (4 * sejuta).toLocaleString('id-ID'),
    mahar: (5 * sejuta).toLocaleString('id-ID'),
    documentation: (2 * sejuta).toLocaleString('id-ID'),
    music: (1 * sejuta).toLocaleString('id-ID'),
    decoration: (4 * sejuta).toLocaleString('id-ID'),
    other: (0).toLocaleString('id-ID'),
    cateringPax: (150).toLocaleString('id-ID'),
    cateringPerPax: (40000).toLocaleString('id-ID'),
    souvenirPax: (150).toLocaleString('id-ID'),
    souvenirPerPax: (20000).toLocaleString('id-ID'),
    invitationPax: (150).toLocaleString('id-ID'),
    invitationPerPax: (20000).toLocaleString('id-ID'),
  };

  type InputKeys =
    | 'venue'
    | 'mc'
    | 'wo'
    | 'makeup'
    | 'outfit'
    | 'mahar'
    | 'documentation'
    | 'music'
    | 'decoration'
    | 'other'
    | 'cateringPax'
    | 'cateringPerPax'
    | 'souvenirPax'
    | 'souvenirPerPax'
    | 'invitationPax'
    | 'invitationPerPax';

  const eventPriceInputs: InputKeys[] = [
    'venue',
    'mc',
    'wo',
    'makeup',
    'outfit',
    'mahar',
    'documentation',
    'music',
    'decoration',
    'other',
  ];
  const cateringInputs: InputKeys[] = ['cateringPax', 'cateringPerPax'];
  const souvenirInputs: InputKeys[] = ['souvenirPax', 'souvenirPerPax'];
  const invitationInputs: InputKeys[] = ['invitationPax', 'invitationPerPax'];

  const { handleSubmit, control, watch } = useForm({
    defaultValues: formDefaultValues,
  });

  const [
    cateringPax,
    cateringPerPax,
    souvenirPax,
    souvenirPerPax,
    invitationPax,
    invitationPerPax,
  ] = watch([
    'cateringPax',
    'cateringPerPax',
    'souvenirPax',
    'souvenirPerPax',
    'invitationPax',
    'invitationPerPax',
  ]);

  const totalCateringPrice =
    Number(cateringPax.replace(/\./g, '')) *
    Number(cateringPerPax.replace(/\./g, ''));
  const totalSouvenirPrice =
    Number(souvenirPax.replace(/\./g, '')) *
    Number(souvenirPerPax.replace(/\./g, ''));
  const totalInvitationPrice =
    Number(invitationPax.replace(/\./g, '')) *
    Number(invitationPerPax.replace(/\./g, ''));

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleMouseEnter = () => setTooltipOpen(true);
  const handleMouseLeave = () => setTooltipOpen(false);
  const handleClickTooltip = () => setTooltipOpen(!tooltipOpen);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onSubmit = (data: any) => {
    const totalEventPrice = eventPriceInputs.reduce((acc, key) => {
      return acc + Number(data[key].replace(/\./g, ''));
    }, 0);
    const totalSum =
      totalEventPrice +
      totalCateringPrice +
      totalSouvenirPrice +
      totalInvitationPrice;

    onDetailSubmit(totalSum);
    setIsDrawerOpen(false);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className='p-2 absolute right-1 rounded-lg hover:bg-white/20'>
          <Edit size={24} />
        </div>
      </DrawerTrigger>
      <DrawerContent className='w-full lg:w-1/2 lg:ml-auto'>
        <DrawerHeader>
          <DrawerTitle>
            <div className='flex gap-2 items-center justify-center'>
              {title}
              <TooltipProvider>
                <Tooltip open={tooltipOpen}>
                  <TooltipTrigger
                    asChild
                    onClick={handleClickTooltip}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Info className='text-docduit-red' size={24} />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-[200px] lg:max-w-[500px] bg-yellow-100'>
                    <p className='text-center font-light'>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <div className='mx-auto w-full max-w-[80%] max-h-[80vh] overflow-y-auto scrollbar-hide'>
          <div className='flex flex-col gap-2 p-4 pb-0'>
            {/* Forms input here */}
            <p className='font-semibold text-lg'>{eventText}</p>
            <div className='grid grid-cols-2 gap-4'>
              {eventPriceInputs.map((inputKey) => (
                <Controller
                  key={inputKey}
                  render={({ field }) => (
                    <InputCurrency
                      label={detailsText[inputKey]}
                      id={inputKey}
                      onChangeHandler={field.onChange}
                      {...field}
                    />
                  )}
                  name={inputKey}
                  control={control}
                />
              ))}
            </div>
            <p className='font-semibold text-lg'>{cateringText}</p>
            <div className='grid grid-cols-2 gap-4'>
              {cateringInputs.map((inputKey, idx) => (
                <Controller
                  key={inputKey}
                  render={({ field }) => (
                    <InputCurrency
                      customIcon={idx === 0 && <Users2 />}
                      label={detailsText[inputKey]}
                      id={inputKey}
                      onChangeHandler={field.onChange}
                      {...field}
                    />
                  )}
                  name={inputKey}
                  control={control}
                />
              ))}
              <div className='relative col-span-2'>
                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500 dark:text-gray-400'>
                  Rp
                </span>
                <Input
                  type='text'
                  placeholder='Amount'
                  readOnly
                  value={totalCateringPrice.toLocaleString('id-ID')}
                  className='pl-10 border border-black bg-yellow-100'
                />
              </div>
            </div>
            <p className='font-semibold text-lg'>{souvenirText}</p>
            <div className='grid grid-cols-2 gap-4'>
              {souvenirInputs.map((inputKey, idx) => (
                <Controller
                  key={inputKey}
                  render={({ field }) => (
                    <InputCurrency
                      customIcon={idx === 0 && <Users2 />}
                      label={detailsText[inputKey]}
                      id={inputKey}
                      onChangeHandler={field.onChange}
                      {...field}
                    />
                  )}
                  name={inputKey}
                  control={control}
                />
              ))}
            </div>
            <div className='relative col-span-2'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500 dark:text-gray-400'>
                Rp
              </span>
              <Input
                type='text'
                placeholder='Amount'
                readOnly
                value={totalSouvenirPrice.toLocaleString('id-ID')}
                className='pl-10 border border-black bg-yellow-100'
              />
            </div>
            <p className='font-semibold text-lg'>{invitationText}</p>
            <div className='grid grid-cols-2 gap-4'>
              {invitationInputs.map((inputKey, idx) => (
                <Controller
                  key={inputKey}
                  render={({ field }) => (
                    <InputCurrency
                      customIcon={idx === 0 && <Users2 />}
                      label={detailsText[inputKey]}
                      id={inputKey}
                      onChangeHandler={field.onChange}
                      {...field}
                    />
                  )}
                  name={inputKey}
                  control={control}
                />
              ))}
            </div>
            <div className='relative col-span-2'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500 dark:text-gray-400'>
                Rp
              </span>
              <Input
                type='text'
                placeholder='Amount'
                readOnly
                value={totalInvitationPrice.toLocaleString('id-ID')}
                className='pl-10 border border-black bg-yellow-100'
              />
            </div>
          </div>
          <DrawerFooter className='justify-center items-center'>
            <div>
              <Button onClick={handleSubmit(onSubmit)} size='lg' variant='red'>
                {detailsText.save}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
