'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ActionPlan,
  AllScenarioResults,
  FinancialTwinInput,
  GeneratedInsights,
  storeTwinConsultPrefill,
  storeTwinSaveIntent,
} from '@/lib/financial-twin-simulator';
import {
  buildFinancialTwinPlanSummary,
  FinancialTwinPlan,
  isTwinCheckInDue,
  recordFinancialTwinCheckIn,
  saveFinancialTwinPlan,
  TwinCheckInStatus,
} from '@/services/financial-twin-plan.service';
import {
  buildTwinFunnelParams,
  trackFinancialTwinEvent,
} from '@/lib/financial-twin-analytics';
import type { Locale } from '../../_utils/dictionaries';

export function getSavedPlanCopy(vocabularies: any, lang: Locale) {
  const dict = vocabularies?.twinSimulator?.savedPlan ?? {};
  const isId = lang === 'id';
  return (key: string, fallbackId: string, fallbackEn: string): string =>
    typeof dict?.[key] === 'string' ? dict[key] : isId ? fallbackId : fallbackEn;
}

export function formatPlanDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    dateStyle: 'medium',
  }).format(date);
}

// Contextual consultation opener for a "need help" check-in. Deliberately
// contains no amounts; the AI can ask for specifics inside the chat.
export function buildCheckInHelpPrefill(lang: Locale): string {
  if (lang === 'id') {
    return (
      'Halo Docduit! Aku punya rencana Financial Twin yang tersimpan, dan pada ' +
      'check-in mingguan aku memilih "Aku butuh bantuan". Rasanya sulit tetap di ' +
      'jalur menuju target keuanganku. Bisa bantu aku meninjau langkah-langkah ' +
      'supaya kembali on track?'
    );
  }
  return (
    'Hi Docduit! I have a saved Financial Twin plan, and on my weekly check-in ' +
    'I chose "I need help". I am finding it hard to stay on track toward my ' +
    'financial goal. Can you help me review my next steps to get back on track?'
  );
}

export function SavePlanCard({
  lang,
  vocabularies,
  submittedInput,
  results,
  insights,
  actionPlan,
  isAuthenticated,
  onPlanSaved,
}: {
  lang: Locale;
  vocabularies: any;
  submittedInput: FinancialTwinInput;
  results: AllScenarioResults;
  insights: GeneratedInsights;
  actionPlan: ActionPlan;
  isAuthenticated: boolean;
  onPlanSaved: (plan: FinancialTwinPlan) => void;
}) {
  const t = getSavedPlanCopy(vocabularies, lang);
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState<FinancialTwinPlan | null>(null);

  const handleSave = async () => {
    trackFinancialTwinEvent('financial_twin_save_plan_clicked', {
      ...buildTwinFunnelParams(submittedInput, lang),
      entry_point: 'twin_results',
    });

    if (!isAuthenticated) {
      storeTwinSaveIntent(submittedInput);
      toast.info(
        t(
          'signInToSave',
          'Masuk dengan Google untuk menyimpan rencana ini. Kamu akan kembali ke halaman ini dan penyimpanan selesai otomatis.',
          'Sign in with Google to save this plan. We will bring you back here and finish saving automatically.',
        ),
      );
      await signIn('google', {
        callbackUrl: pathname ?? `/${lang}/financial-twin-simulator`,
      });
      return;
    }

    setIsSaving(true);
    try {
      const plan = await saveFinancialTwinPlan({
        input: submittedInput,
        summary: buildFinancialTwinPlanSummary(
          submittedInput,
          results,
          insights,
          actionPlan,
        ),
        locale: lang,
      });
      setJustSaved(plan);
      onPlanSaved(plan);
      trackFinancialTwinEvent('financial_twin_plan_saved', {
        ...buildTwinFunnelParams(submittedInput, lang),
        entry_point: 'twin_results',
      });
      toast.success(
        `${t('savedTitle', 'Rencana tersimpan', 'Plan saved')}${
          plan.nextCheckInAt
            ? ` · ${t('nextCheckInLabel', 'Check-in berikutnya', 'Next check-in')}: ${formatPlanDate(plan.nextCheckInAt, lang)}`
            : ''
        }`,
      );
    } catch (error) {
      console.error('Failed to save Financial Twin plan:', error);
      toast.error(
        t(
          'saveFailed',
          'Rencana gagal disimpan. Silakan masuk, jalankan ulang simulasi, lalu coba simpan lagi.',
          'Could not save your plan. Please sign in, rerun the simulation, and try saving again.',
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      className='shadow-sm border-sky-200 bg-sky-50/50 rounded-2xl'
      data-testid='twin-save-plan-card'
    >
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-base font-semibold text-slate-900'>
          <CalendarCheck className='h-4 w-4 shrink-0 text-sky-700' />
          {t(
            'saveCtaTitle',
            'Simpan rencana ini dan check-in mingguan',
            'Keep this plan and check in weekly',
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-xs leading-relaxed text-slate-600'>
          {t(
            'saveCtaBody',
            'Simpan satu rencana aktif ke akunmu, dan setiap minggu kami akan bertanya di aplikasi apakah kamu masih di jalur.',
            'Save one active plan to your account and we will ask you in-app every week whether you are still on track.',
          )}
        </p>
        {justSaved?.nextCheckInAt && (
          <p
            className='text-xs font-medium text-emerald-700'
            data-testid='twin-plan-saved-confirmation'
          >
            {t('savedTitle', 'Rencana tersimpan', 'Plan saved')} ·{' '}
            {t('nextCheckInLabel', 'Check-in berikutnya', 'Next check-in')}:{' '}
            {formatPlanDate(justSaved.nextCheckInAt, lang)}
          </p>
        )}
        <Button
          type='button'
          size='sm'
          className='rounded-full'
          onClick={handleSave}
          disabled={isSaving}
          data-testid='twin-save-plan-cta'
        >
          {isSaving && <Loader2 className='mr-1 h-3 w-3 animate-spin' />}
          {isSaving
            ? t('saving', 'Menyimpan rencana…', 'Saving plan…')
            : t('saveCta', 'Simpan rencana ini', 'Save this plan')}
        </Button>
      </CardContent>
    </Card>
  );
}

export function TwinCheckInCard({
  lang,
  vocabularies,
  plan,
  onPlanChanged,
  onRestoreInput,
}: {
  lang: Locale;
  vocabularies: any;
  plan: FinancialTwinPlan;
  onPlanChanged: (plan: FinancialTwinPlan) => void;
  onRestoreInput: (input: FinancialTwinInput) => void;
}) {
  const t = getSavedPlanCopy(vocabularies, lang);
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'choices' | 'done'>('intro');
  const [busyStatus, setBusyStatus] = useState<TwinCheckInStatus | null>(null);
  const dueViewedRef = useRef(false);

  const due = isTwinCheckInDue(plan);

  const funnelParams = () => ({
    ...buildTwinFunnelParams(plan.input, lang),
    entry_point: 'twin_checkin_card',
  });

  useEffect(() => {
    if (!due || dueViewedRef.current) return;
    dueViewedRef.current = true;
    trackFinancialTwinEvent('financial_twin_checkin_due_viewed', {
      ...buildTwinFunnelParams(plan.input, lang),
      entry_point: 'twin_checkin_card',
    });
  }, [due, plan.input, lang]);

  const handleStart = () => {
    trackFinancialTwinEvent('financial_twin_checkin_started', funnelParams());
    setStage('choices');
  };

  const handleChoice = async (status: TwinCheckInStatus) => {
    if (busyStatus) return;
    trackFinancialTwinEvent('financial_twin_checkin_status_selected', {
      ...funnelParams(),
      checkin_status: status,
    });
    setBusyStatus(status);
    try {
      if (status === 'on_track') {
        const { lastCheckInAt, nextCheckInAt } =
          await recordFinancialTwinCheckIn('on_track', lang);
        onPlanChanged({ ...plan, lastCheckInAt, nextCheckInAt });
        trackFinancialTwinEvent('financial_twin_checkin_completed', {
          ...funnelParams(),
          checkin_status: status,
        });
        setStage('done');
        return;
      }

      // Best-effort record: a Firestore hiccup should not block the user from
      // editing their plan or reaching the consultation.
      try {
        await recordFinancialTwinCheckIn(status, lang);
      } catch (error) {
        console.error('Failed to record Financial Twin check-in:', error);
      }
      trackFinancialTwinEvent('financial_twin_checkin_completed', {
        ...funnelParams(),
        checkin_status: status,
      });

      if (status === 'something_changed') {
        onRestoreInput(plan.input);
        toast.info(
          t(
            'restoredForEdit',
            'Angka tersimpanmu sudah kembali ke formulir. Sesuaikan lalu jalankan simulasi lagi untuk memperbarui rencanamu.',
            'Your saved numbers are back in the form. Adjust them and run the simulation again to refresh your plan.',
          ),
        );
      } else {
        storeTwinConsultPrefill(buildCheckInHelpPrefill(lang));
        router.push(`/${lang}/consultation`);
      }
    } catch (error) {
      console.error('Failed to record Financial Twin check-in:', error);
      toast.error(
        t(
          'checkinFailed',
          'Check-in gagal disimpan. Silakan coba lagi.',
          'Could not record your check-in. Please try again.',
        ),
      );
    } finally {
      setBusyStatus(null);
    }
  };

  if (!plan.active) return null;

  if (!due && stage !== 'done') {
    return (
      <Card
        className='shadow-sm border-slate-200 rounded-2xl'
        data-testid='twin-plan-card'
      >
        <CardContent className='flex flex-col gap-1 py-4'>
          <p className='text-sm font-semibold text-slate-900'>
            {t(
              'planCardTitle',
              'Rencana Financial Twin tersimpan',
              'Your saved Financial Twin plan',
            )}
          </p>
          <p className='text-xs text-slate-500'>
            {t('notDueYet', 'Kamu masih sesuai jadwal.', 'You are on schedule.')}{' '}
            {plan.nextCheckInAt && (
              <>
                {t('nextCheckInLabel', 'Check-in berikutnya', 'Next check-in')}:{' '}
                <span className='font-medium text-slate-700'>
                  {formatPlanDate(plan.nextCheckInAt, lang)}
                </span>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (stage === 'done') {
    return (
      <Card
        className='shadow-sm border-emerald-200 bg-emerald-50/60 rounded-2xl'
        data-testid='twin-checkin-done'
      >
        <CardContent className='flex flex-col gap-1 py-4'>
          <p className='text-sm font-semibold text-emerald-900'>
            {t(
              'checkinDoneTitle',
              'Mantap — sampai jumpa minggu depan!',
              'Nice — see you next week!',
            )}
          </p>
          <p className='text-xs text-emerald-800'>
            {t(
              'checkinDoneBody',
              'Check-in kamu sudah tercatat.',
              'Your check-in is recorded.',
            )}{' '}
            {plan.nextCheckInAt && (
              <>
                {t('nextCheckInLabel', 'Check-in berikutnya', 'Next check-in')}:{' '}
                <span className='font-medium'>
                  {formatPlanDate(plan.nextCheckInAt, lang)}
                </span>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className='shadow-sm border-sky-300 bg-sky-50/70 rounded-2xl'
      data-testid='twin-checkin-card'
    >
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold text-slate-900'>
          {t(
            'checkinDueTitle',
            'Apakah kamu masih di jalur?',
            'Are you still on track?',
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-xs leading-relaxed text-slate-600'>
          {t(
            'checkinDueBody',
            'Sudah lebih dari seminggu sejak rencanamu diperbarui. Jawaban singkat membuat rencanamu tetap berguna.',
            'It has been at least a week since your plan was updated. A quick answer keeps your plan useful.',
          )}
        </p>
        {stage === 'intro' ? (
          <Button
            type='button'
            size='sm'
            className='rounded-full'
            onClick={handleStart}
            data-testid='twin-checkin-start'
          >
            {t('checkinStart', 'Check-in sekarang', 'Check in now')}
          </Button>
        ) : (
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
            {(
              [
                {
                  status: 'on_track' as const,
                  label: t('checkinOnTrack', 'Masih di jalur', 'On track'),
                  hint: t(
                    'checkinOnTrackHint',
                    'Lanjutkan — sampai jumpa minggu depan.',
                    'Keep going — see you next week.',
                  ),
                  testId: 'twin-checkin-on-track',
                },
                {
                  status: 'something_changed' as const,
                  label: t('checkinChanged', 'Ada yang berubah', 'Something changed'),
                  hint: t(
                    'checkinChangedHint',
                    'Muat ulang angka tersimpanmu, sesuaikan, lalu jalankan simulasi lagi.',
                    'Reload your saved numbers, adjust them, and rerun the simulation.',
                  ),
                  testId: 'twin-checkin-changed',
                },
                {
                  status: 'need_help' as const,
                  label: t('checkinNeedHelp', 'Aku butuh bantuan', 'I need help'),
                  hint: t(
                    'checkinNeedHelpHint',
                    'Diskusikan dengan konsultasi AI.',
                    'Talk it through with the AI consultation.',
                  ),
                  testId: 'twin-checkin-need-help',
                },
              ] satisfies {
                status: TwinCheckInStatus;
                label: string;
                hint: string;
                testId: string;
              }[]
            ).map((choice) => (
              <button
                key={choice.status}
                type='button'
                onClick={() => handleChoice(choice.status)}
                disabled={busyStatus != null}
                data-testid={choice.testId}
                className='flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
              >
                <span className='flex items-center gap-1.5 text-xs font-semibold text-slate-900'>
                  {busyStatus === choice.status && (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  )}
                  {choice.label}
                </span>
                <span className='text-[11px] leading-relaxed text-slate-500'>
                  {choice.hint}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
