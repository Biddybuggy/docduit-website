'use client';

import Image from 'next/image';
import Link from 'next/link';
import useUserSessionQuery from '@/hooks/use-user-session';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { safeSendGAEvent } from '@/lib/analytics';

export default function IntroductionSection({
  vocabularies,
  lang,
}: {
  vocabularies: any;
  lang: string;
}) {
  const { userInfo } = useUserSessionQuery();
  const {
    home: {
      introduction: {
        tagline,
        description,
        benefit1,
        benefit2,
        benefit3,
        consult,
      },
    },
  } = vocabularies;

  const benefits = [
    {
      title: benefit1.title,
      description: benefit1.description,
      icon: '/icons/chat-ai.svg',
    },
    {
      title: benefit2.title,
      description: benefit2.description,
      icon: '/icons/no-money.svg',
    },
    {
      title: benefit3.title,
      description: benefit3.description,
      icon: '/icons/stats.svg',
    },
  ];

  return (
    <div className='flex flex-col gap-4 lg:flex-row lg:gap-8 w-full'>
      <div className='flex flex-col gap-2 text-wrap justify-center text-center lg:w-1/3 lg:text-start'>
        <p className='font-bold text-4xl'>
          {tagline.first}&nbsp;
          <span className='text-docduit-blue'>{tagline.second}</span>&nbsp;
        </p>
        <p className='font-bold text-4xl'>
          {tagline.third}&nbsp;
          <span className='text-docduit-blue'>{tagline.fourth}</span>
        </p>
        <p className='font-medium'>{description}</p>
        <div>
          <Link
            href={
              process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true'
                ? `/${lang}/consultation`
                : `/${lang}/under-maintenance`
            }
            onClick={() =>
              safeSendGAEvent('event', 'navigate_to_consultation', {
                email: userInfo?.email,
                name: userInfo?.name,
              })
            }
          >
            <Button variant='red' size='lg' className='w-full lg:w-auto'>
              <Sparkles size={20} />
              <span className='font-bold'>{consult}</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='mx-auto lg:w-1/3'>
        <Image
          src='/illustrations/doctor.svg'
          alt='Doctor Illustration'
          width={364}
          height={343}
        />
      </div>
      <div className='flex flex-col items-center gap-4 lg:items-start lg:gap-12 lg:w-1/3 lg:justify-center'>
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className='flex flex-col text-center lg:text-start lg:flex-row gap-2 lg:gap-6'
          >
            <div className='flex items-center justify-center'>
              <div className='border rounded-full p-3 shadow-lg shadow-slate-500'>
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className='min-w-6 min-h-6'
                />
              </div>
            </div>
            <div>
              <p className='text-sm lg:text-base font-medium'>
                {benefit.title}
              </p>
              <p className='text-xs lg:text-sm font-normal'>
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
