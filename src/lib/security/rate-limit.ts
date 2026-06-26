import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

let redis: Redis | null = null;
const limiters: Partial<Record<'ai' | 'calculator' | 'general', Ratelimit>> = {};

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

const LIMITS = {
  ai: { requests: 20, window: '1 h' },
  calculator: { requests: 100, window: '1 h' },
  general: { requests: 200, window: '1 h' },
} as const;

function getLimiter(type: keyof typeof LIMITS): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!limiters[type]) {
    limiters[type] = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(
        LIMITS[type].requests,
        LIMITS[type].window,
      ),
      prefix: `docduit:${type}`,
    });
  }
  return limiters[type]!;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '127.0.0.1';
}

export async function checkRateLimit(
  request: NextRequest,
  type: keyof typeof LIMITS = 'general',
): Promise<NextResponse | null> {
  const limiter = getLimiter(type);
  if (!limiter) return null; // Upstash not configured — fail open

  const ip = getClientIp(request);
  let result: Awaited<ReturnType<Ratelimit['limit']>>;
  try {
    result = await limiter.limit(ip);
  } catch {
    console.warn('[rate-limit] Upstash check failed, allowing request');
    return null;
  }

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(retryAfter, 1)),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.reset),
        },
      },
    );
  }

  return null;
}
