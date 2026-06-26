const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{10,}\b/g,
  /\bBearer\s+[A-Za-z0-9._-]+\b/gi,
  /\bGOCSPX-[A-Za-z0-9_-]+\b/g,
  /\bAIzaSy[A-Za-z0-9_-]{10,}\b/g,
  /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["']?[^\s"']+/gi,
];

export function stripSecretsFromText(value: string): string {
  let sanitized = value;
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  return sanitized;
}

export function sanitizeErrorForClient(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = stripSecretsFromText(error.message).slice(0, 500);
  return message || fallback;
}

export function safeJsonResponse<T extends Record<string, unknown>>(
  payload: T,
  init?: ResponseInit,
): Response {
  const serialized = JSON.stringify(payload, (_key, value) => {
    if (typeof value === 'string') {
      return stripSecretsFromText(value);
    }
    return value;
  });

  return new Response(serialized, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
}
