import { NextRequest, NextResponse } from 'next/server';
import {
  generateInsights,
  runAllScenarios,
} from '@/lib/financial-twin-simulator';
import { financialTwinInputSchema } from '@/lib/security/schemas/financial-twin';
import { sanitizeErrorForClient } from '@/lib/security/api-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const rateLimitRes = await checkRateLimit(request, 'calculator');
  if (rateLimitRes) return rateLimitRes;
  try {
    const body = await request.json();
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

    const results = runAllScenarios(parsed.data);
    const insights = generateInsights(parsed.data, results);

    return NextResponse.json({ results, insights });
  } catch (error) {
    console.error('Financial twin simulation failed:', error);
    return NextResponse.json(
      {
        error: sanitizeErrorForClient(
          error,
          'Failed to run financial twin simulation',
        ),
      },
      { status: 500 },
    );
  }
}
