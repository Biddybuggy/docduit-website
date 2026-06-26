import type { NextConfig } from 'next';

function buildCsp(workerOrigin: string, aiOrigin: string): string {
  const connectSrc = [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://firestore.googleapis.com',
    'https://firebase.googleapis.com',
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    'wss://*.firebaseio.com',
    workerOrigin,
    aiOrigin,
  ]
    .filter(Boolean)
    .join(' ');

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://accounts.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://www.google-analytics.com",
    `connect-src ${connectSrc}`,
    "frame-src https://accounts.google.com",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

function safeOrigin(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async headers() {
    const workerOrigin = safeOrigin(process.env.CHAT_DEMO_CF_WORKER_URL);
    const aiOrigin = safeOrigin(process.env.AI_CHAT_URL);
    const csp = buildCsp(workerOrigin, aiOrigin);

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ];

    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
