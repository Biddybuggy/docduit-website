import { z } from 'zod';
import {
  FINANCIAL_LIMITS,
  parseSafeFinancialNumber,
} from '../financial-numbers';

const currencyField = z
  .union([z.number(), z.string()])
  .transform((value, ctx) => {
    const parsed = parseSafeFinancialNumber(value, {
      min: 0,
      max: FINANCIAL_LIMITS.maxCurrencyAmount,
      allowZero: true,
    });

    if (parsed == null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid amount' });
      return z.NEVER;
    }

    return parsed;
  });

const positiveCurrencyField = currencyField.refine((value) => value > 0, {
  message: 'Value must be greater than 0',
});

const monthField = z
  .union([z.number(), z.string()])
  .transform((value, ctx) => {
    const parsed = parseSafeFinancialNumber(value, {
      min: 1,
      max: FINANCIAL_LIMITS.maxMonths,
      allowZero: false,
      integerOnly: true,
    });

    if (parsed == null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid month value' });
      return z.NEVER;
    }

    return parsed;
  });

const percentField = z
  .union([z.number(), z.string()])
  .transform((value, ctx) => {
    const parsed = parseSafeFinancialNumber(value, {
      min: 0,
      max: FINANCIAL_LIMITS.maxPercent,
      allowZero: true,
    });

    if (parsed == null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid percentage' });
      return z.NEVER;
    }

    return parsed;
  });

export const goalCalculatorSchema = z.object({
  term: monthField,
  price: positiveCurrencyField,
  budget: currencyField,
});

export const vehicleCalculatorSchema = goalCalculatorSchema.extend({
  downPayment: percentField,
});

export const vacationCalculatorSchema = z.object({
  term: monthField,
  price: positiveCurrencyField,
  budget: currencyField,
  destination: z.string().trim().min(1).max(120),
});

export function validateCalculatorInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? 'Invalid calculator input',
    };
  }

  return { success: true, data: result.data };
}
