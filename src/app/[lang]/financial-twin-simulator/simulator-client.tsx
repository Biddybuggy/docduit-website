'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  FinancialTwinInput,
  ValidationErrors,
  AllScenarioResults,
  GeneratedInsights,
  ActionPlan,
  ActionLever,
  HealthStatus,
  RiskBehavior,
  storeTwinConsultPrefill,
  readTwinSaveIntent,
  clearTwinSaveIntent,
  formatRupiah,
  validateInputs,
  runAllScenarios,
  generateInsights,
  generateActionPlan,
} from '@/lib/financial-twin-simulator';
import {
  buildTwinFunnelParams,
  getDeviceType,
  trackFinancialTwinEvent,
} from '@/lib/financial-twin-analytics';
import {
  buildFinancialTwinPlanSummary,
  FinancialTwinPlan,
  loadFinancialTwinPlan,
  saveFinancialTwinPlan,
} from '@/services/financial-twin-plan.service';
import { useAuth } from '@/hooks/useAuth';
import {
  formatPlanDate,
  getSavedPlanCopy,
  SavePlanCard,
  TwinCheckInCard,
} from './_components/twin-plan-card';
import type { TwinNarrative } from '@/lib/financial-twin-narrative';
import { Locale } from '../_utils/dictionaries';
import { ReactQueryProvider } from '@/lib/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

type Props = {
  lang: Locale;
  vocabularies: any;
};

type ScenarioChartPoint = {
  month: number;
  current: number;
  improved: number;
  risky: number;
};

const defaultInput: FinancialTwinInput = {
  monthlyIncome: 8000000,
  currentSavings: 3000000,
  essentialSpending: 3000000,
  lifestyleSpending: 1500000,
  foodTransportSpending: 1500000,
  otherSpending: 500000,
  debtBalance: 2000000,
  monthlyDebtPayment: 500000,
  financialGoalAmount: 15000000,
  timeHorizonMonths: 24,
  expectedAnnualReturn: 8,
  riskBehavior: 'medium',
};

function getCopy(vocabularies: any, lang: Locale) {
  // Fallback-friendly access
  const twin = vocabularies?.twinSimulator;

  if (!twin) {
    return {
      pageTitle:
        lang === 'id' ? 'Financial Twin Simulator' : 'Financial Twin Simulator',
      pageSubtitle:
        lang === 'id'
          ? 'Simulasikan tiga jalur keuangan berbeda dan lihat dampaknya ke tujuanmu.'
          : 'Simulate three different money paths and see how they affect your goals.',
      formTitle: lang === 'id' ? 'Profil Keuangan Kamu' : 'Your Money Snapshot',
      runButton: lang === 'id' ? 'Jalankan Simulasi' : 'Run Simulation',
      summaryTitle:
        lang === 'id'
          ? 'Perbandingan Tiga Jalur'
          : 'Comparison of Three Paths',
      chartTitle:
        lang === 'id'
          ? 'Proyeksi Posisi Bersih per Bulan'
          : 'Projected Net Position per Month',
      disclaimerTitle:
        lang === 'id' ? 'Disclaimer Edukasi' : 'Educational Disclaimer',
      disclaimerBody:
        lang === 'id'
          ? 'Simulator ini bersifat edukatif dan tidak memberikan rekomendasi produk keuangan apa pun. Angka yang muncul adalah ilustrasi dan bukan jaminan hasil di masa depan.'
          : 'This simulator is for education only and does not recommend any financial products. All numbers are illustrative and not a guarantee of future results.',
    };
  }

  return {
    pageTitle: twin.pageTitle,
    pageSubtitle: twin.pageSubtitle,
    introTitle: twin.introTitle,
    introBody: twin.introBody,
    formHelper: twin.formHelper,
    formTitle: twin.formTitle,
    runButton: twin.runButton,
    summaryTitle: twin.summaryTitle,
    summaryHelper: twin.summaryHelper,
    chartTitle: twin.chartTitle,
    chartHelper: twin.chartHelper,
    disclaimerTitle: twin.disclaimerTitle,
    disclaimerBody: twin.disclaimerBody,
  };
}

function mapInsightLabels(
  insights: GeneratedInsights | null,
  vocabularies: any,
  lang: Locale,
) {
  if (!insights) return { biggestBottleneck: '', bestNextAction: '' };
  const dict = vocabularies?.twinSimulator?.insights;

  const bottleneck =
    dict?.biggestBottleneck?.[insights.biggestBottleneck] ??
    insights.biggestBottleneck;
  const action =
    dict?.bestNextAction?.[insights.bestNextAction] ??
    insights.bestNextAction;

  return { biggestBottleneck: bottleneck, bestNextAction: action };
}

export default function FinancialTwinSimulator({
  lang,
  vocabularies,
}: Props) {
  const copy = getCopy(vocabularies, lang);

  const [input, setInput] = useState<FinancialTwinInput>(defaultInput);
  const [errors, setErrors] = useState<ValidationErrors>({ _hasError: false });
  const [results, setResults] = useState<AllScenarioResults | null>(null);
  const [insights, setInsights] = useState<GeneratedInsights | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [submittedInput, setSubmittedInput] =
    useState<FinancialTwinInput | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [narrative, setNarrative] = useState<TwinNarrative | null>(null);
  const [narrativeState, setNarrativeState] = useState<
    'idle' | 'loading' | 'done' | 'error'
  >('idle');
  const [mobileStep, setMobileStep] = useState<'inputs' | 'results'>('inputs');

  const { user, isLoading: isLoadingUser } = useAuth();
  const [savedPlan, setSavedPlan] = useState<FinancialTwinPlan | null>(null);
  const viewedTrackedRef = useRef(false);
  const inputStartedRef = useRef(false);
  const resultsViewedRef = useRef(false);
  const saveIntentHandledRef = useRef(false);
  const tSaved = getSavedPlanCopy(vocabularies, lang);

  const chartData: ScenarioChartPoint[] = useMemo(() => {
    if (!results) return [];
    const maxMonths = Math.max(
      results.current.snapshots.length,
      results.improved.snapshots.length,
      results.risky.snapshots.length,
    );

    const data: ScenarioChartPoint[] = [];
    for (let i = 0; i < maxMonths; i++) {
      data.push({
        month: i + 1,
        current: results.current.snapshots[i]?.netPosition ?? null,
        improved: results.improved.snapshots[i]?.netPosition ?? null,
        risky: results.risky.snapshots[i]?.netPosition ?? null,
      });
    }
    return data;
  }, [results]);

  const { biggestBottleneck, bestNextAction } = mapInsightLabels(
    insights,
    vocabularies,
    lang,
  );

  const trackInputStartedOnce = () => {
    if (inputStartedRef.current) return;
    inputStartedRef.current = true;
    trackFinancialTwinEvent('financial_twin_input_started', {
      lang,
      device_type: getDeviceType(),
      entry_point: 'simulator_form',
    });
  };

  const handleNumberChange =
    (field: keyof FinancialTwinInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      trackInputStartedOnce();
      const raw = e.target.value.replace(/[^\d]/g, '');
      const numeric = raw ? Number(raw) : 0;
      setInput((prev) => ({ ...prev, [field]: numeric }));
    };

  const handleRiskChange = (value: RiskBehavior) => {
    trackInputStartedOnce();
    setInput((prev) => ({ ...prev, riskBehavior: value }));
  };

  const fetchNarrative = async (payload: FinancialTwinInput) => {
    setNarrative(null);
    setNarrativeState('loading');
    try {
      const res = await fetch('/api/financial-twin/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.narrative) {
        setNarrativeState('error');
        return;
      }
      setNarrative(data.narrative as TwinNarrative);
      setNarrativeState('done');
    } catch {
      setNarrativeState('error');
    }
  };

  const moveMobileStep = (step: 'inputs' | 'results') => {
    setMobileStep(step);
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1023px)').matches
    ) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // Funnel: page view, fired once per mount.
  useEffect(() => {
    if (viewedTrackedRef.current) return;
    viewedTrackedRef.current = true;
    trackFinancialTwinEvent('financial_twin_viewed', {
      lang,
      device_type: getDeviceType(),
      entry_point: 'simulator_page',
    });
  }, [lang]);

  // Funnel: results shown for the first time in this visit.
  useEffect(() => {
    if (!isSubmitted || !submittedInput || resultsViewedRef.current) return;
    resultsViewedRef.current = true;
    trackFinancialTwinEvent('financial_twin_results_viewed', {
      ...buildTwinFunnelParams(submittedInput, lang),
      entry_point: 'simulator_results',
    });
  }, [isSubmitted, submittedInput, lang]);

  // Load the saved plan (if any) once the session user is known. Firestore
  // access itself waits for the synced Firebase user.
  useEffect(() => {
    if (!user?.email) {
      setSavedPlan(null);
      return;
    }
    let cancelled = false;
    void loadFinancialTwinPlan().then((plan) => {
      if (!cancelled) setSavedPlan(plan);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  // Finish a "save this plan" intent stored before the sign-in redirect:
  // restore the inputs, re-run the simulation locally, and save the plan.
  useEffect(() => {
    if (saveIntentHandledRef.current || isLoadingUser || !user?.email) return;
    saveIntentHandledRef.current = true;
    const pending = readTwinSaveIntent();
    if (!pending) return;
    clearTwinSaveIntent();

    const all = runAllScenarios(pending);
    const insight = generateInsights(pending, all);
    const plan = generateActionPlan(pending, all);
    setInput(pending);
    setErrors({ _hasError: false });
    setResults(all);
    setInsights(insight);
    setActionPlan(plan);
    setSubmittedInput(pending);
    setIsSubmitted(true);
    setNarrative(null);
    setNarrativeState('idle');
    moveMobileStep('results');

    void (async () => {
      try {
        const saved = await saveFinancialTwinPlan({
          input: pending,
          summary: buildFinancialTwinPlanSummary(pending, all, insight, plan),
          locale: lang,
        });
        setSavedPlan(saved);
        trackFinancialTwinEvent('financial_twin_plan_saved', {
          ...buildTwinFunnelParams(pending, lang),
          entry_point: 'post_signin',
        });
        toast.success(
          `${tSaved('savedTitle', 'Rencana tersimpan', 'Plan saved')}${
            saved.nextCheckInAt
              ? ` · ${tSaved('nextCheckInLabel', 'Check-in berikutnya', 'Next check-in')}: ${formatPlanDate(saved.nextCheckInAt, lang)}`
              : ''
          }`,
        );
      } catch (error) {
        console.error(
          'Failed to save Financial Twin plan after sign-in:',
          error,
        );
        toast.error(
          tSaved(
            'saveFailed',
            'Rencana gagal disimpan. Silakan masuk, jalankan ulang simulasi, lalu coba simpan lagi.',
            'Could not save your plan. Please sign in, rerun the simulation, and try saving again.',
          ),
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUser, user?.email, lang]);

  const handleRestoreSavedInput = (saved: FinancialTwinInput) => {
    setInput(saved);
    setErrors({ _hasError: false });
    moveMobileStep('inputs');
  };

  const handleSubmit = async () => {
    const validation = validateInputs(input);
    setErrors(validation);
    if (validation._hasError) {
      moveMobileStep('inputs');
      return;
    }

    try {
      const res = await fetch('/api/financial-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (Array.isArray(data.details)) {
          const serverErrors: ValidationErrors = { _hasError: true };
          for (const detail of data.details) {
            if (detail.field && detail.message) {
              serverErrors[detail.field as keyof FinancialTwinInput] =
                detail.message;
            }
          }
          setErrors(serverErrors);
        }
        return;
      }

      setResults(data.results);
      setInsights(data.insights);
      setActionPlan(data.actionPlan ?? generateActionPlan(input, data.results));
      setSubmittedInput(input);
      setIsSubmitted(true);
      trackFinancialTwinEvent('financial_twin_simulation_completed', {
        ...buildTwinFunnelParams(input, lang),
        entry_point: 'simulator_form',
      });
      moveMobileStep('results');
      void fetchNarrative(input);
    } catch {
      const all = runAllScenarios(input);
      const insight = generateInsights(input, all);
      setResults(all);
      setInsights(insight);
      setActionPlan(generateActionPlan(input, all));
      setSubmittedInput(input);
      setIsSubmitted(true);
      trackFinancialTwinEvent('financial_twin_simulation_completed', {
        ...buildTwinFunnelParams(input, lang),
        entry_point: 'simulator_form',
      });
      moveMobileStep('results');
      // Simulation ran offline via the local fallback; the AI narrative needs
      // the server, so leave it idle rather than showing an error.
      setNarrative(null);
      setNarrativeState('idle');
    }
  };

  const getScenarioLabel = (key: 'current' | 'improved' | 'risky') => {
    const labels =
      vocabularies?.twinSimulator?.scenarioLabels ??
      (lang === 'id'
        ? {
            current: 'Kebiasaan Saat Ini',
            improved: 'Kebiasaan Lebih Baik',
            risky: 'Jalan Berisiko',
          }
        : {
            current: 'Current Path',
            improved: 'Improved Path',
            risky: 'Risky Path',
          });
    return labels[key];
  };

  const emergencyLabel =
    vocabularies?.twinSimulator?.cards?.emergencyFundLabel ??
    (lang === 'id' ? 'Dana darurat (bulan)' : 'Emergency fund (months)');

  const goalReachedLabel =
    vocabularies?.twinSimulator?.cards?.goalReached ??
    (lang === 'id' ? 'Tercapai' : 'Reached');

  const goalNotReachedLabel =
    vocabularies?.twinSimulator?.cards?.goalNotReached ??
    (lang === 'id' ? 'Belum tercapai' : 'Not reached');

  const monthShort =
    vocabularies?.calculators?.month ??
    (lang === 'id' ? 'bulan' : 'month');

  const bottleneckTitle =
    vocabularies?.twinSimulator?.cards?.biggestBottleneckTitle ??
    (lang === 'id' ? 'Bottleneck Terbesar' : 'Biggest Bottleneck');

  const bestActionTitle =
    vocabularies?.twinSimulator?.cards?.bestNextActionTitle ??
    (lang === 'id' ? 'Aksi Selanjutnya' : 'Best Next Action');

  const noResultText =
    vocabularies?.twinSimulator?.noResultText ??
    (lang === 'id'
      ? 'Isi formulir di sebelah kiri lalu jalankan simulasi untuk melihat perbandingan jalur keuanganmu.'
      : 'Fill in the form on the left and run the simulation to compare your money paths.');

  const scenarioExplanations = vocabularies?.twinSimulator?.scenarioExplanations ?? {
    current: {
      title: getScenarioLabel('current'),
      body:
        lang === 'id'
          ? 'Menggunakan pemasukan, pengeluaran, cicilan, dan tabungan persis seperti yang kamu isi.'
          : 'Uses the income, spending, debt payment, and savings numbers exactly as you enter them.',
    },
    improved: {
      title: getScenarioLabel('improved'),
      body:
        lang === 'id'
          ? 'Mengurangi pengeluaran gaya hidup 20% dan makan/transport 10%, lalu memakai uang ekstra untuk utang dan tabungan.'
          : 'Cuts lifestyle spending by 20% and food/transport by 10%, then uses the extra cash for debt and savings.',
    },
    risky: {
      title: getScenarioLabel('risky'),
      body:
        lang === 'id'
          ? 'Menaikkan pengeluaran fleksibel dan menambahkan satu biaya darurat agar kamu bisa melihat sisi buruknya.'
          : 'Raises flexible spending and adds one surprise expense so you can see the downside case.',
    },
  };

  const fieldHelp = vocabularies?.twinSimulator?.fieldHelp ?? {};
  const resultLabels = vocabularies?.twinSimulator?.resultLabels ?? {};

  const formatGoalStatus = (
    goalReached: boolean,
    goalReachedMonth: number | null,
  ) => {
    if (!goalReached) return goalNotReachedLabel;
    if (goalReachedMonth === 0) {
      return resultLabels.alreadyReached ?? goalReachedLabel;
    }
    if (goalReachedMonth != null) {
      return `${resultLabels.reachedInMonth ?? (lang === 'id' ? 'Tercapai di bulan' : 'Reached in month')} ${goalReachedMonth}`;
    }
    return goalReachedLabel;
  };

  const formatEmergencyCover = (months: number | null) => {
    if (months == null) {
      return resultLabels.notSet ?? (lang === 'id' ? 'Belum dihitung' : 'Not available');
    }
    return `${months.toFixed(1)} ${
      resultLabels.monthsOfEssentials ??
      (lang === 'id'
        ? 'bulan pengeluaran wajib'
        : 'months of must-pay spending')
    }`;
  };

  return (
    <ReactQueryProvider>
      <div className='min-h-screen bg-slate-50 pb-16 px-4 pt-4 sm:px-6 lg:px-16 lg:pt-2'>
        <div className='max-w-6xl mx-auto flex flex-col gap-8'>
          <section className='flex flex-col gap-2'>
            <h1 className='text-2xl lg:text-3xl font-bold text-slate-900 leading-tight'>
              {copy.pageTitle}
            </h1>
            <p className='text-slate-600 max-w-3xl'>{copy.pageSubtitle}</p>
          </section>

          {savedPlan && (
            <TwinCheckInCard
              lang={lang}
              vocabularies={vocabularies}
              plan={savedPlan}
              onPlanChanged={setSavedPlan}
              onRestoreInput={handleRestoreSavedInput}
            />
          )}

          <section
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5',
              mobileStep === 'results' && 'hidden lg:block',
            )}
          >
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.6fr] lg:items-start'>
              <div>
                <h2 className='text-base font-semibold text-slate-900'>
                  {copy.introTitle ??
                    (lang === 'id'
                      ? 'Cara membaca simulasi ini'
                      : 'How to read this simulator')}
                </h2>
                <p className='mt-1 text-sm text-slate-600'>
                  {copy.introBody ??
                    (lang === 'id'
                      ? 'Ini bukan prediksi pasti. Ini adalah cara cepat membandingkan kebiasaan hari ini dengan versi yang lebih baik dan versi yang lebih berisiko.'
                      : 'This is not a prediction. It is a quick way to compare today’s habits with a better version and a riskier version.')}
                </p>
              </div>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                {(['current', 'improved', 'risky'] as const).map((key) => (
                  <div
                    key={key}
                    className={cn(
                      'rounded-xl border p-3',
                      key === 'improved'
                        ? 'border-emerald-200 bg-emerald-50'
                        : key === 'risky'
                          ? 'border-rose-200 bg-rose-50'
                          : 'border-slate-200 bg-slate-50',
                    )}
                  >
                    <p className='text-sm font-semibold text-slate-900'>
                      {scenarioExplanations[key]?.title ?? getScenarioLabel(key)}
                    </p>
                    <p className='mt-1 text-xs leading-relaxed text-slate-600'>
                      {scenarioExplanations[key]?.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className='grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] gap-6 lg:gap-8 lg:items-start'>
            <Card
              className={cn(
                'shadow-sm border-slate-200 rounded-2xl lg:sticky lg:top-6 lg:self-start',
                mobileStep === 'results' && 'hidden lg:block',
              )}
            >
              <CardHeader>
                <CardTitle className='text-base font-semibold text-slate-900'>
                  {copy.formTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-xs leading-relaxed text-slate-500'>
                  {copy.formHelper ??
                    (lang === 'id'
                      ? 'Pakai angka bulanan yang mendekati kondisi aslimu. Tidak harus sempurna, yang penting cukup realistis.'
                      : 'Use rough monthly numbers that feel close to real life. They do not need to be perfect, just realistic enough.')}
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.monthlyIncome ??
                      (lang === 'id'
                        ? 'Penghasilan bulanan'
                        : 'Monthly income')
                    }
                    value={input.monthlyIncome}
                    error={errors.monthlyIncome}
                    onChange={handleNumberChange('monthlyIncome')}
                    help={fieldHelp.monthlyIncome}
                  />
                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.currentSavings ??
                      (lang === 'id'
                        ? 'Tabungan/investasi saat ini'
                        : 'Current savings & investments')
                    }
                    value={input.currentSavings}
                    error={errors.currentSavings}
                    onChange={handleNumberChange('currentSavings')}
                    help={fieldHelp.currentSavings}
                  />

                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.essentialSpending ??
                      (lang === 'id'
                        ? 'Kebutuhan pokok (sewa, utilitas, dll.)'
                        : 'Essential spending (rent, bills, etc.)')
                    }
                    value={input.essentialSpending}
                    error={errors.essentialSpending}
                    onChange={handleNumberChange('essentialSpending')}
                    help={fieldHelp.essentialSpending}
                  />
                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.lifestyleSpending ??
                      (lang === 'id'
                        ? 'Gaya hidup (nongkrong, hobi, belanja)'
                        : 'Lifestyle (going out, hobbies, shopping)')
                    }
                    value={input.lifestyleSpending}
                    error={errors.lifestyleSpending}
                    onChange={handleNumberChange('lifestyleSpending')}
                    help={fieldHelp.lifestyleSpending}
                  />

                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields
                        ?.foodTransportSpending ??
                      (lang === 'id'
                        ? 'Makan & transport'
                        : 'Food & transport')
                    }
                    value={input.foodTransportSpending}
                    error={errors.foodTransportSpending}
                    onChange={handleNumberChange('foodTransportSpending')}
                    help={fieldHelp.foodTransportSpending}
                  />
                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.otherSpending ??
                      (lang === 'id'
                        ? 'Pengeluaran lainnya'
                        : 'Other spending')
                    }
                    value={input.otherSpending}
                    error={errors.otherSpending}
                    onChange={handleNumberChange('otherSpending')}
                    help={fieldHelp.otherSpending}
                  />

                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.debtBalance ??
                      (lang === 'id'
                        ? 'Total utang/pinjaman berjalan'
                        : 'Total debt / paylater balance')
                    }
                    value={input.debtBalance}
                    error={errors.debtBalance}
                    onChange={handleNumberChange('debtBalance')}
                    help={fieldHelp.debtBalance}
                  />
                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.monthlyDebtPayment ??
                      (lang === 'id'
                        ? 'Cicilan utang bulanan'
                        : 'Monthly debt payment')
                    }
                    value={input.monthlyDebtPayment}
                    error={errors.monthlyDebtPayment}
                    onChange={handleNumberChange('monthlyDebtPayment')}
                    help={fieldHelp.monthlyDebtPayment}
                  />

                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.goalAmount ??
                      (lang === 'id'
                        ? 'Target dana tujuan keuangan'
                        : 'Financial goal amount')
                    }
                    value={input.financialGoalAmount}
                    error={errors.financialGoalAmount}
                    onChange={handleNumberChange('financialGoalAmount')}
                    help={fieldHelp.goalAmount}
                  />
                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.timeHorizon ??
                      (lang === 'id'
                        ? 'Horizon waktu (bulan)'
                        : 'Time horizon (months)')
                    }
                    value={input.timeHorizonMonths}
                    error={errors.timeHorizonMonths}
                    onChange={handleNumberChange('timeHorizonMonths')}
                    suffix={monthShort}
                    help={fieldHelp.timeHorizon}
                  />

                  <Field
                    label={
                      vocabularies?.twinSimulator?.fields?.expectedReturn ??
                      (lang === 'id'
                        ? 'Asumsi return tahunan (%)'
                        : 'Expected annual return (%)')
                    }
                    value={input.expectedAnnualReturn}
                    error={errors.expectedAnnualReturn}
                    onChange={handleNumberChange('expectedAnnualReturn')}
                    suffix='%'
                    help={fieldHelp.expectedReturn}
                  />

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-medium text-slate-700'>
                      {vocabularies?.twinSimulator?.fields?.riskBehavior ??
                        (lang === 'id'
                          ? 'Gaya risiko untuk jalur berisiko'
                          : 'Risk behavior for risky path')}
                    </Label>
                    <div className='grid grid-cols-3 gap-2'>
                      {(['low', 'medium', 'high'] as RiskBehavior[]).map(
                        (level) => (
                          <button
                            key={level}
                            type='button'
                            onClick={() => handleRiskChange(level)}
                            className={cn(
                              'min-w-0 rounded-full border px-2 py-1 text-xs font-medium transition',
                              input.riskBehavior === level
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                            )}
                          >
                            {vocabularies?.twinSimulator?.riskLevels?.[level] ??
                              (lang === 'id'
                                ? level === 'low'
                                  ? 'Santai'
                                  : level === 'medium'
                                    ? 'Seimbang'
                                    : 'Agresif'
                                : level === 'low'
                                  ? 'Cautious'
                                  : level === 'medium'
                                    ? 'Balanced'
                                    : 'Aggressive')}
                          </button>
                        ),
                      )}
                    </div>
                    {fieldHelp.riskBehavior && (
                      <p className='text-[11px] leading-relaxed text-slate-500'>
                        {fieldHelp.riskBehavior}
                      </p>
                    )}
                    {errors.riskBehavior && (
                      <p className='text-[11px] text-red-600'>
                        {errors.riskBehavior}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type='button'
                  onClick={handleSubmit}
                  className='w-full rounded-full mt-2'
                  size='lg'
                >
                  {copy.runButton}
                </Button>
              </CardContent>
            </Card>

            <div
              className={cn(
                'flex flex-col gap-4',
                mobileStep === 'inputs' && 'hidden lg:flex',
              )}
            >
              <div className='flex items-center justify-between gap-3 lg:hidden'>
                <div>
                  <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>
                    {lang === 'id' ? 'Hasil simulasi' : 'Simulation results'}
                  </p>
                  <h2 className='text-lg font-semibold text-slate-900'>
                    {copy.summaryTitle}
                  </h2>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => moveMobileStep('inputs')}
                  className='shrink-0 rounded-full'
                >
                  {lang === 'id' ? 'Ubah input' : 'Edit inputs'}
                </Button>
              </div>

              <Card className='shadow-sm border-slate-200 rounded-2xl'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base font-semibold text-slate-900'>
                    {copy.summaryTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {copy.summaryHelper && (
                    <p className='text-xs leading-relaxed text-slate-500'>
                      {copy.summaryHelper}
                    </p>
                  )}
                  {!results || !insights ? (
                    <p className='text-xs text-slate-500'>{noResultText}</p>
                  ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-xs'>
                      {(['current', 'improved', 'risky'] as const).map(
                        (key) => {
                          const summary = insights.scenarioSummaries[key];
                          return (
                            <div
                              key={key}
                              className={cn(
                                'rounded-2xl border p-3 flex flex-col gap-1',
                                key === 'improved'
                                  ? 'border-emerald-500/60 bg-emerald-50'
                                  : key === 'risky'
                                    ? 'border-rose-400/60 bg-rose-50'
                                    : 'border-slate-200 bg-white',
                              )}
                            >
                              <p className='text-[11px] font-semibold text-slate-800'>
                                {getScenarioLabel(key)}
                              </p>
                              <p className='text-[11px] text-slate-500'>
                                {resultLabels.finalNetPosition ??
                                  (lang === 'id'
                                    ? 'Uang setelah dikurangi utang:'
                                    : 'Money after debt:')}{' '}
                                <span className='font-semibold'>
                                  {formatRupiah(summary.finalNetPosition)}
                                </span>
                              </p>
                              <p className='text-[11px] text-slate-500'>
                                {resultLabels.goalStatus ??
                                  (lang === 'id'
                                    ? 'Status target:'
                                    : 'Goal status:')}{' '}
                                <span className='font-semibold'>
                                  {formatGoalStatus(
                                    summary.goalReached,
                                    summary.goalReachedMonth,
                                  )}
                                </span>
                              </p>
                              <p className='text-[11px] text-slate-500'>
                                {emergencyLabel}:{' '}
                                <span className='font-semibold'>
                                  {formatEmergencyCover(
                                    summary.emergencyFundMonths,
                                  )}
                                </span>
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className='shadow-sm border-slate-200 rounded-2xl'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base font-semibold text-slate-900'>
                    {copy.chartTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {copy.chartHelper && (
                    <p className='text-xs leading-relaxed text-slate-500'>
                      {copy.chartHelper}
                    </p>
                  )}
                  {results && chartData.length > 0 ? (
                    <ChartContainer
                      config={{
                        current: {
                          label: getScenarioLabel('current'),
                          color: '#0f172a',
                        },
                        improved: {
                          label: getScenarioLabel('improved'),
                          color: '#16a34a',
                        },
                        risky: {
                          label: getScenarioLabel('risky'),
                          color: '#e11d48',
                        },
                      }}
                      className='w-full'
                    >
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='month' />
                        <YAxis
                          tickFormatter={(v) =>
                            lang === 'id'
                              ? `${v / 1_000_000}jt`
                              : `${v / 1_000_000}m`
                          }
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value) =>
                                `${lang === 'id' ? 'Bulan' : 'Month'} ${value}`
                              }
                              formatter={(value, name) => {
                                return (
                                  <div className='flex w-full justify-between gap-2'>
                                    <span>{name}</span>
                                    <span className='font-mono'>
                                      {formatRupiah(value as number)}
                                    </span>
                                  </div>
                                );
                              }}
                            />
                          }
                        />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='current'
                          name={getScenarioLabel('current')}
                          stroke='var(--color-current)'
                          dot={false}
                          strokeWidth={2}
                        />
                        <Line
                          type='monotone'
                          dataKey='improved'
                          name={getScenarioLabel('improved')}
                          stroke='var(--color-improved)'
                          dot={false}
                          strokeWidth={2}
                        />
                        <Line
                          type='monotone'
                          dataKey='risky'
                          name={getScenarioLabel('risky')}
                          stroke='var(--color-risky)'
                          dot={false}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <p className='text-xs text-slate-500'>
                      {lang === 'id'
                        ? 'Grafik akan muncul setelah kamu menjalankan simulasi.'
                        : 'The chart will appear after you run the simulation.'}
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card className='shadow-sm border-slate-200 rounded-2xl'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-semibold text-slate-900'>
                      {bottleneckTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xs text-slate-600 min-h-[2.5rem]'>
                      {isSubmitted ? biggestBottleneck : '—'}
                    </p>
                  </CardContent>
                </Card>
                <Card className='shadow-sm border-slate-200 rounded-2xl'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-sm font-semibold text-slate-900'>
                      {bestActionTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xs text-slate-600 min-h-[2.5rem]'>
                      {isSubmitted ? bestNextAction : '—'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {isSubmitted && narrativeState !== 'idle' && (
                <NarrativeCard
                  narrative={narrative}
                  state={narrativeState}
                  lang={lang}
                  vocabularies={vocabularies}
                />
              )}

              {isSubmitted && actionPlan && results && submittedInput && (
                <ActionPlanCard
                  actionPlan={actionPlan}
                  submittedInput={submittedInput}
                  horizonMonths={results.current.snapshots.length}
                  vocabularies={vocabularies}
                  lang={lang}
                />
              )}

              {isSubmitted &&
                actionPlan &&
                results &&
                insights &&
                submittedInput && (
                  <SavePlanCard
                    lang={lang}
                    vocabularies={vocabularies}
                    submittedInput={submittedInput}
                    results={results}
                    insights={insights}
                    actionPlan={actionPlan}
                    isAuthenticated={Boolean(user?.email)}
                    onPlanSaved={setSavedPlan}
                  />
                )}
            </div>
          </section>

          <section className='mt-4'>
            <Card className='border-amber-300 bg-amber-50/80 rounded-2xl'>
              <CardHeader className='pb-1'>
                <CardTitle className='text-sm font-semibold text-amber-900'>
                  {copy.disclaimerTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-xs text-amber-900'>{copy.disclaimerBody}</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </ReactQueryProvider>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  suffix,
  help,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  suffix?: string;
  help?: string;
}) {
  const formatted = suffix
    ? String(value)
    : new Intl.NumberFormat('id-ID').format(value);

  return (
    <div className='space-y-1.5'>
      <Label className='text-xs font-medium text-slate-700'>{label}</Label>
      <div className='relative'>
        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-[11px] text-slate-400'>
          {suffix === '%' || suffix === 'month' || suffix === 'bulan'
            ? ''
            : 'Rp'}
        </span>
        <Input
          value={formatted}
          onChange={onChange}
          onFocus={(e) => e.target.select()}
          className={cn(
            'h-9 text-xs rounded-full bg-white border-slate-200 pl-8',
            suffix && (suffix === '%' || suffix === 'month' || suffix === 'bulan')
              ? 'pl-3'
              : 'pl-8',
          )}
        />
        {suffix && (
          <span className='absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] text-slate-400'>
            {suffix}
          </span>
        )}
      </div>
      {help && <p className='text-[11px] leading-relaxed text-slate-500'>{help}</p>}
      {error && <p className='text-[11px] text-red-600'>{error}</p>}
    </div>
  );
}

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    String(values[key] ?? ''),
  );
}

const HEALTH_DOT_CLASS: Record<HealthStatus, string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  alert: 'bg-rose-500',
};

// Single-paragraph message (the chat input is a one-line field) summarizing the
// simulation, handed to the consultation chat via sessionStorage.
function buildConsultationPrefill(
  input: FinancialTwinInput,
  actionPlan: ActionPlan,
  horizonMonths: number,
  lang: Locale,
): string {
  const totalSpending =
    input.essentialSpending +
    input.lifestyleSpending +
    input.foodTransportSpending +
    input.otherSpending;

  const rp = formatRupiah;

  if (lang === 'id') {
    const debtPart =
      input.debtBalance > 0
        ? `utang ${rp(input.debtBalance)} dengan cicilan ${rp(input.monthlyDebtPayment)} per bulan, `
        : '';
    let outcome: string;
    if (actionPlan.alreadyAtGoal) {
      outcome =
        'Menurut simulasi, tabunganku sebenarnya sudah menutupi target ini.';
    } else if (actionPlan.savingGap != null) {
      outcome = `Menurut simulasi, aku masih kurang sekitar ${rp(actionPlan.savingGap)} per bulan untuk mencapainya tepat waktu.`;
    } else if (
      actionPlan.projectedGoalMonth != null &&
      actionPlan.projectedGoalMonth <= horizonMonths
    ) {
      outcome = `Menurut simulasi, target ini tercapai di bulan ke-${actionPlan.projectedGoalMonth}.`;
    } else {
      outcome = `Menurut simulasi, target ini belum tercapai dalam ${horizonMonths} bulan.`;
    }
    return (
      `Halo Docduit! Aku baru saja mencoba Financial Twin Simulator. ` +
      `Kondisiku: penghasilan ${rp(input.monthlyIncome)} per bulan, total pengeluaran ${rp(totalSpending)} per bulan, ` +
      debtPart +
      `dan tabungan saat ini ${rp(input.currentSavings)}. ` +
      `Targetku ${rp(input.financialGoalAmount)} dalam ${horizonMonths} bulan. ` +
      outcome +
      ' Bisa bantu aku menyusun langkah konkret supaya kondisi keuanganku makin sehat?'
    );
  }

  const debtPart =
    input.debtBalance > 0
      ? `${rp(input.debtBalance)} in debt with ${rp(input.monthlyDebtPayment)} monthly payments, `
      : '';
  let outcome: string;
  if (actionPlan.alreadyAtGoal) {
    outcome =
      'According to the simulation, my savings already cover this goal.';
  } else if (actionPlan.savingGap != null) {
    outcome = `According to the simulation, I am about ${rp(actionPlan.savingGap)} per month short of reaching it on time.`;
  } else if (
    actionPlan.projectedGoalMonth != null &&
    actionPlan.projectedGoalMonth <= horizonMonths
  ) {
    outcome = `According to the simulation, I reach this goal in month ${actionPlan.projectedGoalMonth}.`;
  } else {
    outcome = `According to the simulation, this goal is not reached within ${horizonMonths} months.`;
  }
  return (
    `Hi Docduit! I just tried the Financial Twin Simulator. ` +
    `My situation: income of ${rp(input.monthlyIncome)} per month, total spending of ${rp(totalSpending)} per month, ` +
    debtPart +
    `and current savings of ${rp(input.currentSavings)}. ` +
    `My goal is ${rp(input.financialGoalAmount)} within ${horizonMonths} months. ` +
    outcome +
    ' Can you help me put together concrete steps to make my finances healthier?'
  );
}

function NarrativeCard({
  narrative,
  state,
  lang,
  vocabularies,
}: {
  narrative: TwinNarrative | null;
  state: 'loading' | 'done' | 'error';
  lang: Locale;
  vocabularies: any;
}) {
  const dict = vocabularies?.twinSimulator?.narrative ?? {};
  const isId = lang === 'id';
  const t = (key: string, fallbackId: string, fallbackEn: string): string =>
    typeof dict?.[key] === 'string' ? dict[key] : isId ? fallbackId : fallbackEn;

  // On error we simply render nothing; the rule-based insights and action plan
  // already cover the user.
  if (state === 'error') return null;

  return (
    <Card className='shadow-sm border-indigo-200 bg-indigo-50/40 rounded-2xl'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-base font-semibold text-slate-900'>
          <span className='inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white'>
            {t('badge', 'AI', 'AI')}
          </span>
          {t('title', 'Bacaan AI dari simulasimu', 'AI reading of your simulation')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {state === 'loading' || !narrative ? (
          <div className='space-y-2' aria-live='polite'>
            <div className='h-3 w-2/3 animate-pulse rounded-full bg-slate-200' />
            <div className='h-3 w-full animate-pulse rounded-full bg-slate-200' />
            <div className='h-3 w-5/6 animate-pulse rounded-full bg-slate-200' />
            <p className='text-[11px] text-slate-500'>
              {t(
                'loading',
                'AI sedang menyusun penjelasan dari angkamu…',
                'AI is writing an explanation from your numbers…',
              )}
            </p>
          </div>
        ) : (
          <>
            {narrative.headline && (
              <p className='text-sm font-semibold text-slate-900'>
                {narrative.headline}
              </p>
            )}
            <p className='text-xs leading-relaxed text-slate-700'>
              {narrative.summary}
            </p>
            {narrative.bottleneckExplanation && (
              <p className='text-xs leading-relaxed text-slate-700'>
                {narrative.bottleneckExplanation}
              </p>
            )}
            {narrative.recommendedActions.length > 0 && (
              <div>
                <p className='text-xs font-semibold text-slate-800'>
                  {t('actionsTitle', 'Langkah yang disarankan AI', 'AI-suggested steps')}
                </p>
                <ul className='mt-1 space-y-1'>
                  {narrative.recommendedActions.map((action, index) => (
                    <li
                      key={index}
                      className='flex gap-2 text-xs leading-relaxed text-slate-700'
                    >
                      <span className='mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500' />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {narrative.encouragement && (
              <p className='text-xs font-medium leading-relaxed text-indigo-700'>
                {narrative.encouragement}
              </p>
            )}
            <p className='text-[10px] leading-relaxed text-slate-400'>
              {t(
                'disclaimer',
                'Teks ini dibuat oleh AI berdasarkan hasil simulasi dan hanya untuk edukasi — bukan nasihat keuangan berlisensi.',
                'This text is generated by AI from your simulation results and is for education only — not licensed financial advice.',
              )}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ActionPlanCard({
  actionPlan,
  submittedInput,
  horizonMonths,
  vocabularies,
  lang,
}: {
  actionPlan: ActionPlan;
  submittedInput: FinancialTwinInput;
  horizonMonths: number;
  vocabularies: any;
  lang: Locale;
}) {
  const dict = vocabularies?.twinSimulator?.actionPlan ?? {};
  const isId = lang === 'id';
  const t = (key: string, fallbackId: string, fallbackEn: string): string => {
    const parts = key.split('.');
    let node: any = dict;
    for (const part of parts) {
      node = node?.[part];
      if (node == null) break;
    }
    return typeof node === 'string' ? node : isId ? fallbackId : fallbackEn;
  };

  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

  const healthItems: {
    label: string;
    value: string;
    status: HealthStatus;
  }[] = [
    {
      label: t('health.savingsRate', 'Rasio menabung', 'Savings rate'),
      value: formatPercent(actionPlan.health.savingsRate.value),
      status: actionPlan.health.savingsRate.status,
    },
    {
      label: t(
        'health.debtServiceRatio',
        'Cicilan vs penghasilan',
        'Debt payments vs income',
      ),
      value: formatPercent(actionPlan.health.debtServiceRatio.value),
      status: actionPlan.health.debtServiceRatio.status,
    },
    {
      label: t('health.emergencyFund', 'Dana darurat', 'Emergency fund'),
      value:
        actionPlan.health.emergencyFundMonths.value != null
          ? `${actionPlan.health.emergencyFundMonths.value.toFixed(1)} ${t(
              'health.months',
              'bulan',
              'months',
            )}`
          : t('health.notAvailable', 'n/a', 'n/a'),
      status: actionPlan.health.emergencyFundMonths.status,
    },
  ];

  const gapMessage = (() => {
    if (actionPlan.alreadyAtGoal) {
      return t(
        'alreadyAtGoalMessage',
        'Tabunganmu sudah menutupi target ini. Pakai langkah di bawah untuk memperkuat cadangan atau pasang target yang lebih besar.',
        'Your savings already cover this goal. Use the steps below to build your buffer or set a bigger goal.',
      );
    }
    if (actionPlan.savingGap != null) {
      return fillTemplate(
        t(
          'gapMessage',
          'Kamu masih kurang {amount} per bulan. Langkah di bawah menunjukkan cara tercepat menutup selisihnya.',
          'You are {amount} per month short. The steps below show the fastest ways to close that gap.',
        ),
        { amount: formatRupiah(actionPlan.savingGap) },
      );
    }
    return t(
      'onTrackMessage',
      'Anggaranmu saat ini sudah cukup. Langkah di bawah membuatmu sampai lebih cepat lagi.',
      'Your current budget already covers this. The steps below get you there even faster.',
    );
  })();

  const goalMissedInHorizon =
    !actionPlan.alreadyAtGoal &&
    (actionPlan.projectedGoalMonth == null ||
      actionPlan.projectedGoalMonth > horizonMonths);

  const projectionMessage = goalMissedInHorizon
    ? actionPlan.projectedGoalMonth != null
      ? fillTemplate(
          t(
            'projectedLate',
            'Dengan kebiasaan sekarang, target baru tercapai di bulan {month} — telat {late} bulan dari rencanamu.',
            'At your current pace, this goal lands at month {month} — {late} months past your timeline.',
          ),
          {
            month: actionPlan.projectedGoalMonth,
            late: actionPlan.projectedGoalMonth - horizonMonths,
          },
        )
      : t(
          'projectedNever',
          'Dengan kebiasaan sekarang, target tidak tercapai dalam 10 tahun ke depan. Pertimbangkan target lebih kecil, waktu lebih panjang, atau langkah menambah penghasilan di bawah.',
          'At your current pace, this goal is not reached within the next 10 years. Consider a smaller goal, a longer timeline, or the income step below.',
        )
    : null;

  const leverTitle = (lever: ActionLever) => {
    const templates: Record<ActionLever['key'], [string, string]> = {
      cutLifestyle: [
        'Kurangi pengeluaran gaya hidup 20% (hemat {amount}/bulan)',
        'Cut lifestyle spending by 20% (frees {amount}/month)',
      ],
      cutFoodTransport: [
        'Hemat makan & transport 10% (hemat {amount}/bulan)',
        'Trim food & transport by 10% (frees {amount}/month)',
      ],
      increaseIncome: [
        'Tambah penghasilan 10% (sekitar {amount}/bulan — side gig, naik gaji, atau freelance)',
        'Grow income by 10% (adds {amount}/month — side gig, raise, or freelance)',
      ],
    };
    const [fbId, fbEn] = templates[lever.key];
    return fillTemplate(t(`levers.${lever.key}`, fbId, fbEn), {
      amount: formatRupiah(lever.monthlyAmount),
    });
  };

  const leverImpact = (lever: ActionLever) => {
    if (lever.unlocksGoal && lever.goalMonthAfter != null) {
      return fillTemplate(
        t(
          'impactUnlocksGoal',
          'Membuat target jadi tercapai — di bulan {month}, dari sebelumnya tidak tercapai',
          'Makes your goal reachable — hit at month {month} instead of missing it',
        ),
        { month: lever.goalMonthAfter },
      );
    }
    if (
      lever.monthsSaved != null &&
      lever.monthsSaved > 0 &&
      lever.goalMonthAfter != null &&
      lever.goalMonthBefore != null
    ) {
      return fillTemplate(
        t(
          'impactEarlier',
          'Target tercapai di bulan {month}, bukan bulan {before} — lebih cepat {saved} bulan',
          'Goal at month {month} instead of {before} — {saved} months earlier',
        ),
        {
          month: lever.goalMonthAfter,
          before: lever.goalMonthBefore,
          saved: lever.monthsSaved,
        },
      );
    }
    return fillTemplate(
      t(
        'impactNetOnly',
        'Waktu target tidak berubah, tapi posisi akhirmu naik {amount}',
        'Goal timing unchanged, but you end {amount} better off',
      ),
      { amount: formatRupiah(lever.netPositionDelta) },
    );
  };

  return (
    <Card className='shadow-sm border-slate-200 rounded-2xl'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold text-slate-900'>
          {t('title', 'Rencana Aksimu', 'Your Action Plan')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-5'>
        <p className='text-xs leading-relaxed text-slate-500'>
          {t(
            'helper',
            'Dihitung dari angkamu sendiri. Setiap langkah di bawah sudah diukur dampaknya, jadi kamu tahu persis apa yang berubah.',
            'Built from your own numbers. Each step below is quantified so you can see exactly what it changes.',
          )}
        </p>

        <div>
          <p className='text-xs font-semibold text-slate-800 mb-2'>
            {t('healthTitle', 'Cek kesehatan singkat', 'Quick health check')}
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
            {healthItems.map((item) => (
              <div
                key={item.label}
                className='rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-2'
              >
                <span
                  className={cn(
                    'h-2.5 w-2.5 shrink-0 rounded-full',
                    HEALTH_DOT_CLASS[item.status],
                  )}
                />
                <div className='min-w-0'>
                  <p className='text-[11px] text-slate-500 truncate'>
                    {item.label}
                  </p>
                  <p className='text-xs font-semibold text-slate-900'>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-xl border border-slate-200 bg-white p-3 space-y-2'>
          <p className='text-xs font-semibold text-slate-800'>
            {t(
              'targetTitle',
              'Angka yang paling penting',
              'The number that matters',
            )}
          </p>
          {actionPlan.requiredMonthlySaving != null && (
            <div className='flex flex-col gap-1 text-[11px] text-slate-500'>
              <p>
                {t(
                  'requiredPerMonth',
                  'Perlu ditabung per bulan agar target tercapai tepat waktu',
                  'Needed per month to hit your goal on time',
                )}
                :{' '}
                <span className='font-semibold text-slate-900'>
                  {formatRupiah(actionPlan.requiredMonthlySaving)}
                </span>
              </p>
              <p>
                {t(
                  'capacityPerMonth',
                  'Sisa anggaranmu per bulan saat ini',
                  'What your current budget leaves per month',
                )}
                :{' '}
                <span className='font-semibold text-slate-900'>
                  {formatRupiah(actionPlan.monthlyCapacity)}
                </span>
              </p>
            </div>
          )}
          <p className='text-xs leading-relaxed text-slate-600'>{gapMessage}</p>
          {projectionMessage && (
            <p className='text-xs leading-relaxed text-amber-700'>
              {projectionMessage}
            </p>
          )}
        </div>

        {actionPlan.levers.length > 0 && (
          <div>
            <p className='text-xs font-semibold text-slate-800'>
              {t(
                'leversTitle',
                'Langkah dengan dampak terbesar',
                'Highest-impact next steps',
              )}
            </p>
            <p className='mt-0.5 text-[11px] leading-relaxed text-slate-500'>
              {t(
                'leversHelper',
                'Setiap langkah disimulasikan ulang dengan angkamu. Dampak dihitung jika kamu konsisten sepanjang periode.',
                'Each step was re-simulated with your numbers. Impact assumes you keep it up for the whole timeline.',
              )}
            </p>
            <ol className='mt-2 space-y-2'>
              {actionPlan.levers.map((lever, index) => (
                <li
                  key={lever.key}
                  className='rounded-xl border border-slate-200 bg-slate-50 p-3 flex gap-3'
                >
                  <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white'>
                    {index + 1}
                  </span>
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold text-slate-900'>
                      {leverTitle(lever)}
                    </p>
                    <p className='mt-0.5 text-[11px] leading-relaxed text-emerald-700'>
                      {leverImpact(lever)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className='rounded-xl border border-slate-900/10 bg-slate-900 p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-semibold text-white'>
              {t(
                'ctaTitle',
                'Mau langkah ini jadi rencana lengkap?',
                'Want this turned into a full plan?',
              )}
            </p>
            <p className='mt-0.5 text-[11px] leading-relaxed text-slate-300'>
              {t(
                'ctaBody',
                'Diskusikan langkah-langkah ini dengan konsultasi AI Docduit dan dapatkan resep keuangan yang dipersonalisasi.',
                'Discuss these steps with the Docduit AI consultation and get a personalized financial prescription.',
              )}
            </p>
          </div>
          <Button
            asChild
            size='sm'
            className='shrink-0 rounded-full bg-white text-slate-900 hover:bg-slate-100'
          >
            <Link
              href={`/${lang}/consultation`}
              onClick={() => {
                trackFinancialTwinEvent('financial_twin_consultation_clicked', {
                  ...buildTwinFunnelParams(submittedInput, lang),
                  entry_point: 'twin_action_plan',
                });
                storeTwinConsultPrefill(
                  buildConsultationPrefill(
                    submittedInput,
                    actionPlan,
                    horizonMonths,
                    lang,
                  ),
                );
              }}
            >
              {t(
                'ctaButton',
                'Diskusikan dengan konsultasi AI',
                'Discuss with AI consultation',
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
