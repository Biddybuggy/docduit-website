import { NextRequest, NextResponse } from 'next/server';
import { buildGuardedChatPayload } from '@/lib/security/sanitize-ai-input';
import { chatRequestSchema } from '@/lib/security/schemas/chat';
import { sanitizeErrorForClient } from '@/lib/security/api-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

export const maxDuration = 60;

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

    const { message, userId, history } = parsed.data;
    const guarded = buildGuardedChatPayload(message);

    if (!CF_WORKER_URL) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      );
    }

    const upstreamRes = await fetch(`${CF_WORKER_URL.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        message: guarded.message,
        systemPrompt: guarded.systemGuardrail,
        ...(userId ? { userId } : {}),
        ...(history ? { history } : {}),
        stream: true,
      }),
    });

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: 'AI request failed' },
        { status: upstreamRes.status >= 400 ? upstreamRes.status : 500 },
      );
    }

    if (!upstreamRes.body) {
      return NextResponse.json(
        { error: 'No response body from AI stream' },
        { status: 502 },
      );
    }

    const returnedUserId =
      upstreamRes.headers.get('X-Docduit-User-Id') ?? undefined;

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: {
        'Content-Type':
          upstreamRes.headers.get('content-type') ||
          'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...(returnedUserId ? { 'X-Docduit-User-Id': returnedUserId } : {}),
        'Access-Control-Expose-Headers': 'X-Docduit-User-Id',
      },
    });
  } catch (error) {
    console.error('Demo chat stream API error:', error);
    return NextResponse.json(
      { error: sanitizeErrorForClient(error, 'Failed to get AI response') },
      { status: 500 },
    );
  }
}
