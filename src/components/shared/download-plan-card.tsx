'use client';

import { usePathname } from 'next/navigation';
import {
  DownloadPlan,
  DownloadPlanScheduleRow,
  DownloadPlanTone,
} from '@/lib/download-plan';

const TONE_CLASS: Record<DownloadPlanTone, string> = {
  blue: 'bg-docduit-lightblue',
  yellow: 'bg-docduit-lightyellow',
  red: 'bg-docduit-lightred',
  green: 'bg-green-100',
  neutral: 'bg-gray-100',
};

const CHROME = {
  id: {
    generatedOn: 'Dibuat pada',
    disclaimer:
      'Estimasi ini hanya untuk tujuan edukasi dan bukan merupakan nasihat keuangan.',
    month: 'Bulan',
  },
  en: {
    generatedOn: 'Generated on',
    disclaimer:
      'These estimates are for educational purposes only and are not financial advice.',
    month: 'Month',
  },
};

// Keeps the printable card (and therefore the PNG) bounded: at most `max` rows,
// always including the first and last, sampled evenly in between.
function sampleSchedule(
  schedule: DownloadPlanScheduleRow[],
  max = 12,
): DownloadPlanScheduleRow[] {
  if (schedule.length <= max) return schedule;
  const step = (schedule.length - 1) / (max - 1);
  const picked: DownloadPlanScheduleRow[] = [];
  for (let i = 0; i < max; i++) {
    picked.push(schedule[Math.round(i * step)]);
  }
  return picked;
}

/**
 * A branded, printable rendering of a `DownloadPlan`. It is meant to be mounted
 * off-screen and captured with `handleDownloadImage(id)`. A lightweight CSS bar
 * list (not Recharts) is used for the schedule so `html2canvas` captures it
 * reliably.
 */
export function DownloadPlanCard({
  plan,
  id,
}: {
  plan: DownloadPlan;
  id: string;
}) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] === 'en' ? 'en' : 'id';
  const chrome = CHROME[locale];

  const generatedAt =
    plan.generatedAt ??
    new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const rows = plan.schedule ? sampleSchedule(plan.schedule) : [];
  const maxAbs = rows.reduce((acc, row) => Math.max(acc, Math.abs(row.value)), 0);

  return (
    <div
      id={id}
      style={{ width: 520 }}
      className='fixed left-[-9999px] top-0 z-[-1] flex flex-col gap-5 bg-white p-8 text-black'
    >
      <div className='flex items-center justify-between'>
        <span className='font-epilogue text-2xl font-bold'>
          Doc<span className='text-docduit-blue'>duit</span>
        </span>
        <span className='text-xs text-gray-500'>
          {chrome.generatedOn} {generatedAt}
        </span>
      </div>

      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-bold'>{plan.title}</h2>
        {plan.subtitle ? (
          <p className='text-sm text-gray-600'>{plan.subtitle}</p>
        ) : null}
      </div>

      <div className='grid grid-cols-3 gap-2'>
        {plan.figures.map((figure, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 rounded-lg border border-black/10 p-3 ${
              TONE_CLASS[figure.tone ?? 'neutral']
            }`}
          >
            <span className='text-[11px] leading-tight text-gray-700'>
              {figure.label}
            </span>
            <span className='text-sm font-bold leading-tight'>
              {figure.value}
            </span>
          </div>
        ))}
      </div>

      {rows.length > 0 ? (
        <div className='flex flex-col gap-2'>
          {plan.scheduleLabel ? (
            <p className='text-sm font-semibold'>{plan.scheduleLabel}</p>
          ) : null}
          <div className='flex flex-col gap-1.5'>
            {rows.map((row, index) => {
              const ratio = maxAbs > 0 ? Math.abs(row.value) / maxAbs : 0;
              const width = `${Math.max(2, Math.round(ratio * 100))}%`;
              const negative = row.value < 0;
              return (
                <div key={index} className='flex items-center gap-2'>
                  <span className='w-16 shrink-0 text-[11px] text-gray-500'>
                    {chrome.month} {row.label}
                  </span>
                  <div className='h-3 flex-1 rounded-full bg-gray-100'>
                    <div
                      className={`h-3 rounded-full ${
                        negative ? 'bg-docduit-lightred' : 'bg-docduit-blue'
                      }`}
                      style={{ width }}
                    />
                  </div>
                  <span className='w-28 shrink-0 text-right text-[11px] tabular-nums text-gray-700'>
                    Rp {Math.round(row.value).toLocaleString('id-ID')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {plan.notes && plan.notes.length > 0 ? (
        <ul className='flex list-disc flex-col gap-1 pl-5 text-xs text-gray-700'>
          {plan.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      ) : null}

      <p className='border-t border-gray-200 pt-3 text-[10px] leading-snug text-gray-400'>
        {chrome.disclaimer}
      </p>
    </div>
  );
}
