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

export const financialTwinInputSchema = z.object({
  monthlyIncome: positiveCurrencyField,
  currentSavings: currencyField,
  essentialSpending: currencyField,
  lifestyleSpending: currencyField,
  foodTransportSpending: currencyField,
  otherSpending: currencyField,
  debtBalance: currencyField,
  monthlyDebtPayment: currencyField,
  financialGoalAmount: positiveCurrencyField,
  timeHorizonMonths: monthField,
  expectedAnnualReturn: z
    .union([z.number(), z.string()])
    .transform((value, ctx) => {
      const parsed = parseSafeFinancialNumber(value, {
        min: 0,
        max: FINANCIAL_LIMITS.maxAnnualReturnPercent,
        allowZero: true,
      });

      if (parsed == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid annual return',
        });
        return z.NEVER;
      }

      return parsed;
    }),
  riskBehavior: z.enum(['low', 'medium', 'high']),
});

export type ValidatedFinancialTwinInput = z.infer<
  typeof financialTwinInputSchema
>;

export function validateFinancialTwinInput(input: unknown) {
  return financialTwinInputSchema.safeParse(input);
}
