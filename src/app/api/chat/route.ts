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
        { status: 400 },
      );
    }

    if (!CF_WORKER_URL) {
      console.error('CHAT_DEMO_CF_WORKER_URL is not set');
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      );
    }

    // Proxy the SSE stream from the Cloudflare Worker so the UI can render tokens progressively.
    const upstreamRes = await fetch(
      `${CF_WORKER_URL.replace(/\/$/, '')}/api/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          message: userMessage,
          ...(userId ? { userId } : {}),
          stream: true,
        }),
      },
    );

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text().catch(() => '');
      return NextResponse.json(
        {
          error: 'AI request failed',
          details: errText ? errText.slice(0, 2000) : undefined,
        },
        { status: upstreamRes.status >= 400 ? upstreamRes.status : 500 },
      );
    }

    if (!upstreamRes.body) {
      return NextResponse.json(
        { error: 'No response body from AI stream' },
        { status: 502 },
      );
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: {
        // Preserve SSE headers so browsers treat this as a stream.
        'Content-Type':
          upstreamRes.headers.get('content-type') ||
          'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Demo chat stream API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 },
    );
  }
}

