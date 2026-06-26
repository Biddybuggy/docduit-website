import { NextRequest, NextResponse } from 'next/server';
import { buildGuardedChatPayload } from '@/lib/security/sanitize-ai-input';
import { chatRequestSchema } from '@/lib/security/schemas/chat';
import { sanitizeErrorForClient } from '@/lib/security/api-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const maxDuration = 30;

const CF_WORKER_URL = process.env.CHAT_DEMO_CF_WORKER_URL;

export async function POST(request: NextRequest) {
  const rateLimitRes = await checkRateLimit(request, 'ai');
  if (rateLimitRes) return rateLimitRes;
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 },
      );
    }

    const { message, userId } = parsed.data;
    const guarded = buildGuardedChatPayload(message);

    if (!CF_WORKER_URL) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      );
    }

    const workerBody: {
      message: string;
      systemPrompt: string;
      userId?: string;
    } = {
      message: guarded.message,
      systemPrompt: guarded.systemGuardrail,
    };
    if (userId) workerBody.userId = userId;

    const res = await fetch(`${CF_WORKER_URL.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerBody),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: 'AI request failed' },
        { status: res.status >= 400 ? res.status : 500 },
      );
    }

    const extractedMessage = extractMessage(data);
    const returnedUserId = data.userId || userId;

    return NextResponse.json({
      message: extractedMessage || 'No response from AI.',
      userId: returnedUserId,
    });
  } catch (error) {
    console.error('Demo chat API error:', error);
    return NextResponse.json(
      { error: sanitizeErrorForClient(error, 'Failed to get AI response') },
      { status: 500 },
    );
  }
}

function extractMessage(data: Record<string, unknown>): string {
  const result = data.result;
  const obj =
    result && typeof result === 'object'
      ? (result as Record<string, unknown>)
      : data;

  const tryKeys = [
    'out-0',
    'out-1',
    'out-2',
    'output',
    'Output',
    'out',
    'message',
    'text',
    'response',
    'content',
    'raw',
    'answer',
    'generated_text',
  ];
  for (const k of tryKeys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  const outKey = Object.keys(obj).find((k) => k.startsWith('out-'));
  if (outKey && typeof obj[outKey] === 'string')
    return (obj[outKey] as string).trim();

  const outputs = obj.outputs;
  if (outputs && typeof outputs === 'object' && !Array.isArray(outputs)) {
    const outObj = outputs as Record<string, unknown>;
    for (const k of tryKeys) {
      const v = outObj[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    const firstOut = Object.keys(outObj).find((k) => k.startsWith('out-'));
    if (firstOut && typeof outObj[firstOut] === 'string')
      return (outObj[firstOut] as string).trim();
  }
  if (Array.isArray(outputs) && typeof outputs[0] === 'string')
    return outputs[0].trim();

  const findFirstSubstantialString = (o: Record<string, unknown>): string => {
    for (const v of Object.values(o)) {
      if (typeof v === 'string' && v.trim().length > 10) return v.trim();
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const nested = findFirstSubstantialString(v as Record<string, unknown>);
        if (nested) return nested;
      }
    }
    return '';
  };
  return findFirstSubstantialString(obj);
}
