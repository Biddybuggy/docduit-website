import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  getFirestoreDb,
  waitForFirebaseUser,
} from '@/services/firebase.service';
import type {
  ActionPlan,
  AllScenarioResults,
  FinancialTwinInput,
  GeneratedInsights,
  RiskBehavior,
} from '@/lib/financial-twin-simulator';

// A signed-in user has at most one active Financial Twin plan, stored at
// users/{firebaseUid}/financialTwinPlans/default (never keyed by email).
// Check-in records live in the checkIns subcollection under that document.
export const TWIN_PLAN_DOC_ID = 'default';
export const TWIN_CHECK_IN_INTERVAL_DAYS = 7;

export type TwinCheckInStatus = 'on_track' | 'something_changed' | 'need_help';

export type FinancialTwinPlanSummary = {
  biggestBottleneck: string;
  bestNextAction: string;
  alreadyAtGoal: boolean;
  goalReachedOnCurrentPath: boolean;
  projectedGoalMonth: number | null;
  requiredMonthlySaving: number | null;
  monthlyCapacity: number;
  savingGap: number | null;
  horizonMonths: number;
  riskBehavior: RiskBehavior;
};

export interface FinancialTwinPlan {
  input: FinancialTwinInput;
  summary: FinancialTwinPlanSummary;
  locale: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastCheckInAt: Date | null;
  nextCheckInAt: Date | null;
}

export const buildFinancialTwinPlanSummary = (
  input: FinancialTwinInput,
  results: AllScenarioResults,
  insights: GeneratedInsights,
  actionPlan: ActionPlan,
): FinancialTwinPlanSummary => ({
  biggestBottleneck: insights.biggestBottleneck,
  bestNextAction: insights.bestNextAction,
  alreadyAtGoal: actionPlan.alreadyAtGoal,
  goalReachedOnCurrentPath: results.current.goalReached,
  projectedGoalMonth: actionPlan.projectedGoalMonth,
  requiredMonthlySaving: actionPlan.requiredMonthlySaving,
  monthlyCapacity: actionPlan.monthlyCapacity,
  savingGap: actionPlan.savingGap,
  horizonMonths: input.timeHorizonMonths,
  riskBehavior: input.riskBehavior,
});

// Buckets a failed plan write into something the UI can give real advice for:
// missing Firestore rules vs. a NextAuth session whose Firebase credential
// sync failed (e.g. expired Google idToken) vs. everything else.
export type TwinPlanErrorKind = 'permission-denied' | 'auth-not-ready' | 'unknown';

export const classifyTwinPlanError = (error: unknown): TwinPlanErrorKind => {
  if ((error as { code?: unknown })?.code === 'permission-denied') {
    return 'permission-denied';
  }
  const message = error instanceof Error ? error.message : '';
  if (
    message.includes('Timed out waiting for Firebase Auth user') ||
    message.includes('Firebase Auth is not available')
  ) {
    return 'auth-not-ready';
  }
  return 'unknown';
};

const getTwinPlanDocRef = async () => {
  const db = getFirestoreDb();
  const firebaseUser = await waitForFirebaseUser();
  const userDoc = doc(db, 'users', firebaseUser.uid);
  return doc(collection(userDoc, 'financialTwinPlans'), TWIN_PLAN_DOC_ID);
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Timestamp) return value.toDate();
  return null;
};

const computeNextCheckInAt = (from: Date): Date =>
  new Date(from.getTime() + TWIN_CHECK_IN_INTERVAL_DAYS * 24 * 60 * 60 * 1000);

export const saveFinancialTwinPlan = async (params: {
  input: FinancialTwinInput;
  summary: FinancialTwinPlanSummary;
  locale: string;
}): Promise<FinancialTwinPlan> => {
  const planRef = await getTwinPlanDocRef();
  const existing = await getDoc(planRef);

  const now = new Date();
  const nextCheckInAt = computeNextCheckInAt(now);
  const createdAt = existing.exists()
    ? (toDate(existing.data().createdAt) ?? now)
    : now;
  const lastCheckInAt = existing.exists()
    ? toDate(existing.data().lastCheckInAt)
    : null;

  await setDoc(
    planRef,
    {
      input: { ...params.input },
      summary: { ...params.summary },
      locale: params.locale,
      active: true,
      createdAt: Timestamp.fromDate(createdAt),
      updatedAt: serverTimestamp(),
      lastCheckInAt: lastCheckInAt ? Timestamp.fromDate(lastCheckInAt) : null,
      nextCheckInAt: Timestamp.fromDate(nextCheckInAt),
    },
    { merge: true },
  );

  return {
    input: params.input,
    summary: params.summary,
    locale: params.locale,
    active: true,
    createdAt,
    updatedAt: now,
    lastCheckInAt,
    nextCheckInAt,
  };
};

export const loadFinancialTwinPlan =
  async (): Promise<FinancialTwinPlan | null> => {
    try {
      const planRef = await getTwinPlanDocRef();
      const snapshot = await getDoc(planRef);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      if (!data.input || typeof data.input !== 'object') return null;

      return {
        input: data.input as FinancialTwinInput,
        summary: (data.summary ?? {}) as FinancialTwinPlanSummary,
        locale: typeof data.locale === 'string' ? data.locale : 'id',
        active: data.active !== false,
        createdAt: toDate(data.createdAt) ?? new Date(),
        updatedAt: toDate(data.updatedAt) ?? new Date(),
        lastCheckInAt: toDate(data.lastCheckInAt),
        nextCheckInAt: toDate(data.nextCheckInAt),
      };
    } catch (error) {
      console.error('Failed to load Financial Twin plan from Firestore:', error);
      return null;
    }
  };

export const isTwinCheckInDue = (
  plan: Pick<FinancialTwinPlan, 'active' | 'nextCheckInAt'>,
  now: Date = new Date(),
): boolean =>
  plan.active &&
  plan.nextCheckInAt != null &&
  plan.nextCheckInAt.getTime() <= now.getTime();

// Writes one check-in record; an on-track answer also advances the plan's
// check-in schedule. "Something changed" resets the schedule via the plan
// re-save that follows resimulation, and "I need help" keeps the check-in due.
export const recordFinancialTwinCheckIn = async (
  status: TwinCheckInStatus,
  locale: string,
): Promise<{ lastCheckInAt: Date | null; nextCheckInAt: Date | null }> => {
  const planRef = await getTwinPlanDocRef();
  const checkInRef = doc(collection(planRef, 'checkIns'));

  const now = new Date();
  await setDoc(checkInRef, {
    status,
    locale,
    createdAt: Timestamp.fromDate(now),
  });

  if (status !== 'on_track') {
    return { lastCheckInAt: null, nextCheckInAt: null };
  }

  const nextCheckInAt = computeNextCheckInAt(now);
  await setDoc(
    planRef,
    {
      lastCheckInAt: Timestamp.fromDate(now),
      nextCheckInAt: Timestamp.fromDate(nextCheckInAt),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { lastCheckInAt: now, nextCheckInAt };
};
