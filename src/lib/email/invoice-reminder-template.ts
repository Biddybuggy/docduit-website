import type { InvoiceTrackerEntry } from '@/services/firebase.service';

// Builds the subject + HTML for an invoice due-date reminder. Channel-agnostic:
// the same copy can later feed a WhatsApp template. Kept dependency-free so it
// runs anywhere (cron, route, script).

export type ReminderKind = 'dueSoon' | 'dueToday' | 'overdue';

export type ReminderEmail = {
  subject: string;
  html: string;
  text: string;
};

type Lang = 'en' | 'id';

function formatMoney(amount: number | null, currency: string): string {
  if (amount == null) return '';
  const cur = currency || 'IDR';
  try {
    return new Intl.NumberFormat(cur === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: cur === 'IDR' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${cur} ${amount.toLocaleString()}`;
  }
}

function formatDate(dueDate: string, lang: Lang): string {
  const d = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dueDate;
  return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const COPY: Record<
  Lang,
  {
    subject: (kind: ReminderKind, vendor: string) => string;
    heading: (kind: ReminderKind) => string;
    intro: (kind: ReminderKind, dueText: string) => string;
    labels: {
      vendor: string;
      invoice: string;
      amount: string;
      due: string;
      payTo: string;
      bank: string;
      account: string;
    };
    cta: string;
    footer: string;
  }
> = {
  en: {
    subject: (kind, vendor) =>
      kind === 'overdue'
        ? `Overdue: invoice to ${vendor}`
        : kind === 'dueToday'
          ? `Due today: invoice to ${vendor}`
          : `Reminder: invoice to ${vendor} is due soon`,
    heading: (kind) =>
      kind === 'overdue'
        ? 'This invoice is overdue'
        : kind === 'dueToday'
          ? 'This invoice is due today'
          : 'An invoice is due soon',
    intro: (kind, dueText) =>
      kind === 'overdue'
        ? `Heads up — this invoice was due on ${dueText} and is still marked unpaid.`
        : kind === 'dueToday'
          ? `Just a nudge — this invoice is due today (${dueText}).`
          : `Just a nudge so it doesn't slip — this invoice is due on ${dueText}.`,
    labels: {
      vendor: 'Vendor',
      invoice: 'Invoice',
      amount: 'Amount',
      due: 'Due date',
      payTo: 'Pay to',
      bank: 'Bank',
      account: 'Account',
    },
    cta: 'Open your invoice tracker',
    footer:
      'You are receiving this because you added this invoice to your Docduit tracker.',
  },
  id: {
    subject: (kind, vendor) =>
      kind === 'overdue'
        ? `Lewat tempo: tagihan ke ${vendor}`
        : kind === 'dueToday'
          ? `Jatuh tempo hari ini: tagihan ke ${vendor}`
          : `Pengingat: tagihan ke ${vendor} segera jatuh tempo`,
    heading: (kind) =>
      kind === 'overdue'
        ? 'Tagihan ini sudah lewat tempo'
        : kind === 'dueToday'
          ? 'Tagihan ini jatuh tempo hari ini'
          : 'Ada tagihan yang segera jatuh tempo',
    intro: (kind, dueText) =>
      kind === 'overdue'
        ? `Perhatian — tagihan ini jatuh tempo pada ${dueText} dan masih tercatat belum dibayar.`
        : kind === 'dueToday'
          ? `Sekadar mengingatkan — tagihan ini jatuh tempo hari ini (${dueText}).`
          : `Sekadar mengingatkan agar tidak terlewat — tagihan ini jatuh tempo pada ${dueText}.`,
    labels: {
      vendor: 'Vendor',
      invoice: 'No. tagihan',
      amount: 'Jumlah',
      due: 'Jatuh tempo',
      payTo: 'Bayar ke',
      bank: 'Bank',
      account: 'Rekening',
    },
    cta: 'Buka pelacak tagihan',
    footer:
      'Kamu menerima email ini karena menambahkan tagihan ini ke pelacak Docduit.',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildInvoiceReminderEmail(
  entry: InvoiceTrackerEntry,
  kind: ReminderKind,
  opts: { lang?: Lang; trackerUrl?: string } = {},
): ReminderEmail {
  const lang: Lang = opts.lang === 'en' ? 'en' : 'id';
  const t = COPY[lang];
  const vendor = entry.vendor || (lang === 'id' ? 'vendor' : 'the vendor');
  const dueText = formatDate(entry.dueDate, lang);
  const money = formatMoney(entry.amount, entry.currency);
  const pd = entry.paymentDetails;

  const rows: Array<[string, string]> = [
    [t.labels.vendor, vendor],
    [t.labels.invoice, entry.invoiceNumber],
    ...(money ? [[t.labels.amount, money] as [string, string]] : []),
    [t.labels.due, dueText],
    ...(pd?.payee ? [[t.labels.payTo, pd.payee] as [string, string]] : []),
    ...(pd?.bankName ? [[t.labels.bank, pd.bankName] as [string, string]] : []),
    ...(pd?.bankAccountNumber
      ? [[t.labels.account, pd.bankAccountNumber] as [string, string]]
      : []),
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:#607086;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#16243d;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');

  const accent = kind === 'overdue' ? '#e11d48' : '#1d4ed8';
  const trackerUrl = opts.trackerUrl || '';

  const html = `<!doctype html>
<html lang="${lang}">
  <body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;padding:24px 16px;">
      <div style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6ebef;">
        <div style="height:4px;background:${accent};"></div>
        <div style="padding:24px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${accent};font-weight:700;">Docduit</p>
          <h1 style="margin:0 0 8px;font-size:20px;color:#16243d;">${escapeHtml(t.heading(kind))}</h1>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:#526173;">${escapeHtml(t.intro(kind, dueText))}</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rowsHtml}</table>
          ${
            trackerUrl
              ? `<a href="${escapeHtml(trackerUrl)}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:9999px;">${escapeHtml(t.cta)}</a>`
              : ''
          }
        </div>
      </div>
      <p style="margin:16px 4px 0;font-size:11px;line-height:1.5;color:#8a97a6;">${escapeHtml(t.footer)}</p>
    </div>
  </body>
</html>`;

  const text = [
    t.heading(kind),
    t.intro(kind, dueText),
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(trackerUrl ? ['', `${t.cta}: ${trackerUrl}`] : []),
  ].join('\n');

  return { subject: t.subject(kind, vendor), html, text };
}
