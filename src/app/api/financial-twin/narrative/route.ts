import { NextRequest, NextResponse } from 'next/server';
import {
  generateActionPlan,
  generateInsights,
  runAllScenarios,
} from '@/lib/financial-twin-simulator';
import { generateTwinNarrative } from '@/lib/financial-twin-narrative';
import { financialTwinInputSchema } from '@/lib/security/schemas/financial-twin';
import { sanitizeErrorForClient } from '@/lib/security/api-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Narrative generation hits an LLM, so it shares the stricter 'ai' budget
  // rather than the cheap 'calculator' one used by /simulate.
  const rateLimitRes = await checkRateLimit(request, 'ai');
  if (rateLimitRes) return rateLimitRes;

  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'id';
    const parsed = financialTwinInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid financial twin input',
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // Recompute deterministically on the server so the model only ever explains
    // trusted numbers — never client-supplied projections.
    const results = runAllScenarios(parsed.data);
    const insights = generateInsights(parsed.data, results);
    const actionPlan = generateActionPlan(parsed.data, results);
    const horizonMonths = results.current.snapshots.length;

    const narrative = await generateTwinNarrative(
      parsed.data,
      results,
      insights,
      actionPlan,
      lang,
      horizonMonths,
    );

    // narrative is null when the AI layer is unavailable; the client falls back
    // to the rule-based insights, so this is still a 200.
    return NextResponse.json({ narrative });
  } catch (error) {
    console.error('Financial twin narrative failed:', error);
    return NextResponse.json(
      {
        error: sanitizeErrorForClient(
          error,
          'Failed to generate financial twin narrative',
        ),
      },
      { status: 500 },
    );
  }
}
