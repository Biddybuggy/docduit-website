// Builds the subject + HTML for a user-submitted bug report. Dependency-free so
// it runs anywhere (route, script). Mirrors the style of
// invoice-reminder-template.ts.

export type BugReportKind = 'bug' | 'idea' | 'other';

export type BugReportEmail = {
  subject: string;
  html: string;
  text: string;
};

export type BuildBugReportEmailParams = {
  type: BugReportKind;
  description: string;
  /** Address the reporter typed into the form (optional). */
  reporterEmail?: string;
  /** Email of the signed-in user, if any (from the server session). */
  sessionEmail?: string;
  pageUrl?: string;
  locale?: string;
  userAgent?: string;
  submittedAt?: Date;
};

const KIND_LABEL: Record<BugReportKind, string> = {
  bug: 'Bug',
  idea: 'Idea',
  other: 'Feedback',
};

const ACCENT: Record<BugReportKind, string> = {
  bug: '#e11d48',
  idea: '#1d4ed8',
  other: '#0f766e',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pathFromUrl(pageUrl?: string): string {
  if (!pageUrl) return '';
  try {
    return new URL(pageUrl).pathname;
  } catch {
    return pageUrl;
  }
}

export function buildBugReportEmail(
  params: BuildBugReportEmailParams,
): BugReportEmail {
  const {
    type,
    description,
    reporterEmail,
    sessionEmail,
    pageUrl,
    locale,
    userAgent,
    submittedAt = new Date(),
  } = params;

  const kindLabel = KIND_LABEL[type];
  const accent = ACCENT[type];
  const path = pathFromUrl(pageUrl);
  const subject = `[Docduit ${kindLabel}]${path ? ` ${path}` : ''}`;

  const rows: Array<[string, string]> = [
    ['Type', kindLabel],
    ...(reporterEmail ? [['Reporter email', reporterEmail] as [string, string]] : []),
    ...(sessionEmail && sessionEmail !== reporterEmail
      ? [['Signed-in as', sessionEmail] as [string, string]]
      : []),
    ...(pageUrl ? [['Page', pageUrl] as [string, string]] : []),
    ...(locale ? [['Locale', locale] as [string, string]] : []),
    ['Submitted', submittedAt.toISOString()],
    ...(userAgent ? [['Browser', userAgent] as [string, string]] : []),
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#607086;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#16243d;font-size:14px;font-weight:600;word-break:break-word;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="${locale === 'en' ? 'en' : 'id'}">
  <body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
      <div style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6ebef;">
        <div style="height:4px;background:${accent};"></div>
        <div style="padding:24px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${accent};font-weight:700;">Docduit &middot; ${escapeHtml(kindLabel)} report</p>
          <h1 style="margin:0 0 16px;font-size:20px;color:#16243d;">New ${escapeHtml(kindLabel.toLowerCase())} report</h1>
          <div style="white-space:pre-wrap;background:#f7f9fb;border:1px solid #e6ebef;border-radius:8px;padding:14px;font-size:14px;line-height:1.5;color:#16243d;margin-bottom:20px;">${escapeHtml(description)}</div>
          <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
        </div>
      </div>
      <p style="margin:16px 4px 0;font-size:11px;line-height:1.5;color:#8a97a6;">Sent automatically from the Docduit "Report a bug" form.</p>
    </div>
  </body>
</html>`;

  const text = [
    `New ${kindLabel} report`,
    '',
    description,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join('\n');

  return { subject, html, text };
}
