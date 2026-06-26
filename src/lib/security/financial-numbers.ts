export const FINANCIAL_LIMITS = {
  maxCurrencyAmount: 1_000_000_000_000, // 1 trillion IDR
  maxMonths: 600, // 50 years
  maxAnnualReturnPercent: 100,
  maxPercent: 100,
} as const;

export function parseSafeFinancialNumber(
  value: unknown,
  options: {
    min?: number;
    max?: number;
    allowZero?: boolean;
    integerOnly?: boolean;
  } = {},
): number | null {
  const {
    min = 0,
    max = FINANCIAL_LIMITS.maxCurrencyAmount,
    allowZero = true,
    integerOnly = false,
  } = options;

  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value.replace(/[^\d.-]/g, ''))
        : NaN;

  if (!Number.isFinite(numeric)) return null;
  if (integerOnly && !Number.isInteger(numeric)) return null;
  if (!allowZero && numeric === 0) return null;
  if (numeric < min || numeric > max) return null;

  return numeric;
}

export function isReasonableFinancialInput(value: number, max = FINANCIAL_LIMITS.maxCurrencyAmount) {
  return Number.isFinite(value) && value >= 0 && value <= max;
}
