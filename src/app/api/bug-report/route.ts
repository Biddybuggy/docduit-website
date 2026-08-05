import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeErrorForClient } from '@/lib/security/api-response';
import {
  bugReportSchema,
  isAllowedScreenshot,
} from '@/lib/security/schemas/bug-report';
import { buildBugReportEmail } from '@/lib/email/bug-report-template';
import { sendEmail, type SendEmailAttachment } from '@/lib/email/send-email';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const rateLimitRes = await checkRateLimit(request, 'general');
  if (rateLimitRes) return rateLimitRes;

  try {
    const formData = await request.formData();
    const formValues = Object.fromEntries(
      [...formData.entries()].filter(([, value]) => typeof value === 'string'),
    );

    const parsed = bugReportSchema.safeParse(formValues);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid form data' },
        { status: 400 },
      );
    }

    // Honeypot: a filled `website` field means a bot. Pretend success so the
    // bot gets no signal, but send nothing.
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Optional screenshot attachment.
    const attachments: SendEmailAttachment[] = [];
    const screenshot = formData.get('screenshot');
    if (screenshot instanceof File && screenshot.size > 0) {
      if (!isAllowedScreenshot(screenshot)) {
        return NextResponse.json(
          { error: 'Screenshot must be an image up to 3 MB.' },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(await screenshot.arrayBuffer());
      attachments.push({
        filename: screenshot.name || 'screenshot.png',
        content: buffer,
        contentType: screenshot.type || 'image/png',
      });
    }

    // Capture the authenticated email too (reports are allowed anonymously).
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email ?? undefined;

    const recipient = process.env.BUG_REPORT_TO || process.env.SMTP_USER;
    if (!recipient) {
      console.error('Bug report: no recipient configured (BUG_REPORT_TO / SMTP_USER).');
      return NextResponse.json(
        { error: 'Bug reporting is not configured right now.' },
        { status: 500 },
      );
    }

    const email = buildBugReportEmail({
      type: parsed.data.type,
      description: parsed.data.description,
      reporterEmail: parsed.data.email,
      sessionEmail,
      pageUrl: parsed.data.pageUrl,
      locale: parsed.data.locale,
      userAgent: parsed.data.userAgent,
    });

    const result = await sendEmail({
      to: recipient,
      subject: email.subject,
      html: email.html,
      text: email.text,
      attachments: attachments.length ? attachments : undefined,
    });

    if (!result.ok) {
      console.error('Bug report email failed:', result.error);
      return NextResponse.json(
        { error: 'Could not send your report. Please try again later.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Bug report failed:', error);
    return NextResponse.json(
      { error: sanitizeErrorForClient(error, 'Failed to submit report.') },
      { status: 500 },
    );
  }
}
