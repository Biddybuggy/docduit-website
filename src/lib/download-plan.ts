import { CalculationResultProps } from './interfaces';
import { formatMonth } from './utils';
import {
  ActionPlan,
  AllScenarioResults,
  FinancialTwinInput,
  GeneratedInsights,
  formatRupiah,
} from './financial-twin-simulator';

// A single, source-agnostic representation of a "plan" the user can take away.
// Both the savings calculators and the financial twin simulator populate this
// shape; `DownloadPlanCard` renders it and it is exported as a PNG. All string
// fields are expected to be pre-localized by the builder so the card stays
// dictionary-free.
export type DownloadPlanTone = 'blue' | 'yellow' | 'red' | 'green' | 'neutral';

export type DownloadPlanFigure = {
  label: string;
  value: string; // preformatted, e.g. "Rp 2.500.000"
  tone?: DownloadPlanTone;
};

export type DownloadPlanScheduleRow = {
  label: string; // e.g. "12"
  value: number; // running balance / net position for that month
};

export type DownloadPlan = {
  source: 'calculator' | 'twin';
  title: string;
  subtitle?: string;
  generatedAt?: string; // optional; the card formats "now" when absent
  figures: DownloadPlanFigure[];
  schedule?: DownloadPlanScheduleRow[];
  scheduleLabel?: string; // heading for the schedule section, e.g. "Balance over time"
  notes?: string[];
};

const formatIdr = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

/**
 * Builds a downloadable plan from a savings-calculator result. Mirrors the
 * withDp branching and schedule construction used in
 * `calculator/_components/calculation-result.tsx` so the export matches what the
 * user sees on screen.
 */
export function buildCalculatorDownloadPlan({
  title,
  calculatorType,
  calculation,
  vocabularies,
}: {
  title: string;
  calculatorType: string;
  calculation: CalculationResultProps;
  vocabularies: any; // the `calculators` dictionary slice
}): DownloadPlan {
  const {
    budget,
    minus,
    minusDP,
    monthlyToSave,
    monthlyToSaveDP,
    installment36Month,
    term,
    withDp,
  } = calculation;

  const calcVocab = vocabularies?.[calculatorType] ?? {};
  const result = calcVocab?.result ?? {};
  const amountToSaveLabel = result.amountToSave ?? 'Amount to save each month';
  const budgetLabel = result.yourMoney ?? 'Your budget';
  const minusLabel = result.minus ?? 'Still short';
  const savedMoneyLabel = result.savedMoney ?? 'Balance over time';

  const monthly = withDp
    ? Math.round(monthlyToSaveDP)
    : Math.round(monthlyToSave);
  const budgetValue = withDp ? installment36Month : budget;
  const minusValue = withDp ? minusDP : minus;

  const monthText = formatMonth(term, {
    singular: vocabularies?.month,
    plural: vocabularies?.months,
  });

  const schedule: DownloadPlanScheduleRow[] = Array.from(
    { length: term },
    (_, index) => ({
      label: `${index + 1}`,
      value: (index + 1) * monthly,
    }),
  );

  return {
    source: 'calculator',
    title,
    subtitle: `${amountToSaveLabel}: ${formatIdr(monthly)} · ${term} ${monthText}`,
    figures: [
      { label: amountToSaveLabel, value: formatIdr(monthly), tone: 'blue' },
      { label: budgetLabel, value: formatIdr(budgetValue), tone: 'yellow' },
      { label: minusLabel, value: formatIdr(minusValue), tone: 'red' },
    ],
    scheduleLabel: savedMoneyLabel,
    schedule,
  };
}

/**
 * Builds a downloadable plan from a financial twin simulation. Figures come
 * from the action plan; the schedule traces the "current path" net position,
 * matching the on-screen line chart's `current` series.
 */
export function buildTwinDownloadPlan({
  title,
  results,
  actionPlan,
  vocabularies,
  isId,
}: {
  title: string;
  input: FinancialTwinInput;
  results: AllScenarioResults;
  insights: GeneratedInsights;
  actionPlan: ActionPlan;
  vocabularies: any; // the full dictionary
  isId: boolean;
}): DownloadPlan {
  const dict = vocabularies?.twinSimulator?.actionPlan ?? {};
  const requiredLabel =
    dict.requiredPerMonth ?? (isId ? 'Perlu ditabung / bulan' : 'Required saving / month');
  const capacityLabel =
    dict.capacityPerMonth ?? (isId ? 'Kapasitas / bulan' : 'Monthly capacity');
  const gapLabel = dict.gap ?? (isId ? 'Kekurangan / bulan' : 'Gap / month');
  const surplusLabel = dict.surplus ?? (isId ? 'Sisa / bulan' : 'Surplus / month');
  const goalMonthLabel = isId ? 'Target tercapai (bulan ke-)' : 'Goal reached (month)';

  const figures: DownloadPlanFigure[] = [];

  if (actionPlan.alreadyAtGoal) {
    figures.push({
      label: isId ? 'Status' : 'Status',
      value: isId ? 'Target sudah tercapai' : 'Goal already reached',
      tone: 'green',
    });
  } else if (actionPlan.requiredMonthlySaving != null) {
    figures.push({
      label: requiredLabel,
      value: formatRupiah(actionPlan.requiredMonthlySaving),
      tone: 'blue',
    });
  }

  figures.push({
    label: capacityLabel,
    value: formatRupiah(actionPlan.monthlyCapacity),
    tone: 'yellow',
  });

  const hasGap = actionPlan.savingGap != null && actionPlan.savingGap > 0;
  if (hasGap) {
    figures.push({
      label: gapLabel,
      value: formatRupiah(actionPlan.savingGap as number),
      tone: 'red',
    });
  } else {
    const surplus = actionPlan.monthlyCapacity - (actionPlan.requiredMonthlySaving ?? 0);
    figures.push({
      label: surplusLabel,
      value: formatRupiah(Math.max(0, surplus)),
      tone: 'green',
    });
  }

  if (actionPlan.projectedGoalMonth != null) {
    figures.push({
      label: goalMonthLabel,
      value: `${actionPlan.projectedGoalMonth}`,
      tone: 'neutral',
    });
  }

  const schedule: DownloadPlanScheduleRow[] = results.current.snapshots.map(
    (snapshot) => ({
      label: `${snapshot.monthIndex}`,
      value: Math.round(snapshot.netPosition),
    }),
  );

  return {
    source: 'twin',
    title,
    subtitle: isId
      ? 'Ringkasan rencana keuangan kamu'
      : 'Your financial plan summary',
    figures,
    scheduleLabel: isId
      ? 'Posisi bersih dari waktu ke waktu'
      : 'Net position over time',
    schedule,
  };
}
