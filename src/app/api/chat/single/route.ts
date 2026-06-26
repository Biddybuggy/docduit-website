import { NextRequest, NextResponse } from 'next/server';
import { buildGuardedChatPayload } from '@/lib/security/sanitize-ai-input';
import { singleChatRequestSchema } from '@/lib/security/schemas/chat';
import { sanitizeErrorForClient } from '@/lib/security/api-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const maxDuration = 30;

const AI_CHAT_URL = process.env.AI_CHAT_URL || process.env.NEXT_PUBLIC_AI_CHAT_URL;

export async function POST(request: NextRequest) {
  const rateLimitRes = await checkRateLimit(request, 'ai');
  if (rateLimitRes) return rateLimitRes;
  try {
    const body = await request.json();
    const parsed = singleChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 },
      );
    }

    if (!AI_CHAT_URL) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      );
    }

    const { question, conversation_id } = parsed.data;
    const guarded = buildGuardedChatPayload(question);

    const res = await fetch(`${AI_CHAT_URL.replace(/\/$/, '')}/api/ask-duit`, {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: guarded.message,
        systemPrompt: guarded.systemGuardrail,
        conversation_id: conversation_id ?? null,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: 'AI request failed' },
        { status: res.status >= 400 ? res.status : 500 },
      );
    }

    return NextResponse.json({
      conversation_id: data.conversation_id ?? conversation_id ?? null,
      messages:
        typeof data.messages === 'string'
          ? data.messages
          : typeof data.message === 'string'
            ? data.message
            : 'No response from AI.',
    });
  } catch (error) {
    console.error('Single chat API error:', error);
    return NextResponse.json(
      { error: sanitizeErrorForClient(error, 'Failed to get AI response') },
      { status: 500 },
    );
  }
}
