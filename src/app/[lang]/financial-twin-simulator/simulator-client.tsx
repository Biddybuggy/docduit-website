'use client';

import { useMemo, useState } from 'react';
import {
  FinancialTwinInput,
  ValidationErrors,
  AllScenarioResults,
  GeneratedInsights,
  RiskBehavior,
  formatRupiah,
  validateInputs,
  runAllScenarios,
  generateInsights,
} from '@/lib/financial-twin-simulator';
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
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleNumberChange =
    (field: keyof FinancialTwinInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d]/g, '');
      const numeric = raw ? Number(raw) : 0;
      setInput((prev) => ({ ...prev, [field]: numeric }));
    };

  const handleRiskChange = (value: RiskBehavior) => {
    setInput((prev) => ({ ...prev, riskBehavior: value }));
  };

  const handleSubmit = () => {
    const validation = validateInputs(input);
    setErrors(validation);
    if (validation._hasError) {
      return;
    }
    const all = runAllScenarios(input);
    const insight = generateInsights(input, all);
    setResults(all);
    setInsights(insight);
    setIsSubmitted(true);
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

          <section className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5'>
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

          <section className='grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] gap-6 lg:gap-8'>
            <Card className='shadow-sm border-slate-200 rounded-2xl'>
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

            <div className='flex flex-col gap-4'>
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
  const formatted =
    suffix === '%' || suffix
      ? String(value)
      : value
        ? new Intl.NumberFormat('id-ID').format(value)
        : '';

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
