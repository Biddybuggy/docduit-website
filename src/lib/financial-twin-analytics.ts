'use client';

import { safeSendGAEvent } from '@/lib/analytics';
import type {
  FinancialTwinInput,
  RiskBehavior,
} from '@/lib/financial-twin-simulator';

// Privacy contract for the Financial Twin funnel:
// - GA is consent-gated (see ConditionalAnalytics); safeSendGAEvent is a no-op
//   until the user accepts cookies.
// - Events must never carry PII (email, name, uid) or exact financial data
//   (salary, savings, debt, goal amounts, chat content). Only the broad,
//   enumerated properties below are allowed; trackFinancialTwinEvent strips
//   anything else defensively.

export type FinancialTwinEventName =
  | 'financial_twin_viewed'
  | 'financial_twin_input_started'
  | 'financial_twin_simulation_completed'
  | 'financial_twin_results_viewed'
  | 'financial_twin_consultation_clicked'
  | 'financial_twin_save_plan_clicked'
  | 'financial_twin_plan_saved'
  | 'financial_twin_checkin_due_viewed'
  | 'financial_twin_checkin_started'
  | 'financial_twin_checkin_completed'
  | 'financial_twin_checkin_status_selected';

export type IncomeBand =
  | 'under_5m'
  | '5m_to_10m'
  | '10m_to_20m'
  | '20m_to_50m'
  | 'over_50m';

export type HorizonBand =
  | 'under_6m'
  | '6m_to_12m'
  | '1y_to_2y'
  | '2y_to_5y'
  | 'over_5y';

export type DeviceType = 'mobile' | 'desktop';

// Enum-only check-in outcome; never free text and never a financial value.
export type CheckInStatusParam = 'on_track' | 'something_changed' | 'need_help';

export type FinancialTwinEventParams = {
  lang?: string;
  entry_point?: string;
  risk_level?: RiskBehavior;
  has_debt?: boolean;
  income_band?: IncomeBand;
  horizon_band?: HorizonBand;
  device_type?: DeviceType;
  checkin_status?: CheckInStatusParam;
};

const ALLOWED_PARAM_KEYS: (keyof FinancialTwinEventParams)[] = [
  'lang',
  'entry_point',
  'risk_level',
  'has_debt',
  'income_band',
  'horizon_band',
  'device_type',
  'checkin_status',
];

export function getIncomeBand(monthlyIncome: number): IncomeBand {
  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 5_000_000) {
    return 'under_5m';
  }
  if (monthlyIncome < 10_000_000) return '5m_to_10m';
  if (monthlyIncome < 20_000_000) return '10m_to_20m';
  if (monthlyIncome < 50_000_000) return '20m_to_50m';
  return 'over_50m';
}

export function getHorizonBand(timeHorizonMonths: number): HorizonBand {
  if (!Number.isFinite(timeHorizonMonths) || timeHorizonMonths < 6) {
    return 'under_6m';
  }
  if (timeHorizonMonths <= 12) return '6m_to_12m';
  if (timeHorizonMonths <= 24) return '1y_to_2y';
  if (timeHorizonMonths <= 60) return '2y_to_5y';
  return 'over_5y';
}

export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  try {
    return window.matchMedia('(max-width: 1023px)').matches
      ? 'mobile'
      : 'desktop';
  } catch {
    return 'desktop';
  }
}

// Derives the standard banded funnel properties from a simulator input.
// Raw amounts never leave this function — only the bands do.
export function buildTwinFunnelParams(
  input: FinancialTwinInput,
  lang: string,
): FinancialTwinEventParams {
  return {
    lang,
    device_type: getDeviceType(),
    risk_level: input.riskBehavior,
    has_debt: input.debtBalance > 0,
    income_band: getIncomeBand(input.monthlyIncome),
    horizon_band: getHorizonBand(input.timeHorizonMonths),
  };
}

export function trackFinancialTwinEvent(
  eventName: FinancialTwinEventName,
  params: FinancialTwinEventParams = {},
): void {
  const safeParams: Record<string, string | boolean> = {};
  for (const key of ALLOWED_PARAM_KEYS) {
    const value = params[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string' && typeof value !== 'boolean') continue;
    safeParams[key] = value;
  }
  safeSendGAEvent('event', eventName, safeParams);
}
