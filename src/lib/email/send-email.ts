import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

// Provider-agnostic email sender. Today it is backed by Gmail SMTP; to move to
// Resend/SES later, only `createTransport` and the default `from` need to
// change — callers of `sendEmail` stay the same.

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Overrides the default From. Rarely needed. */
  from?: string;
};

export type SendEmailResult = {
  ok: boolean;
  messageId?: string;
  error?: string;
};

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER; // your full Gmail address
const SMTP_PASSWORD = process.env.SMTP_APP_PASSWORD; // 16-char Gmail App Password
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Docduit';

let cachedTransport: Transporter | null = null;

function getTransport(): Transporter | null {
  if (!SMTP_USER || !SMTP_PASSWORD) return null;
  if (cachedTransport) return cachedTransport;

  cachedTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return cachedTransport;
}

function defaultFrom(): string {
  // Gmail ignores an arbitrary From and sends as the authenticated account, so
  // we keep the address equal to SMTP_USER and only customize the display name.
  return `${FROM_NAME} <${SMTP_USER}>`;
}

/**
 * Sends one email. Never throws — returns { ok: false, error } so a batch
 * reminder job can keep going when a single send fails.
 */
export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const transport = getTransport();
  if (!transport) {
    return {
      ok: false,
      error: 'Email is not configured (missing SMTP_USER / SMTP_APP_PASSWORD).',
    };
  }

  try {
    const info = await transport.sendMail({
      from: params.from || defaultFrom(),
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text || stripHtml(params.html),
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}

/**
 * Checks the SMTP credentials/connection without sending. Useful for a health
 * check or a one-off credential test.
 */
export async function verifyEmailTransport(): Promise<SendEmailResult> {
  const transport = getTransport();
  if (!transport) {
    return {
      ok: false,
      error: 'Email is not configured (missing SMTP_USER / SMTP_APP_PASSWORD).',
    };
  }
  try {
    await transport.verify();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'SMTP verification failed',
    };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
