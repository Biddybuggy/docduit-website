export type RiskBehavior = 'low' | 'medium' | 'high';

export type FinancialTwinInput = {
  monthlyIncome: number;
  currentSavings: number;
  essentialSpending: number;
  lifestyleSpending: number;
  foodTransportSpending: number;
  otherSpending: number;
  debtBalance: number;
  monthlyDebtPayment: number;
  financialGoalAmount: number;
  timeHorizonMonths: number;
  expectedAnnualReturn: number; // in percentage, e.g. 8 for 8%
  riskBehavior: RiskBehavior;
};

export type ScenarioKey = 'current' | 'improved' | 'risky';

export type ScenarioDefinition = {
  key: ScenarioKey;
  name: string;
};

export type MonthlySnapshot = {
  monthIndex: number;
  monthLabel: string;
  savings: number;
  debt: number;
  netPosition: number;
  goalProgress: number; // 0-1
  emergencyFundMonths: number | null;
};

export type ScenarioResult = {
  scenario: ScenarioDefinition;
  snapshots: MonthlySnapshot[];
  goalReached: boolean;
  goalReachedMonth: number | null; // 0 means already reached at start
  finalSavings: number;
  finalDebt: number;
  finalNetPosition: number;
  finalEmergencyFundMonths: number | null;
};

export type AllScenarioResults = Record<ScenarioKey, ScenarioResult>;

export type BiggestBottleneckKey =
  | 'overspending'
  | 'highDebt'
  | 'shortHorizon'
  | 'lowIncome'
  | 'alreadyAtGoal'
  | 'noSavingsCapacity';

export type BestNextActionKey =
  | 'cutLifestyleSpending'
  | 'buildEmergencyFund'
  | 'focusOnDebt'
  | 'extendHorizon'
  | 'increaseIncome'
  | 'maintainGoodHabits';

export type GeneratedInsights = {
  biggestBottleneck: BiggestBottleneckKey;
  bestNextAction: BestNextActionKey;
  scenarioSummaries: {
    [K in ScenarioKey]: {
      goalReached: boolean;
      goalReachedMonth: number | null;
      finalNetPosition: number;
      finalSavings: number;
      finalDebt: number;
      emergencyFundMonths: number | null;
    };
  };
};

export type ValidationErrors = Partial<
  Record<keyof FinancialTwinInput, string>
> & { _hasError: boolean };

export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function validateInputs(input: FinancialTwinInput): ValidationErrors {
  const errors: ValidationErrors = { _hasError: false };

  const nonNegativeFields: (keyof FinancialTwinInput)[] = [
    'monthlyIncome',
    'currentSavings',
    'essentialSpending',
    'lifestyleSpending',
    'foodTransportSpending',
    'otherSpending',
    'debtBalance',
    'monthlyDebtPayment',
    'financialGoalAmount',
    'timeHorizonMonths',
    'expectedAnnualReturn',
  ];

  for (const key of nonNegativeFields) {
    const raw = input[key];
    if (raw == null || Number.isNaN(raw as number)) {
      errors[key] = 'This field is required.';
      errors._hasError = true;
      continue;
    }
    if (typeof raw === 'number' && raw < 0) {
      errors[key] = 'Value cannot be negative.';
      errors._hasError = true;
    }
  }

  if (input.timeHorizonMonths < 1) {
    errors.timeHorizonMonths = 'Time horizon should be at least 1 month.';
    errors._hasError = true;
  }

  if (input.monthlyIncome === 0) {
    errors.monthlyIncome = 'Monthly income must be greater than 0.';
    errors._hasError = true;
  }

  if (input.financialGoalAmount === 0) {
    errors.financialGoalAmount =
      'Goal amount should be greater than 0 to run the simulation.';
    errors._hasError = true;
  }

  if (!['low', 'medium', 'high'].includes(input.riskBehavior)) {
    errors.riskBehavior = 'Invalid risk behavior.';
    errors._hasError = true;
  }

  return errors;
}

export function buildScenarios(input: FinancialTwinInput): ScenarioDefinition[] {
  const base: ScenarioDefinition[] = [
    { key: 'current', name: 'Current Path' },
    { key: 'improved', name: 'Improved Path' },
    { key: 'risky', name: 'Risky Path' },
  ];

  // Name labels are intentionally generic; the page layer should localize.
  return base;
}

function getMonthlyReturnRate(expectedAnnualReturn: number): number {
  const annual = expectedAnnualReturn / 100;
  if (annual <= 0) return 0;
  return Math.pow(1 + annual, 1 / 12) - 1;
}

function computeEmergencyFundMonths(
  savings: number,
  essentialSpending: number,
): number | null {
  if (essentialSpending <= 0) return null;
  if (savings <= 0) return 0;
  return savings / essentialSpending;
}

function clampToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function runSimulation(
  input: FinancialTwinInput,
  scenario: ScenarioDefinition,
): ScenarioResult {
  const monthlyRate = getMonthlyReturnRate(input.expectedAnnualReturn);

  let savings = input.currentSavings;
  let debt = input.debtBalance;

  const totalBaseSpending =
    input.essentialSpending +
    input.lifestyleSpending +
    input.foodTransportSpending +
    input.otherSpending;

  const baselineLifestyle = input.lifestyleSpending;
  const baselineFoodTransport = input.foodTransportSpending;

  let improvedLifestyle = baselineLifestyle;
  let improvedFoodTransport = baselineFoodTransport;
  let improvedTotalSpending = totalBaseSpending;

  if (scenario.key === 'improved') {
    improvedLifestyle = baselineLifestyle * 0.8;
    improvedFoodTransport = baselineFoodTransport * 0.9;
    improvedTotalSpending =
      input.essentialSpending +
      improvedLifestyle +
      improvedFoodTransport +
      input.otherSpending;
  }

  let riskyLifestyle = baselineLifestyle;
  let riskyFoodTransport = baselineFoodTransport;
  let riskyOther = input.otherSpending;

  if (scenario.key === 'risky') {
    const lifestyleMultiplier =
      input.riskBehavior === 'high'
        ? 1.3
        : input.riskBehavior === 'medium'
          ? 1.15
          : 1.05;
    const otherMultiplier =
      input.riskBehavior === 'high'
        ? 1.25
        : input.riskBehavior === 'medium'
          ? 1.1
          : 1.05;
    riskyLifestyle = baselineLifestyle * lifestyleMultiplier;
    riskyFoodTransport =
      baselineFoodTransport *
      (input.riskBehavior === 'high'
        ? 1.2
        : input.riskBehavior === 'medium'
          ? 1.1
          : 1.05);
    riskyOther = input.otherSpending * otherMultiplier;
  }

  const snapshots: MonthlySnapshot[] = [];
  const emergencyMonth =
    scenario.key === 'risky'
      ? Math.min(
          input.timeHorizonMonths,
          Math.max(1, Math.round(input.timeHorizonMonths * 0.4)),
        )
      : -1;

  const emergencyMultiplier =
    input.riskBehavior === 'high'
      ? 1.5
      : input.riskBehavior === 'medium'
        ? 1
        : 0.5;

  const emergencyAmount = input.monthlyIncome * emergencyMultiplier;

  const alreadyAtGoal = input.currentSavings >= input.financialGoalAmount;
  let goalReached = alreadyAtGoal;
  let goalReachedMonth: number | null = alreadyAtGoal ? 0 : null;

  for (let month = 1; month <= input.timeHorizonMonths; month++) {
    let spending = totalBaseSpending;
    if (scenario.key === 'improved') {
      spending = improvedTotalSpending;
    } else if (scenario.key === 'risky') {
      spending =
        input.essentialSpending + riskyLifestyle + riskyFoodTransport + riskyOther;
    }

    const improvement =
      scenario.key === 'improved' ? totalBaseSpending - improvedTotalSpending : 0;

    let extraDebtPayment = 0;

    if (scenario.key === 'improved' && improvement > 0) {
      if (debt > 0) {
        extraDebtPayment = improvement * 0.6;
      }
    }

    let totalDebtPayment = input.monthlyDebtPayment + extraDebtPayment;
    if (debt <= 0) {
      totalDebtPayment = 0;
    } else if (totalDebtPayment > debt) {
      totalDebtPayment = debt;
    }

    let netCash =
      input.monthlyIncome -
      spending -
      totalDebtPayment;

    // Emergency event on risky path
    if (scenario.key === 'risky' && month === emergencyMonth) {
      if (savings >= emergencyAmount) {
        savings -= emergencyAmount;
      } else {
        const leftover = emergencyAmount - savings;
        savings = 0;
        debt += leftover;
      }
    }

    if (netCash >= 0) {
      savings += netCash;
    } else {
      const deficit = -netCash;
      if (savings >= deficit) {
        savings -= deficit;
      } else {
        const shortfall = deficit - savings;
        savings = 0;
        debt += shortfall;
      }
    }

    if (totalDebtPayment > 0 && debt > 0) {
      debt -= totalDebtPayment;
      if (debt < 0) debt = 0;
    }

    if (monthlyRate > 0 && savings > 0) {
      savings = savings * (1 + monthlyRate);
    }

    savings = clampToTwoDecimals(savings);
    debt = clampToTwoDecimals(debt);

    const netPosition = savings - debt;
    const goalProgress =
      input.financialGoalAmount > 0
        ? Math.min(1, savings / input.financialGoalAmount)
        : 0;

    const emergencyFundMonths = computeEmergencyFundMonths(
      savings,
      input.essentialSpending,
    );

    if (!goalReached && savings >= input.financialGoalAmount) {
      goalReached = true;
      goalReachedMonth = month;
    }

    snapshots.push({
      monthIndex: month,
      monthLabel: `${month}`,
      savings,
      debt,
      netPosition,
      goalProgress,
      emergencyFundMonths:
        emergencyFundMonths != null ? clampToTwoDecimals(emergencyFundMonths) : null,
    });
  }

  const last = snapshots[snapshots.length - 1];

  return {
    scenario,
    snapshots,
    goalReached,
    goalReachedMonth,
    finalSavings: last?.savings ?? savings,
    finalDebt: last?.debt ?? debt,
    finalNetPosition: last?.netPosition ?? savings - debt,
    finalEmergencyFundMonths:
      last?.emergencyFundMonths ??
      computeEmergencyFundMonths(savings, input.essentialSpending),
  };
}

export function runAllScenarios(input: FinancialTwinInput): AllScenarioResults {
  const scenarios = buildScenarios(input);

  const results = scenarios.reduce((acc, scenario) => {
    acc[scenario.key] = runSimulation(input, scenario);
    return acc;
  }, {} as AllScenarioResults);

  return results;
}

export function generateInsights(
  input: FinancialTwinInput,
  results: AllScenarioResults,
): GeneratedInsights {
  const { current, improved, risky } = results;

  const scenarioSummaries = {
    current: {
      goalReached: current.goalReached,
      goalReachedMonth: current.goalReachedMonth,
      finalNetPosition: current.finalNetPosition,
      finalSavings: current.finalSavings,
      finalDebt: current.finalDebt,
      emergencyFundMonths: current.finalEmergencyFundMonths,
    },
    improved: {
      goalReached: improved.goalReached,
      goalReachedMonth: improved.goalReachedMonth,
      finalNetPosition: improved.finalNetPosition,
      finalSavings: improved.finalSavings,
      finalDebt: improved.finalDebt,
      emergencyFundMonths: improved.finalEmergencyFundMonths,
    },
    risky: {
      goalReached: risky.goalReached,
      goalReachedMonth: risky.goalReachedMonth,
      finalNetPosition: risky.finalNetPosition,
      finalSavings: risky.finalSavings,
      finalDebt: risky.finalDebt,
      emergencyFundMonths: risky.finalEmergencyFundMonths,
    },
  } as GeneratedInsights['scenarioSummaries'];

  let biggestBottleneck: BiggestBottleneckKey = 'overspending';
  let bestNextAction: BestNextActionKey = 'cutLifestyleSpending';

  const totalSpending =
    input.essentialSpending +
    input.lifestyleSpending +
    input.foodTransportSpending +
    input.otherSpending +
    input.monthlyDebtPayment;

  const savingsCapacity = input.monthlyIncome - totalSpending;

  if (input.currentSavings >= input.financialGoalAmount && input.financialGoalAmount > 0) {
    biggestBottleneck = 'alreadyAtGoal';
    bestNextAction = 'maintainGoodHabits';
  } else if (savingsCapacity <= 0) {
    biggestBottleneck = 'noSavingsCapacity';
    bestNextAction = input.debtBalance > 0 ? 'focusOnDebt' : 'cutLifestyleSpending';
  } else if (input.debtBalance > input.currentSavings * 2) {
    biggestBottleneck = 'highDebt';
    bestNextAction = 'focusOnDebt';
  } else if (!current.goalReached && improved.goalReached) {
    biggestBottleneck = 'overspending';
    bestNextAction = 'cutLifestyleSpending';
  } else if (
    !current.goalReached &&
    !improved.goalReached &&
    current.finalNetPosition > 0
  ) {
    biggestBottleneck = 'shortHorizon';
    bestNextAction = 'extendHorizon';
  } else if (
    !current.goalReached &&
    !improved.goalReached &&
    current.finalNetPosition <= 0
  ) {
    biggestBottleneck = 'lowIncome';
    bestNextAction = 'increaseIncome';
  } else if (current.goalReached && improved.goalReached) {
    biggestBottleneck = 'overspending';
    bestNextAction = 'buildEmergencyFund';
  }

  return {
    biggestBottleneck,
    bestNextAction,
    scenarioSummaries,
  };
}
