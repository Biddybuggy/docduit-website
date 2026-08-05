'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
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
  getSaveErrorMessage,
  SavePlanCard,
  TwinCheckInCard,
} from './_components/twin-plan-card';
import { CollapsibleCard } from './_components/collapsible-section';
import { buildTwinDownloadPlan } from '@/lib/download-plan';
import { DownloadPlanCard } from '@/components/shared/download-plan-card';
import { handleDownloadImage } from '@/lib/handleDownloadImage';
import type { TwinNarrative } from '@/lib/financial-twin-narrative';
import { Locale } from '../_utils/dictionaries';
import { ReactQueryProvider } from '@/lib/react-query';
import InputCalculationNumber from '@/components/shared/input-calculation-number';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  ReferenceLine,
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

// Brand palette shared with the calculator pages (tailwind.config docduit.*).
const SCENARIO_COLORS = {
  current: '#1385be', // docduit-blue
  improved: '#95a237', // docduit-green
  risky: '#de5d53', // docduit-red
} as const;

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

// Slider bounds per field. Typing into the big blue number still accepts any
// value the validator allows — the slider is only the quick-adjust affordance,
// exactly like the calculator pages.
const SLIDER_RANGE: Record<
  Exclude<keyof FinancialTwinInput, 'riskBehavior'>,
  { min: number; max: number; step: number }
> = {
  monthlyIncome: { min: 0, max: 50_000_000, step: 500_000 },
  currentSavings: { min: 0, max: 200_000_000, step: 1_000_000 },
  essentialSpending: { min: 0, max: 30_000_000, step: 250_000 },
  lifestyleSpending: { min: 0, max: 20_000_000, step: 100_000 },
  foodTransportSpending: { min: 0, max: 20_000_000, step: 100_000 },
  otherSpending: { min: 0, max: 20_000_000, step: 100_000 },
  debtBalance: { min: 0, max: 200_000_000, step: 500_000 },
  monthlyDebtPayment: { min: 0, max: 20_000_000, step: 100_000 },
  financialGoalAmount: { min: 0, max: 500_000_000, step: 1_000_000 },
  timeHorizonMonths: { min: 1, max: 120, step: 1 },
  expectedAnnualReturn: { min: 0, max: 20, step: 1 },
};

const formatRupiahShort = (value: number) =>
  `Rp${value.toLocaleString('id-ID')}`;

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
      formTitle: lang === 'id' ? 'Profil Keuangan Kamu' : 'Your Monthly Numbers',
      runButton: lang === 'id' ? 'Jalankan Simulasi' : 'Run Simulation',
      summaryTitle:
        lang === 'id'
          ? 'Perbandingan Tiga Jalur'
          : 'What the Simulator Found',
      chartTitle:
        lang === 'id'
          ? 'Proyeksi Posisi Bersih per Bulan'
          : 'Money After Debt, Month by Month',
      disclaimerTitle:
        lang === 'id' ? 'Disclaimer Edukasi' : 'Educational Disclaimer',
      disclaimerBody:
        lang === 'id'
          ? 'Simulator ini bersifat edukatif dan tidak memberikan rekomendasi produk keuangan apa pun. Angka yang muncul adalah ilustrasi dan bukan jaminan hasil di masa depan.'
          : "This tool is for learning and planning only. It doesn't recommend financial products, promise returns, or replace advice from a qualified professional.",
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
  const isId = lang === 'id';

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
  // Which secondary result widgets are expanded. Only the headline numbers and
  // the comparison are always visible; the rest start collapsed so the results
  // panel stays readable.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const { user, isLoading: isLoadingUser } = useAuth();
  const [savedPlan, setSavedPlan] = useState<FinancialTwinPlan | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const onDownloadPlan = async () => {
    setDownloadLoading(true);
    try {
      await handleDownloadImage(
        'download-plan-twin',
        `Docduit - ${isId ? 'Rencana Keuangan' : 'Financial Plan'}.png`,
      );
    } finally {
      setDownloadLoading(false);
    }
  };
  const resultsPanelRef = useRef<HTMLDivElement>(null);
  const inputPanelRef = useRef<HTMLDivElement>(null);
  const viewedTrackedRef = useRef(false);
  const inputStartedRef = useRef(false);
  const resultsViewedRef = useRef(false);
  const saveIntentHandledRef = useRef(false);
  const tSaved = getSavedPlanCopy(vocabularies, lang);

  // Mirrors the calculator pages: the hero panel is swapped out for the result
  // panel once there is something to show. Desktop keeps the form on screen,
  // mobile switches between the two steps.
  const activeState: 'input' | 'results' =
    isSubmitted && mobileStep === 'results' ? 'results' : 'input';

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

  const setField =
    (field: Exclude<keyof FinancialTwinInput, 'riskBehavior'>) =>
    (value: number) => {
      trackInputStartedOnce();
      const numeric = Number.isFinite(value) ? value : 0;
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

  // Enter the results view. On mobile that swaps the visible step; on desktop
  // the result panel replaces the hero panel next to the form, so all we need
  // is to make sure both panels are scrolled to their own top.
  const showResults = () => {
    // The headline, comparison and chart now render inline, so the action plan
    // is the one collapsed section worth opening on arrival — it carries the
    // consultation CTA.
    setOpenSections({ actionPlan: true });
    moveMobileStep('results');
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        resultsPanelRef.current?.scrollTo({ top: 0 });
        // The submit button sits at the foot of the form, so the input panel is
        // scrolled to its end when the run starts. Rewind it, otherwise the
        // results appear beside the last field instead of the first one.
        inputPanelRef.current?.scrollTo({ top: 0 });
      });
    }
  };

  // Return to editing the inputs (mobile steps back to the form).
  const showInputs = () => {
    moveMobileStep('inputs');
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
    showResults();

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
        toast.error(getSaveErrorMessage(tSaved, error));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUser, user?.email, lang]);

  const handleRestoreSavedInput = (saved: FinancialTwinInput) => {
    setInput(saved);
    setErrors({ _hasError: false });
    showInputs();
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
      showResults();
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
      showResults();
      // Simulation ran offline via the local fallback; the AI narrative needs
      // the server, so leave it idle rather than showing an error.
      setNarrative(null);
      setNarrativeState('idle');
    }
  };

  const getScenarioLabel = (key: 'current' | 'improved' | 'risky') => {
    const labels =
      vocabularies?.twinSimulator?.scenarioLabels ??
      (isId
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

  const goalReachedLabel =
    vocabularies?.twinSimulator?.cards?.goalReached ??
    (isId ? 'Tercapai' : 'Reached');

  const goalNotReachedLabel =
    vocabularies?.twinSimulator?.cards?.goalNotReached ??
    (isId ? 'Belum tercapai' : 'Not reached');

  const monthShort =
    vocabularies?.calculators?.month ?? (isId ? 'bulan' : 'month');
  const monthsShort =
    vocabularies?.calculators?.months ?? (isId ? 'bulan' : 'months');

  const bottleneckTitle =
    vocabularies?.twinSimulator?.cards?.biggestBottleneckTitle ??
    (isId ? 'Bottleneck Terbesar' : 'Biggest Bottleneck');

  const bestActionTitle =
    vocabularies?.twinSimulator?.cards?.bestNextActionTitle ??
    (isId ? 'Aksi Selanjutnya' : 'Best Next Action');

  const insightsSectionTitle =
    vocabularies?.twinSimulator?.cards?.insightsTitle ??
    (isId ? 'Insight Utama' : 'Key Insights');

  const noResultText =
    vocabularies?.twinSimulator?.noResultText ??
    (isId
      ? 'Isi formulir di sebelah kiri lalu jalankan simulasi untuk melihat perbandingan jalur keuanganmu.'
      : 'Fill in the form on the left and run the simulation to compare your money paths.');

  const scenarioExplanations = vocabularies?.twinSimulator
    ?.scenarioExplanations ?? {
    current: {
      title: getScenarioLabel('current'),
      body: isId
        ? 'Menggunakan pemasukan, pengeluaran, cicilan, dan tabungan persis seperti yang kamu isi.'
        : 'Uses the income, spending, debt payment, and savings numbers exactly as you enter them.',
    },
    improved: {
      title: getScenarioLabel('improved'),
      body: isId
        ? 'Mengurangi pengeluaran gaya hidup 20% dan makan/transport 10%, lalu memakai uang ekstra untuk utang dan tabungan.'
        : 'Cuts lifestyle spending by 20% and food/transport by 10%, then uses the extra cash for debt and savings.',
    },
    risky: {
      title: getScenarioLabel('risky'),
      body: isId
        ? 'Menaikkan pengeluaran fleksibel dan menambahkan satu biaya darurat agar kamu bisa melihat sisi buruknya.'
        : 'Raises flexible spending and adds one surprise expense so you can see the downside case.',
    },
  };

  const fieldHelp = vocabularies?.twinSimulator?.fieldHelp ?? {};
  const fields = vocabularies?.twinSimulator?.fields ?? {};
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
      return `${resultLabels.reachedInMonth ?? (isId ? 'Tercapai di bulan' : 'Reached in month')} ${goalReachedMonth}`;
    }
    return goalReachedLabel;
  };

  const groupTitle = (idText: string, enText: string) => (isId ? idText : enText);

  const currencyField = (
    key: Exclude<
      keyof FinancialTwinInput,
      'riskBehavior' | 'timeHorizonMonths' | 'expectedAnnualReturn'
    >,
    label: string,
    helpKey: string,
  ) => {
    const range = SLIDER_RANGE[key];
    return (
      <SliderField
        key={key}
        label={label}
        value={input[key]}
        onChange={setField(key)}
        min={range.min}
        max={range.max}
        step={range.step}
        minLabel={formatRupiahShort(range.min)}
        maxLabel={formatRupiahShort(range.max)}
        help={fieldHelp[helpKey]}
        error={errors[key]}
      />
    );
  };

  return (
    <ReactQueryProvider>
      <div className='grid grid-cols-1 lg:grid-cols-2 mt-20 lg:mt-0 lg:h-screen'>
        {/* ── Hero panel ─────────────────────────────────────────────── */}
        <div
          className={cn(
            'w-full bg-white flex justify-center px-8 py-10 pb-16 lg:px-16 lg:py-24 lg:overflow-y-auto',
            activeState !== 'input' && 'hidden',
          )}
        >
          {/* `my-auto` rather than `items-center`: the panel scrolls, and flex
              centering would clip the top of taller content out of reach. */}
          <div className='my-auto flex flex-col gap-6 items-center w-full max-w-md'>
            <div className='flex flex-col gap-2 text-center'>
              <img
                src='/illustrations/twin-simulator-calc.svg'
                alt='Financial Twin Simulator'
                className='mx-auto w-44'
              />
              <h1 className='text-3xl xl:text-4xl font-bold'>
                {copy.pageTitle}
              </h1>
              <p className='text-sm'>{copy.pageSubtitle}</p>
            </div>

            {/* "Arti tiga jalur ini" — what the three simulated paths mean. */}
            <div className='w-full flex flex-col gap-2'>
              <p className='text-sm font-semibold text-center'>
                {copy.introTitle ??
                  groupTitle('Arti tiga jalur ini', 'What the three paths mean')}
              </p>
              {(['current', 'improved', 'risky'] as const).map((key) => (
                <div key={key} className='flex gap-2.5 items-start'>
                  <span
                    className='mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full'
                    style={{ background: SCENARIO_COLORS[key] }}
                  />
                  <p className='text-xs font-light text-black/70 leading-relaxed'>
                    <span className='font-semibold text-black'>
                      {scenarioExplanations[key]?.title ??
                        getScenarioLabel(key)}
                      {' — '}
                    </span>
                    {scenarioExplanations[key]?.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Input panel ────────────────────────────────────────────── */}
        <div
          ref={inputPanelRef}
          className={cn(
            // Mobile keeps extra bottom padding so the submit button clears
            // the bottom-fixed floating chat bubble (~56px tall). Desktop
            // scrolls inside the panel and ends on the disclaimer, so it only
            // needs a normal bottom margin — more just reads as dead colour.
            'w-full flex flex-col gap-10 lg:gap-8 bg-white lg:bg-docduit-lightblue px-8 py-8 pb-24 lg:py-24 lg:pb-16 lg:px-20 items-center justify-between lg:overflow-y-auto',
            activeState !== 'input' && 'hidden lg:flex',
          )}
        >
          <div className='w-full flex flex-col gap-8 items-center justify-center'>
            {savedPlan && (
              <TwinCheckInCard
                lang={lang}
                vocabularies={vocabularies}
                plan={savedPlan}
                onPlanChanged={setSavedPlan}
                onRestoreInput={handleRestoreSavedInput}
              />
            )}

            <div className='w-full flex flex-col gap-1 text-center'>
              <p className='text-xl font-bold'>{copy.formTitle}</p>
              <p className='text-xs font-light text-black/60'>
                {copy.formHelper}
              </p>
            </div>

            <FieldGroup
              title={groupTitle('Pemasukan & Tabungan', 'Income & savings')}
            >
              {currencyField(
                'monthlyIncome',
                fields.monthlyIncome ??
                  groupTitle('Penghasilan bersih bulanan', 'Monthly net income'),
                'monthlyIncome',
              )}
              {currencyField(
                'currentSavings',
                fields.currentSavings ??
                  groupTitle(
                    'Uang yang sudah ditabung/diinvestasikan',
                    'Current savings & investments',
                  ),
                'currentSavings',
              )}
            </FieldGroup>

            <FieldGroup
              title={groupTitle('Pengeluaran Bulanan', 'Monthly spending')}
            >
              {currencyField(
                'essentialSpending',
                fields.essentialSpending ??
                  groupTitle('Pengeluaran wajib', 'Essential spending'),
                'essentialSpending',
              )}
              {currencyField(
                'lifestyleSpending',
                fields.lifestyleSpending ??
                  groupTitle('Pengeluaran gaya hidup', 'Lifestyle spending'),
                'lifestyleSpending',
              )}
              {currencyField(
                'foodTransportSpending',
                fields.foodTransportSpending ??
                  groupTitle('Makan & transport', 'Food & transport'),
                'foodTransportSpending',
              )}
              {currencyField(
                'otherSpending',
                fields.otherSpending ??
                  groupTitle(
                    'Pengeluaran fleksibel lain',
                    'Other flexible spending',
                  ),
                'otherSpending',
              )}
            </FieldGroup>

            <FieldGroup title={groupTitle('Utang', 'Debt')}>
              {currencyField(
                'debtBalance',
                fields.debtBalance ??
                  groupTitle('Sisa utang / paylater', 'Debt / paylater balance'),
                'debtBalance',
              )}
              {currencyField(
                'monthlyDebtPayment',
                fields.monthlyDebtPayment ??
                  groupTitle(
                    'Pembayaran utang per bulan',
                    'Monthly debt payment',
                  ),
                'monthlyDebtPayment',
              )}
            </FieldGroup>

            <FieldGroup
              title={groupTitle('Target & Asumsi', 'Goal & assumptions')}
            >
              {currencyField(
                'financialGoalAmount',
                fields.goalAmount ?? groupTitle('Target dana', 'Goal amount'),
                'goalAmount',
              )}

              <SliderField
                label={fields.timeHorizon ?? groupTitle('Timeline', 'Timeline')}
                value={input.timeHorizonMonths}
                onChange={setField('timeHorizonMonths')}
                min={SLIDER_RANGE.timeHorizonMonths.min}
                max={SLIDER_RANGE.timeHorizonMonths.max}
                step={SLIDER_RANGE.timeHorizonMonths.step}
                minLabel={`1 ${monthShort}`}
                maxLabel={`120 ${monthsShort}`}
                help={fieldHelp.timeHorizon}
                error={errors.timeHorizonMonths}
                mode='month'
                monthLabel={monthShort}
                monthLabelPlural={monthsShort}
              />

              <SliderField
                label={
                  fields.expectedReturn ??
                  groupTitle(
                    'Asumsi imbal hasil tahunan',
                    'Expected annual return',
                  )
                }
                value={input.expectedAnnualReturn}
                onChange={setField('expectedAnnualReturn')}
                min={SLIDER_RANGE.expectedAnnualReturn.min}
                max={SLIDER_RANGE.expectedAnnualReturn.max}
                step={SLIDER_RANGE.expectedAnnualReturn.step}
                minLabel='0%'
                maxLabel='20%'
                help={fieldHelp.expectedReturn}
                error={errors.expectedAnnualReturn}
                mode='percent'
              />

              <div className='w-full flex flex-col gap-2'>
                <p className='text-lg font-normal'>
                  {fields.riskBehavior ??
                    groupTitle(
                      'Tingkat risiko untuk jalur berisiko',
                      'Risk level for the risky path',
                    )}
                </p>
                <div className='grid grid-cols-3 gap-2'>
                  {(['low', 'medium', 'high'] as RiskBehavior[]).map((level) => (
                    <button
                      key={level}
                      type='button'
                      onClick={() => handleRiskChange(level)}
                      className={cn(
                        'rounded-full border border-black px-3 py-2 text-sm font-semibold transition-colors',
                        input.riskBehavior === level
                          ? 'bg-docduit-blue text-white'
                          : 'bg-white text-docduit-blue hover:bg-docduit-lightgray',
                      )}
                    >
                      {vocabularies?.twinSimulator?.riskLevels?.[level] ??
                        (isId
                          ? level === 'low'
                            ? 'Rendah'
                            : level === 'medium'
                              ? 'Sedang'
                              : 'Tinggi'
                          : level === 'low'
                            ? 'Low'
                            : level === 'medium'
                              ? 'Medium'
                              : 'High')}
                    </button>
                  ))}
                </div>
                {fieldHelp.riskBehavior && (
                  <p className='text-xs font-light text-black/60 text-center'>
                    {fieldHelp.riskBehavior}
                  </p>
                )}
                {errors.riskBehavior && (
                  <p className='text-xs font-medium text-docduit-red text-center'>
                    {errors.riskBehavior}
                  </p>
                )}
              </div>
            </FieldGroup>
          </div>

          <div className='flex flex-col gap-8 items-center w-full'>
            <Button onClick={handleSubmit} size='lg' variant='red'>
              {copy.runButton}
            </Button>
            <DisclaimerNote
              title={copy.disclaimerTitle}
              body={copy.disclaimerBody}
            />
          </div>
        </div>

        {/* ── Results panel ──────────────────────────────────────────── */}
        <div
          ref={resultsPanelRef}
          className={cn(
            'w-full flex-col gap-8 bg-white px-8 py-8 pb-24 lg:py-24 lg:pb-16 lg:px-20 items-center lg:overflow-y-auto',
            activeState === 'results' ? 'flex' : 'hidden',
          )}
        >
          <div className='w-full max-w-xl flex flex-col gap-8 items-center'>
            {actionPlan && insights && submittedInput && (
              <ResultHeadline
                actionPlan={actionPlan}
                improved={insights.scenarioSummaries.improved}
                horizonMonths={submittedInput.timeHorizonMonths}
                improvedLabel={getScenarioLabel('improved')}
                monthShort={monthShort}
                monthsShort={monthsShort}
                vocabularies={vocabularies}
                lang={lang}
              />
            )}

            {/* Three-path comparison */}
            <div className='w-full flex flex-col gap-2'>
              <p className='text-sm text-center'>{copy.summaryTitle}</p>
              {copy.summaryHelper && (
                <p className='text-xs font-light text-black/60 text-center'>
                  {copy.summaryHelper}
                </p>
              )}
              {!results || !insights ? (
                <p className='text-xs font-light text-black/60 text-center'>
                  {noResultText}
                </p>
              ) : (
                <div className='mt-1 overflow-x-auto rounded-2xl border border-black'>
                  <table className='w-full border-collapse text-xs'>
                    <thead>
                      <tr className='bg-docduit-lightblue'>
                        <th className='py-2.5 pl-4 pr-2 text-left font-semibold'>
                          {isId ? 'Jalur' : 'Path'}
                        </th>
                        <th className='px-2 py-2.5 text-right font-semibold'>
                          {isId ? 'Uang akhir' : 'Final money'}
                        </th>
                        <th className='px-2 py-2.5 text-right font-semibold'>
                          {isId ? 'Target' : 'Goal'}
                        </th>
                        <th className='py-2.5 pl-2 pr-4 text-right font-semibold'>
                          {isId ? 'Dana darurat' : 'Emergency'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['current', 'improved', 'risky'] as const).map((key) => {
                        const summary = insights.scenarioSummaries[key];
                        const isImproved = key === 'improved';
                        return (
                          <tr key={key} className='border-t border-black/10'>
                            <td className='py-3 pl-4 pr-2'>
                              <span className='inline-flex items-center gap-2'>
                                <span
                                  className='h-2.5 w-2.5 shrink-0 rounded-full'
                                  style={{ background: SCENARIO_COLORS[key] }}
                                />
                                <span className='font-medium'>
                                  {getScenarioLabel(key)}
                                </span>
                              </span>
                            </td>
                            <td
                              className={cn(
                                'px-2 py-3 text-right tabular-nums',
                                isImproved && 'font-bold',
                              )}
                              style={
                                isImproved
                                  ? { color: SCENARIO_COLORS.improved }
                                  : undefined
                              }
                            >
                              {formatRupiah(summary.finalNetPosition)}
                            </td>
                            <td className='px-2 py-3 text-right tabular-nums'>
                              {formatGoalStatus(
                                summary.goalReached,
                                summary.goalReachedMonth,
                              )}
                            </td>
                            <td className='py-3 pl-2 pr-4 text-right tabular-nums'>
                              {summary.emergencyFundMonths != null
                                ? `${summary.emergencyFundMonths.toFixed(1)} ${isId ? 'bln' : 'mo'}`
                                : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Month-by-month projection */}
            <div className='w-full flex flex-col gap-2'>
              <p className='text-sm text-center'>{copy.chartTitle}</p>
              {copy.chartHelper && (
                <p className='text-xs font-light text-black/60 text-center'>
                  {copy.chartHelper}
                </p>
              )}
              {results && chartData.length > 0 ? (
                <ChartContainer
                  config={{
                    current: {
                      label: getScenarioLabel('current'),
                      color: SCENARIO_COLORS.current,
                    },
                    improved: {
                      label: getScenarioLabel('improved'),
                      color: SCENARIO_COLORS.improved,
                    },
                    risky: {
                      label: getScenarioLabel('risky'),
                      color: SCENARIO_COLORS.risky,
                    },
                  }}
                  className='w-full'
                >
                  <LineChart
                    data={chartData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='month'
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        isId ? `${v / 1_000_000}jt` : `${v / 1_000_000}m`
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) =>
                            `${isId ? 'Bulan' : 'Month'} ${value}`
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
                    {submittedInput && (
                      <ReferenceLine
                        y={submittedInput.financialGoalAmount}
                        stroke='#fec525'
                        strokeDasharray='4 4'
                        strokeWidth={2}
                        label={{
                          value: isId ? 'target' : 'goal',
                          position: 'insideTopRight',
                          fontSize: 10,
                        }}
                      />
                    )}
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {/* Supporting paths are muted; the "improved" path is
                        drawn last and heavier so it reads as the answer. */}
                    <Line
                      type='monotone'
                      dataKey='current'
                      name={getScenarioLabel('current')}
                      stroke='var(--color-current)'
                      strokeOpacity={0.85}
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      type='monotone'
                      dataKey='risky'
                      name={getScenarioLabel('risky')}
                      stroke='var(--color-risky)'
                      strokeOpacity={0.75}
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      type='monotone'
                      dataKey='improved'
                      name={getScenarioLabel('improved')}
                      stroke='var(--color-improved)'
                      dot={false}
                      strokeWidth={3.5}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <p className='text-xs font-light text-black/60 text-center'>
                  {isId
                    ? 'Grafik akan muncul setelah kamu menjalankan simulasi.'
                    : 'The chart will appear after you run the simulation.'}
                </p>
              )}
            </div>

            <CollapsibleCard
              title={insightsSectionTitle}
              open={openSections.insights ?? false}
              onToggle={() => toggleSection('insights')}
              desktopCollapsible
              className='w-full rounded-2xl border-black shadow-none'
              titleClassName='text-base font-bold text-black'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='rounded-2xl bg-docduit-lightblue p-3'>
                  <p className='text-sm font-semibold'>{bottleneckTitle}</p>
                  <p className='mt-1 text-xs font-light leading-relaxed min-h-[2.5rem]'>
                    {isSubmitted ? biggestBottleneck : '—'}
                  </p>
                </div>
                <div className='rounded-2xl bg-docduit-lightyellow p-3'>
                  <p className='text-sm font-semibold'>{bestActionTitle}</p>
                  <p className='mt-1 text-xs font-light leading-relaxed min-h-[2.5rem]'>
                    {isSubmitted ? bestNextAction : '—'}
                  </p>
                </div>
              </div>
            </CollapsibleCard>

            {isSubmitted && narrativeState !== 'idle' && (
              <NarrativeCard
                narrative={narrative}
                state={narrativeState}
                lang={lang}
                vocabularies={vocabularies}
                open={openSections.narrative ?? false}
                onToggle={() => toggleSection('narrative')}
              />
            )}

            {isSubmitted && actionPlan && results && submittedInput && (
              <ActionPlanCard
                actionPlan={actionPlan}
                submittedInput={submittedInput}
                horizonMonths={results.current.snapshots.length}
                vocabularies={vocabularies}
                lang={lang}
                open={openSections.actionPlan ?? false}
                onToggle={() => toggleSection('actionPlan')}
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

            {isSubmitted && actionPlan && results && insights && submittedInput && (
              <>
                <Button
                  onClick={onDownloadPlan}
                  disabled={downloadLoading}
                  variant='outline'
                  className='gap-2 self-start'
                >
                  <Download size={18} />
                  {isId ? 'Unduh rencana (PNG)' : 'Download plan (PNG)'}
                </Button>
                <DownloadPlanCard
                  id='download-plan-twin'
                  plan={buildTwinDownloadPlan({
                    title: isId ? 'Rencana Keuangan' : 'Financial Plan',
                    input: submittedInput,
                    results,
                    insights,
                    actionPlan,
                    vocabularies,
                    isId,
                  })}
                />
              </>
            )}

            <Button onClick={showInputs} className='lg:hidden' variant='link'>
              {isId ? 'Ubah input' : 'Edit inputs'}
            </Button>

            <DisclaimerNote
              title={copy.disclaimerTitle}
              body={copy.disclaimerBody}
            />
          </div>
        </div>
      </div>
    </ReactQueryProvider>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='w-full flex flex-col gap-6'>
      <p className='text-xs font-semibold uppercase tracking-wide text-docduit-blue'>
        {title}
      </p>
      {children}
    </div>
  );
}

/**
 * One question in the calculator house style: label, yellow slider, the range
 * end labels, and the big blue number that stays typeable for exact amounts.
 */
function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  help,
  error,
  mode = 'currency',
  monthLabel,
  monthLabelPlural,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  help?: string;
  error?: string;
  mode?: 'currency' | 'month' | 'percent';
  monthLabel?: string;
  monthLabelPlural?: string;
}) {
  return (
    <div className='w-full flex flex-col gap-2'>
      <p className='text-lg font-normal'>{label}</p>
      <Slider
        onValueChange={(next) => onChange(next[0])}
        className='bg-docduit-yellow rounded-lg'
        value={[Math.min(Math.max(value, min), max)]}
        min={min}
        max={max}
        step={step}
      />
      <div className='flex justify-between'>
        <p className='text-sm font-light'>{minLabel}</p>
        <p className='text-sm font-light'>{maxLabel}</p>
      </div>
      {mode === 'percent' ? (
        <PercentInput value={value} setValue={onChange} />
      ) : (
        <InputCalculationNumber
          value={value}
          setValue={onChange}
          isMonth={mode === 'month'}
          monthLable={monthLabel}
          monthLabelPlural={monthLabelPlural}
        />
      )}
      {help && (
        <p className='text-xs font-light text-black/60 text-center'>{help}</p>
      )}
      {error && (
        <p className='text-xs font-medium text-docduit-red text-center'>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Percentage twin of `InputCalculationNumber` — same typography, `%` suffix
 * instead of the `Rp` prefix.
 */
function PercentInput({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <Input
      onChange={(e) => setValue(Number(e.target.value.replace(/\D/g, '')))}
      onClick={(e) => e.currentTarget.select()}
      value={`${value}%`}
      className='ring-0 border-0 !bg-transparent text-center !font-semibold !text-4xl text-docduit-blue underline-offset-4 underline decoration-1'
    />
  );
}

function DisclaimerNote({ title, body }: { title: string; body: string }) {
  return (
    <div className='w-full rounded-2xl border border-black bg-docduit-lightyellow p-4'>
      <p className='text-xs font-semibold'>{title}</p>
      <p className='mt-1 text-xs font-light leading-relaxed'>{body}</p>
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
  good: 'bg-docduit-green',
  warning: 'bg-docduit-yellow',
  alert: 'bg-docduit-red',
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

/**
 * The answer, in the calculator result house style: one bold sentence with the
 * key number picked out in blue, then the pill row — what you need to save per
 * month, what your budget leaves, and the gap.
 */
function ResultHeadline({
  actionPlan,
  improved,
  horizonMonths,
  improvedLabel,
  monthShort,
  monthsShort,
  vocabularies,
  lang,
}: {
  actionPlan: ActionPlan;
  improved: { goalReached: boolean; goalReachedMonth: number | null };
  horizonMonths: number;
  improvedLabel: string;
  monthShort: string;
  monthsShort: string;
  vocabularies: any;
  lang: Locale;
}) {
  const isId = lang === 'id';
  const dict = vocabularies?.twinSimulator?.actionPlan ?? {};
  const monthWord = horizonMonths > 1 ? monthsShort : monthShort;

  let headline: React.ReactNode;
  if (actionPlan.alreadyAtGoal) {
    headline = isId ? (
      <>
        Targetmu <span className='text-docduit-blue'>sudah tercapai</span>
      </>
    ) : (
      <>
        Your goal is <span className='text-docduit-blue'>already covered</span>
      </>
    );
  } else if (
    actionPlan.projectedGoalMonth != null &&
    actionPlan.projectedGoalMonth <= horizonMonths
  ) {
    headline = isId ? (
      <>
        Kamu akan mencapai targetmu di{' '}
        <span className='text-docduit-blue'>
          bulan ke-{actionPlan.projectedGoalMonth}
        </span>
      </>
    ) : (
      <>
        You reach your goal in{' '}
        <span className='text-docduit-blue'>
          month {actionPlan.projectedGoalMonth}
        </span>
      </>
    );
  } else {
    headline = isId ? (
      <>
        Targetmu <span className='text-docduit-red'>belum tercapai</span> dalam{' '}
        <span className='text-docduit-blue'>
          {horizonMonths} {monthWord}
        </span>
      </>
    ) : (
      <>
        You <span className='text-docduit-red'>don&apos;t reach</span> your goal
        in{' '}
        <span className='text-docduit-blue'>
          {horizonMonths} {monthWord}
        </span>
      </>
    );
  }

  const requiredLabel =
    dict.requiredPerMonth ??
    (isId
      ? 'Perlu ditabung per bulan agar target tercapai tepat waktu'
      : 'Needed per month to hit your goal on time');
  const capacityLabel =
    dict.capacityPerMonth ??
    (isId ? 'Sisa anggaranmu per bulan' : 'What your budget leaves per month');

  // With a shortfall we show what is missing; otherwise the same slot shows the
  // room left over, so the pill never reads "you are Rp 0 short".
  const hasGap = actionPlan.savingGap != null;
  const surplus =
    actionPlan.requiredMonthlySaving != null
      ? Math.max(actionPlan.monthlyCapacity - actionPlan.requiredMonthlySaving, 0)
      : Math.max(actionPlan.monthlyCapacity, 0);
  const gapLabel = hasGap
    ? isId
      ? 'Kekurangan per bulan'
      : 'Short each month'
    : isId
      ? 'Sisa setelah target'
      : 'Room left over';

  return (
    <div className='w-full flex flex-col gap-6 items-center'>
      <p className='font-bold text-xl lg:text-3xl text-center'>{headline}</p>

      {improved.goalReached && improved.goalReachedMonth != null && (
        <p className='text-xs font-light text-center'>
          {improvedLabel}:{' '}
          <span
            className='font-semibold'
            style={{ color: SCENARIO_COLORS.improved }}
          >
            {isId
              ? `tercapai di bulan ke-${improved.goalReachedMonth}`
              : `reached in month ${improved.goalReachedMonth}`}
          </span>
        </p>
      )}

      {actionPlan.requiredMonthlySaving != null && (
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-sm text-center'>{requiredLabel} :</p>
          <div className='bg-docduit-lightblue border border-black rounded-full p-2'>
            <p className='font-semibold text-lg text-center'>
              {formatRupiah(actionPlan.requiredMonthlySaving)}
            </p>
          </div>
        </div>
      )}

      <div className='grid grid-cols-2 gap-2 w-full'>
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-sm text-center'>{capacityLabel} :</p>
          <div className='bg-docduit-lightyellow border border-black rounded-full p-2'>
            <p className='font-bold text-center w-full'>
              {formatRupiah(actionPlan.monthlyCapacity)}
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-sm text-center'>{gapLabel} :</p>
          <div
            className={cn(
              'border border-black rounded-full p-2 w-full',
              hasGap ? 'bg-docduit-lightred' : 'bg-docduit-lightblue',
            )}
          >
            <p className='font-bold text-center'>
              {formatRupiah(hasGap ? (actionPlan.savingGap as number) : surplus)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NarrativeCard({
  narrative,
  state,
  lang,
  vocabularies,
  open,
  onToggle,
}: {
  narrative: TwinNarrative | null;
  state: 'loading' | 'done' | 'error';
  lang: Locale;
  vocabularies: any;
  open: boolean;
  onToggle: () => void;
}) {
  const dict = vocabularies?.twinSimulator?.narrative ?? {};
  const isId = lang === 'id';
  const t = (key: string, fallbackId: string, fallbackEn: string): string =>
    typeof dict?.[key] === 'string' ? dict[key] : isId ? fallbackId : fallbackEn;

  // On error we simply render nothing; the rule-based insights and action plan
  // already cover the user.
  if (state === 'error') return null;

  return (
    <CollapsibleCard
      className='w-full rounded-2xl border-black shadow-none'
      titleClassName='text-base font-bold text-black'
      title={t(
        'title',
        'Bacaan AI dari simulasimu',
        'AI reading of your simulation',
      )}
      accessory={
        <span className='inline-flex items-center rounded-full bg-docduit-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white'>
          {t('badge', 'AI', 'AI')}
        </span>
      }
      open={open}
      onToggle={onToggle}
      desktopCollapsible
      contentClassName='space-y-3'
    >
      {state === 'loading' || !narrative ? (
        <div className='space-y-2' aria-live='polite'>
          <div className='h-3 w-2/3 animate-pulse rounded-full bg-docduit-lightgray' />
          <div className='h-3 w-full animate-pulse rounded-full bg-docduit-lightgray' />
          <div className='h-3 w-5/6 animate-pulse rounded-full bg-docduit-lightgray' />
          <p className='text-xs font-light text-black/60'>
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
            <p className='text-sm font-semibold'>{narrative.headline}</p>
          )}
          <p className='text-xs font-light leading-relaxed'>
            {narrative.summary}
          </p>
          {narrative.bottleneckExplanation && (
            <p className='text-xs font-light leading-relaxed'>
              {narrative.bottleneckExplanation}
            </p>
          )}
          {narrative.recommendedActions.length > 0 && (
            <div>
              <p className='text-xs font-semibold'>
                {t(
                  'actionsTitle',
                  'Langkah yang disarankan AI',
                  'AI-suggested steps',
                )}
              </p>
              <ul className='mt-1 space-y-1'>
                {narrative.recommendedActions.map((action, index) => (
                  <li
                    key={index}
                    className='flex gap-2 text-xs font-light leading-relaxed'
                  >
                    <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-docduit-blue' />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {narrative.encouragement && (
            <p className='text-xs font-medium leading-relaxed'>
              {narrative.encouragement}
            </p>
          )}
          <p className='text-[10px] font-light leading-relaxed text-black/50'>
            {t(
              'disclaimer',
              'Teks ini dibuat oleh AI berdasarkan hasil simulasi dan hanya untuk edukasi — bukan nasihat keuangan berlisensi.',
              'This text is generated by AI from your simulation results and is for education only — not licensed financial advice.',
            )}
          </p>
        </>
      )}
    </CollapsibleCard>
  );
}

function ActionPlanCard({
  actionPlan,
  submittedInput,
  horizonMonths,
  vocabularies,
  lang,
  open,
  onToggle,
}: {
  actionPlan: ActionPlan;
  submittedInput: FinancialTwinInput;
  horizonMonths: number;
  vocabularies: any;
  lang: Locale;
  open: boolean;
  onToggle: () => void;
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

  // English needs "1 month" but "3 months"; Indonesian uses "bulan" either way.
  // The locale strings carry a {monthsWord} slot that this fills.
  const monthsWord = (count: number) =>
    count === 1
      ? (vocabularies?.calculators?.month ?? (isId ? 'bulan' : 'month'))
      : (vocabularies?.calculators?.months ?? (isId ? 'bulan' : 'months'));

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
            'At your current pace, this goal lands at month {month} — {late} {monthsWord} past your timeline.',
          ),
          {
            month: actionPlan.projectedGoalMonth,
            late: actionPlan.projectedGoalMonth - horizonMonths,
            monthsWord: monthsWord(
              actionPlan.projectedGoalMonth - horizonMonths,
            ),
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
          'Goal at month {month} instead of {before} — {saved} {monthsWord} earlier',
        ),
        {
          month: lever.goalMonthAfter,
          before: lever.goalMonthBefore,
          saved: lever.monthsSaved,
          monthsWord: monthsWord(lever.monthsSaved),
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
    <CollapsibleCard
      className='w-full rounded-2xl border-black shadow-none'
      titleClassName='text-base font-bold text-black'
      title={t('title', 'Rencana Aksimu', 'Your Action Plan')}
      open={open}
      onToggle={onToggle}
      contentClassName='space-y-5'
    >
      <p className='text-xs font-light leading-relaxed text-black/60'>
        {t(
          'helper',
          'Dihitung dari angkamu sendiri. Setiap langkah di bawah sudah diukur dampaknya, jadi kamu tahu persis apa yang berubah.',
          'Built from your own numbers. Each step below is quantified so you can see exactly what it changes.',
        )}
      </p>

      <div>
        <p className='text-xs font-semibold mb-2'>
          {t('healthTitle', 'Cek kesehatan singkat', 'Quick health check')}
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
          {healthItems.map((item) => (
            <div
              key={item.label}
              className='rounded-2xl border border-black/10 bg-docduit-lightgray/40 p-3 flex items-center gap-2'
            >
              <span
                className={cn(
                  'h-2.5 w-2.5 shrink-0 rounded-full',
                  HEALTH_DOT_CLASS[item.status],
                )}
              />
              <div className='min-w-0'>
                <p className='text-[11px] font-light text-black/60 truncate'>
                  {item.label}
                </p>
                <p className='text-xs font-semibold'>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-2xl border border-black/10 bg-white p-3 space-y-2'>
        <p className='text-xs font-semibold'>
          {t(
            'targetTitle',
            'Angka yang paling penting',
            'The number that matters',
          )}
        </p>
        {actionPlan.requiredMonthlySaving != null && (
          <div className='flex flex-col gap-1 text-[11px] font-light text-black/60'>
            <p>
              {t(
                'requiredPerMonth',
                'Perlu ditabung per bulan agar target tercapai tepat waktu',
                'Needed per month to hit your goal on time',
              )}
              :{' '}
              <span className='font-semibold text-black'>
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
              <span className='font-semibold text-black'>
                {formatRupiah(actionPlan.monthlyCapacity)}
              </span>
            </p>
          </div>
        )}
        <p className='text-xs font-light leading-relaxed'>{gapMessage}</p>
        {projectionMessage && (
          <p className='text-xs font-medium leading-relaxed text-docduit-red'>
            {projectionMessage}
          </p>
        )}
      </div>

      {actionPlan.levers.length > 0 && (
        <div>
          <p className='text-xs font-semibold'>
            {t(
              'leversTitle',
              'Langkah dengan dampak terbesar',
              'Highest-impact next steps',
            )}
          </p>
          <p className='mt-0.5 text-[11px] font-light leading-relaxed text-black/60'>
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
                className='rounded-2xl border border-black/10 bg-docduit-lightblue/30 p-3 flex gap-3'
              >
                <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-docduit-blue text-[10px] font-semibold text-white'>
                  {index + 1}
                </span>
                <div className='min-w-0'>
                  <p className='text-xs font-semibold'>{leverTitle(lever)}</p>
                  <p
                    className='mt-0.5 text-[11px] font-medium leading-relaxed'
                    style={{ color: SCENARIO_COLORS.improved }}
                  >
                    {leverImpact(lever)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className='rounded-2xl bg-docduit-lightblue p-4 flex flex-col gap-3 items-start'>
        <div>
          <p className='text-xs font-semibold'>
            {t(
              'ctaTitle',
              'Mau langkah ini jadi rencana lengkap?',
              'Want this turned into a full plan?',
            )}
          </p>
          <p className='mt-0.5 text-[11px] font-light leading-relaxed'>
            {t(
              'ctaBody',
              'Diskusikan langkah-langkah ini dengan konsultasi AI Docduit dan dapatkan resep keuangan yang dipersonalisasi.',
              'Discuss these steps with the Docduit AI consultation and get a personalized financial prescription.',
            )}
          </p>
        </div>
        <Button asChild size='sm' variant='blue' className='shrink-0'>
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
    </CollapsibleCard>
  );
}
