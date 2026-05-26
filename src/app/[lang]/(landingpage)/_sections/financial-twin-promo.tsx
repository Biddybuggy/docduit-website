'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, ShieldAlert, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeSendGAEvent } from '@/lib/analytics';

export default function FinancialTwinPromoSection({
  lang,
  vocabularies,
}: {
  lang: string;
  vocabularies: any;
}) {
  const promo = vocabularies?.home?.financialTwinPromo;
  const title = promo?.title ?? 'Financial Twin Simulator';
  const description =
    promo?.description ??
    'Compare your current money path against improved habits and risky choices before you commit.';
  const cta = promo?.cta ?? 'Try the simulator';
  const benefits = promo?.benefits ?? {
    current: 'See where your current habits are taking you.',
    improved: 'Spot the changes that move you closer to your goal.',
    risky: 'Understand how riskier choices could affect your plan.',
  };

  const items = [
    {
      label: 'Current',
      text: benefits.current,
      icon: BarChart3,
      className: 'bg-white border-slate-200',
    },
    {
      label: 'Improved',
      text: benefits.improved,
      icon: TrendingUp,
      className: 'bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Risky',
      text: benefits.risky,
      icon: ShieldAlert,
      className: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <section className='rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm lg:p-6'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex max-w-2xl flex-col gap-3'>
          <p className='text-xs font-semibold uppercase tracking-wide text-docduit-blue'>
            {title}
          </p>
          <h2 className='text-2xl font-bold leading-tight text-slate-950 lg:text-3xl'>
            {description}
          </h2>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`rounded-lg border p-3 ${item.className}`}
                >
                  <div className='mb-2 flex items-center gap-2'>
                    <Icon size={18} className='text-docduit-blue' />
                    <p className='text-sm font-bold text-slate-900'>
                      {promo?.labels?.[item.label.toLowerCase()] ?? item.label}
                    </p>
                  </div>
                  <p className='text-sm text-slate-600'>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
        <Link
          href={`/${lang}/financial-twin-simulator`}
          onClick={() =>
            safeSendGAEvent('event', 'navigate_to_financial_twin_promo')
          }
          className='w-full lg:w-auto'
        >
          <Button size='lg' className='w-full rounded-full px-6 lg:w-auto'>
            <span className='font-bold'>{cta}</span>
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
