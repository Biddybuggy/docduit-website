'use client';
import useUserSessionQuery from '@/hooks/use-user-session';
import Link from 'next/link';
import { safeSendGAEvent } from '@/lib/analytics';

export default function CalculatorSection({
  lang,
  vocabularies,
}: {
  lang: string;
  vocabularies: any;
}) {
  const { userInfo } = useUserSessionQuery();
  const {
    home: {
      calculator: { title, subtitle, variation },
    },
  } = vocabularies;

  type CalculatorVariation = {
    title: string;
    icon: string;
    slug: string;
    gaEvent: string;
  };

  const variations: CalculatorVariation[] = [
    {
      title: variation.gadget,
      icon: '/illustrations/gadget.svg',
      slug: 'gadget',
      gaEvent: 'navigate_to_gadget_calculator',
    },
    {
      title: variation.marriage,
      icon: '/illustrations/marriage.svg',
      slug: 'marriage',
      gaEvent: 'navigate_to_marriage_calculator',
    },
    {
      title: variation.vacation,
      icon: '/illustrations/briefcase.svg',
      slug: 'vacation',
      gaEvent: 'navigate_to_vacation_calculator',
    },
    {
      title: variation.vehicle,
      icon: '/illustrations/motor.svg',
      slug: 'vehicle',
      gaEvent: 'navigate_to_vehicle_calculator',
    },
    // {
    //   title: variation.pilgrimage,
    //   icon: '/illustrations/kabah.svg',
    //   slug: 'umroh',
    // },
    {
      title: variation.other,
      icon: '/illustrations/wishlist.svg',
      slug: 'wishlist',
      gaEvent: 'navigate_to_wishlist_calculator',
    },
  ];

  const onNavigationClicked = (variation: CalculatorVariation) => {
    safeSendGAEvent('event', variation.gaEvent, {
      email: userInfo?.email,
      fullName: userInfo?.name,
    });
  };
  return (
    <div
      id='calculators'
      className='flex flex-col gap-4 lg:justify-between lg:min-h-96 lg:bg-docduit-lightblue lg:px-24 lg:py-12'
    >
      <div className='flex justify-center lg:justify-between items-center'>
        <p className='font-bold text-xl lg:text-4xl'>
          <span className='text-docduit-blue'>{title.first}</span>&nbsp;
          {title.second}
        </p>
        <div className='hidden lg:block'>
          <p className='font-medium'>{subtitle.first}</p>
          <p className='font-medium'>{subtitle.second}</p>
        </div>
      </div>
      <div className='w-full gap-4 flex flex-wrap lg:flex-nowrap justify-center items-center lg:justify-between'>
        {variations.map((variation) => (
          <Link
            href={`/${lang}/calculator/${variation.slug}`}
            key={variation.title}
            className='flex flex-col items-center cursor-pointer'
            onClick={() => onNavigationClicked(variation)}
          >
            <img
              src={variation.icon}
              alt={variation.title}
              className='w-20 h-20 sm:w-auto sm:h-auto hover:animate-bounce hover:direction-reverse hover:duration-1000 hover:delay-200'
            />
            <p className='font-semibold text-center'>{variation.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
