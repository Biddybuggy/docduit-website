import type {
  ActionPlan,
  AllScenarioResults,
  FinancialTwinInput,
  GeneratedInsights,
} from '@/lib/financial-twin-simulator';

// The narrative layer keeps all financial math deterministic: the numbers below
// are computed by the simulator, and the model only turns them into personalized
// prose. It never produces or recalculates figures.

export type TwinNarrative = {
  headline: string;
  summary: string;
  bottleneckExplanation: string;
  recommendedActions: string[];
  encouragement: string;
};

const OPENAI_MODEL =
  process.env.OPENAI_TWIN_MODEL ||
  process.env.OPENAI_INVOICE_MODEL ||
  'gpt-4o-mini';

const MAX_FIELD_LENGTH = 600;
const MAX_ACTIONS = 5;

function narrativeGuardrail(lang: 'en' | 'id'): string {
  const language =
    lang === 'id'
      ? 'Respond in Bahasa Indonesia.'
      : 'Respond in English. Write the way a person actually talks — contractions are fine, and avoid stiff or formal phrasing.';
  return `You are Docduit, an educational personal finance assistant for Indonesian users.
You are given the results of a deterministic financial simulation. Your job is ONLY to explain
those results in warm, plain, encouraging language — never to recalculate, invent, or contradict
any number you are given.

Rules:
- Use only the numbers provided. Do not compute new projections or make up figures.
- Amounts are in Indonesian Rupiah (IDR). Refer to them as "Rp".
- Do NOT recommend specific financial products, brands, stocks, or providers.
- Keep it educational and general. This is not licensed financial advice.
- Be concise and specific to this person's situation.
- ${language}

Return a single JSON object with exactly these keys:
{
  "headline": string,            // one short sentence, the single most important takeaway
  "summary": string,             // 2-3 sentences comparing the current, improved, and risky paths
  "bottleneckExplanation": string, // 1-2 sentences on what is holding this person back and why
  "recommendedActions": string[],  // 2-4 short, concrete, non-product next steps
  "encouragement": string        // one short motivating sentence
}`;
}

function buildFacts(
  input: FinancialTwinInput,
  results: AllScenarioResults,
  insights: GeneratedInsights,
  actionPlan: ActionPlan,
  horizonMonths: number,
): string {
  const totalSpending =
    input.essentialSpending +
    input.lifestyleSpending +
    input.foodTransportSpending +
    input.otherSpending;

  // A compact, model-friendly snapshot of the trusted, already-computed values.
  const facts = {
    profile: {
      monthlyIncome: input.monthlyIncome,
      totalMonthlySpending: totalSpending,
      spendingBreakdown: {
        essential: input.essentialSpending,
        lifestyle: input.lifestyleSpending,
        foodTransport: input.foodTransportSpending,
        other: input.otherSpending,
      },
      currentSavings: input.currentSavings,
      debtBalance: input.debtBalance,
      monthlyDebtPayment: input.monthlyDebtPayment,
      financialGoalAmount: input.financialGoalAmount,
      timeHorizonMonths: horizonMonths,
      expectedAnnualReturnPercent: input.expectedAnnualReturn,
    },
    scenarioSummaries: insights.scenarioSummaries,
    diagnosis: {
      biggestBottleneck: insights.biggestBottleneck,
      bestNextAction: insights.bestNextAction,
    },
    actionPlan: {
      alreadyAtGoal: actionPlan.alreadyAtGoal,
      monthlyCapacity: actionPlan.monthlyCapacity,
      requiredMonthlySaving: actionPlan.requiredMonthlySaving,
      savingGap: actionPlan.savingGap,
      projectedGoalMonth: actionPlan.projectedGoalMonth,
      health: actionPlan.health,
      levers: actionPlan.levers.map((lever) => ({
        key: lever.key,
        monthlyAmount: lever.monthlyAmount,
        monthsSaved: lever.monthsSaved,
        unlocksGoal: lever.unlocksGoal,
        netPositionDelta: lever.netPositionDelta,
      })),
    },
    finalNetPositions: {
      current: results.current.finalNetPosition,
      improved: results.improved.finalNetPosition,
      risky: results.risky.finalNetPosition,
    },
  };

  return JSON.stringify(facts);
}

function asTrimmedString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function coerceNarrative(raw: unknown): TwinNarrative | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const headline = asTrimmedString(obj.headline);
  const summary = asTrimmedString(obj.summary);
  const bottleneckExplanation = asTrimmedString(obj.bottleneckExplanation);
  const encouragement = asTrimmedString(obj.encouragement);

  const recommendedActions = Array.isArray(obj.recommendedActions)
    ? obj.recommendedActions
        .map(asTrimmedString)
        .filter((item) => item.length > 0)
        .slice(0, MAX_ACTIONS)
    : [];

  // Require the core fields; otherwise fall back to the templated UI.
  if (!summary || recommendedActions.length === 0) return null;

  return {
    headline,
    summary,
    bottleneckExplanation,
    recommendedActions,
    encouragement,
  };
}

/**
 * Turns the deterministic simulation results into a personalized narrative.
 * Returns null when the AI layer is unavailable or fails for any reason, so the
 * caller can fall back to the existing rule-based insights.
 */
export async function generateTwinNarrative(
  input: FinancialTwinInput,
  results: AllScenarioResults,
  insights: GeneratedInsights,
  actionPlan: ActionPlan,
  lang: 'en' | 'id',
  horizonMonths: number,
): Promise<TwinNarrative | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(25_000),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.5,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: narrativeGuardrail(lang) },
          {
            role: 'user',
            content: `[SIMULATION_RESULTS_START]\n${buildFacts(
              input,
              results,
              insights,
              actionPlan,
              horizonMonths,
            )}\n[SIMULATION_RESULTS_END]`,
          },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    return coerceNarrative(JSON.parse(content));
  } catch {
    return null;
  }
}
