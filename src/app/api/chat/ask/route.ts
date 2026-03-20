import { NextRequest, NextResponse } from 'next/server';

const CF_WORKER_URL = process.env.CHAT_DEMO_CF_WORKER_URL;
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userMessage =
      typeof body.message === 'string' ? body.message.trim() : '';
    const userId =
      typeof body.userId === 'string' && body.userId.trim()
        ? body.userId.trim()
        : undefined;

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!CF_WORKER_URL) {
      console.error('CHAT_DEMO_CF_WORKER_URL is not set');
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 }
      );
    }

    const workerBody: { message: string; userId?: string } = {
      message: userMessage,
    };
    if (userId) workerBody.userId = userId;

    const res = await fetch(`${CF_WORKER_URL.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerBody),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('Cloudflare worker error:', data);
      return NextResponse.json(
        { error: data.error || 'AI request failed' },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    const message = extractMessage(data);
    const returnedUserId = data.userId || userId;

    if (!message) {
      console.warn(
        '[chat/ask] Could not extract message. Full response structure:',
        JSON.stringify(data, null, 2).slice(0, 1500)
      );
    }

    return NextResponse.json({
      message: message || 'No response from AI.',
      userId: returnedUserId,
    });
  } catch (error) {
    console.error('Demo chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}

function extractMessage(data: Record<string, unknown>): string {
  const result = data.result;
  const obj = result && typeof result === 'object' ? (result as Record<string, unknown>) : data;

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
  if (outKey && typeof obj[outKey] === 'string') return (obj[outKey] as string).trim();

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
  if (Array.isArray(outputs) && typeof outputs[0] === 'string') return outputs[0].trim();

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
