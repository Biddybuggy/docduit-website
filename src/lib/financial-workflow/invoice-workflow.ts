import { createRequire } from 'module';
import mammoth from 'mammoth';

export type InvoiceFields = {
  vendor: string;
  invoiceNumber: string;
  amount: number | null;
  currency: string;
  dueDate: string;
};

export type WorkflowActionStatus = {
  key: 'calendar' | 'email' | 'csv';
  label: string;
  status: 'completed' | 'skipped' | 'failed';
  detail: string;
};

export type GeneratedWorkflowFile = {
  key: 'calendar' | 'csv';
  fileName: string;
  mimeType: string;
  content: string;
};

type WorkflowOptions = {
  lang?: 'id' | 'en';
  financeEmail?: string;
  createCalendarFile?: boolean;
  createCsvExport?: boolean;
  sendEmailNotification?: boolean;
};

const OPENAI_MODEL = process.env.OPENAI_INVOICE_MODEL || 'gpt-4o-mini';
const nodeRequire = createRequire(import.meta.url);

export async function parse_invoice(file: File): Promise<{
  rawText: string;
  fields: InvoiceFields;
}> {
  if (isImageInvoice(file)) {
    const fields = await extractInvoiceFieldsFromImage(file);

    return {
      rawText: `Image invoice: ${file.name}`,
      fields,
    };
  }

  const rawText = await extractInvoiceText(file);
  const fields = await extractInvoiceFields(rawText);

  return {
    rawText,
    fields,
  };
}

export const parseInvoice = parse_invoice;

export async function runInvoiceWorkflow(
  fields: InvoiceFields,
  options: WorkflowOptions,
): Promise<{
  actions: WorkflowActionStatus[];
  files: GeneratedWorkflowFile[];
}> {
  const copy = getWorkflowCopy(options.lang);
  const actions: WorkflowActionStatus[] = [];
  const files: GeneratedWorkflowFile[] = [];

  if (options.createCalendarFile) {
    const calendarFile = createCalendarReminderFile(fields);
    if (calendarFile) {
      files.push(calendarFile);
      actions.push(completed('calendar', copy.calendarGenerated, copy));
    } else {
      actions.push(failed('calendar', copy.noDueDate, copy));
    }
  } else {
    actions.push(skipped('calendar', copy.calendarSkipped, copy));
  }

  if (options.createCsvExport) {
    files.push(createInvoiceCsvFile(fields));
    actions.push(completed('csv', copy.csvGenerated, copy));
  } else {
    actions.push(skipped('csv', copy.csvSkipped, copy));
  }

  if (options.sendEmailNotification) {
    actions.push(await sendFinanceEmail(fields, copy, options.financeEmail));
  } else {
    actions.push(skipped('email', copy.emailSkipped, copy));
  }

  return { actions, files };
}

async function extractInvoiceText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (contentType.includes('pdf') || fileName.endsWith('.pdf')) {
    ensurePdfJsNodeGlobals();
    const { PDFParse } = nodeRequire('pdf-parse') as typeof import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return normalizeWhitespace(result.text);
    } finally {
      await parser.destroy();
    }
  }

  if (
    contentType.includes('wordprocessingml.document') ||
    fileName.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return normalizeWhitespace(result.value);
  }

  if (
    contentType.startsWith('text/') ||
    fileName.endsWith('.txt') ||
    fileName.endsWith('.csv')
  ) {
    return normalizeWhitespace(buffer.toString('utf8'));
  }

  throw new Error(
    'Unsupported invoice file. Upload a PDF, DOCX, TXT, CSV, PNG, or JPG file.',
  );
}

async function extractInvoiceFields(rawText: string): Promise<InvoiceFields> {
  if (!rawText.trim()) {
    throw new Error('No readable text was found in this invoice.');
  }

  const llmFields = await extractWithOpenAI(rawText);
  const fallbackFields = extractWithRules(rawText);
  const merged = {
    vendor: llmFields.vendor || fallbackFields.vendor,
    invoiceNumber: llmFields.invoiceNumber || fallbackFields.invoiceNumber,
    amount: llmFields.amount ?? fallbackFields.amount,
    currency: llmFields.currency || fallbackFields.currency,
    dueDate: llmFields.dueDate || fallbackFields.dueDate,
  };

  return validateInvoiceFields(merged);
}

async function extractWithOpenAI(
  rawText: string,
): Promise<Partial<InvoiceFields>> {
  if (!process.env.OPENAI_API_KEY) {
    return {};
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Extract invoice fields from raw text. Return only JSON with keys: vendor, invoiceNumber, amount, currency, dueDate. dueDate must be YYYY-MM-DD. amount must be a number without currency symbols.',
        },
        {
          role: 'user',
          content: rawText.slice(0, 12000),
        },
      ],
    }),
  });

  if (!response.ok) {
    return {};
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return {};

  try {
    const parsed = JSON.parse(content) as Partial<InvoiceFields>;
    return {
      vendor: asString(parsed.vendor),
      invoiceNumber: asString(parsed.invoiceNumber),
      amount: parseAmount(parsed.amount),
      currency: asString(parsed.currency) || guessCurrency(content),
      dueDate: normalizeDate(asString(parsed.dueDate)),
    };
  } catch {
    return {};
  }
}

async function extractInvoiceFieldsFromImage(
  file: File,
): Promise<InvoiceFields> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'Image invoices require OPENAI_API_KEY because PNG and JPG files need vision extraction.',
    );
  }

  const dataUrl = await fileToDataUrl(file);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Extract invoice fields from an invoice image. Return only JSON with keys: vendor, invoiceNumber, amount, currency, dueDate. dueDate must be YYYY-MM-DD. amount must be a number without currency symbols. Use null for amount if unreadable and empty strings for unknown text fields.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the invoice fields from this image.',
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      body || `OpenAI image extraction returned ${response.status}`,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI did not return invoice fields for this image.');
  }

  try {
    const parsed = JSON.parse(content) as Partial<InvoiceFields>;
    return validateInvoiceFields({
      vendor: asString(parsed.vendor),
      invoiceNumber: asString(parsed.invoiceNumber),
      amount: parseAmount(parsed.amount),
      currency: asString(parsed.currency) || guessCurrency(content),
      dueDate: normalizeDate(asString(parsed.dueDate)),
    });
  } catch {
    throw new Error('OpenAI returned an invalid invoice extraction response.');
  }
}

function extractWithRules(rawText: string): Partial<InvoiceFields> {
  const lines = rawText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const invoiceNumber =
    findMatch(
      rawText,
      /invoice\s*(?:number|no\.?|#)\s*[:#-]?\s*([A-Z0-9-]+)/i,
    ) || findMatch(rawText, /\binv\s*[:#-]?\s*([A-Z0-9-]+)/i);

  const dueDate =
    normalizeDate(
      findMatch(rawText, /due\s*date\s*[:#-]?\s*([A-Za-z0-9,\-/ ]{6,30})/i),
    ) ||
    normalizeDate(
      findMatch(rawText, /payment\s*due\s*[:#-]?\s*([A-Za-z0-9,\-/ ]{6,30})/i),
    );

  const amountText =
    findMatch(
      rawText,
      /(?:total\s*amount|amount\s*due|balance\s*due|total)\s*[:#-]?\s*([A-Z]{3})?\s*\$?\s*([\d,]+(?:\.\d{2})?)/i,
    ) || findMatch(rawText, /\b([A-Z]{3})?\s*\$?\s*([\d,]+(?:\.\d{2})?)\b/i);

  return {
    vendor: lines[0] || '',
    invoiceNumber,
    amount: parseAmount(amountText),
    currency: guessCurrency(rawText),
    dueDate,
  };
}

function validateInvoiceFields(fields: Partial<InvoiceFields>): InvoiceFields {
  const dueDate = normalizeDate(fields.dueDate);

  return {
    vendor: asString(fields.vendor) || 'Unknown vendor',
    invoiceNumber: asString(fields.invoiceNumber) || 'Unknown invoice',
    amount: parseAmount(fields.amount),
    currency: asString(fields.currency) || 'USD',
    dueDate: dueDate || '',
  };
}

function createCalendarReminderFile(
  fields: InvoiceFields,
): GeneratedWorkflowFile | null {
  if (!fields.dueDate) return null;

  const now = formatIcsDateTime(new Date());
  const eventStart = fields.dueDate.replace(/-/g, '');
  const eventEnd = addDays(fields.dueDate, 1).replace(/-/g, '');
  const uid = `${fields.invoiceNumber}-${fields.dueDate}@docduit`;
  const summary = `Pay invoice to ${fields.vendor}`;
  const description = `Invoice ${fields.invoiceNumber} for ${formatMoney(fields)}.`;

  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Docduit//Financial Workflow Automator//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeIcs(uid)}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${eventStart}`,
    `DTEND;VALUE=DATE:${eventEnd}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P2D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs(summary)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return {
    key: 'calendar',
    fileName: safeFileName(`invoice-${fields.invoiceNumber}-reminder.ics`),
    mimeType: 'text/calendar;charset=utf-8',
    content,
  };
}

function createInvoiceCsvFile(fields: InvoiceFields): GeneratedWorkflowFile {
  const headers = [
    'Vendor',
    'Invoice Number',
    'Amount',
    'Currency',
    'Due Date',
  ];
  const row = [
    fields.vendor,
    fields.invoiceNumber,
    fields.amount ?? '',
    fields.currency,
    fields.dueDate,
  ];

  return {
    key: 'csv',
    fileName: safeFileName(`invoice-${fields.invoiceNumber}.csv`),
    mimeType: 'text/csv;charset=utf-8',
    content: [headers, row]
      .map((values) => values.map(csvCell).join(','))
      .join('\n'),
  };
}

async function sendFinanceEmail(
  fields: InvoiceFields,
  copy: WorkflowCopy,
  financeEmail?: string,
): Promise<WorkflowActionStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.FINANCE_FROM_EMAIL || 'Docduit <notifications@docduit.com>';
  const to = financeEmail || process.env.FINANCE_TEAM_EMAIL;

  if (!apiKey) {
    return skipped('email', copy.emailProviderMissing, copy);
  }

  if (!to) {
    return skipped('email', copy.financeEmailMissing, copy);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Invoice ${fields.invoiceNumber} due ${fields.dueDate || 'soon'}`,
        text: [
          `Vendor: ${fields.vendor}`,
          `Invoice number: ${fields.invoiceNumber}`,
          `Amount: ${formatMoney(fields)}`,
          `Due date: ${fields.dueDate || 'Unknown'}`,
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(body || `Email provider returned ${response.status}`);
    }

    return completed('email', copy.emailSent(to), copy);
  } catch (error) {
    return failed('email', getErrorMessage(error), copy);
  }
}

function findMatch(text: string, regex: RegExp) {
  const match = text.match(regex);
  if (!match) return '';
  return (match[2] || match[1] || '').trim();
}

function normalizeWhitespace(value: string) {
  return value
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeDate(value?: string | null) {
  if (!value) return '';
  const cleaned = value.replace(/(?:due|date|payment|on)/gi, '').trim();
  const parsed = new Date(cleaned);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function parseAmount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/[^0-9.-]/g, '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function guessCurrency(text: string) {
  const explicit = text.match(/\b(USD|IDR|SGD|HKD|EUR|GBP|AUD|JPY)\b/i)?.[1];
  if (explicit) return explicit.toUpperCase();
  if (text.includes('Rp')) return 'IDR';
  if (text.includes('$')) return 'USD';
  return 'USD';
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isImageInvoice(file: File) {
  const contentType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return (
    contentType === 'image/png' ||
    contentType === 'image/jpeg' ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg')
  );
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType =
    file.type ||
    (file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');

  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

function addDays(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function formatMoney(fields: InvoiceFields) {
  if (fields.amount === null) return `${fields.currency} unknown amount`;
  return `${fields.currency} ${fields.amount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`;
}

function formatIcsDateTime(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function csvCell(value: string | number | null) {
  const text = value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function ensurePdfJsNodeGlobals() {
  const canvas = nodeRequire('@napi-rs/canvas') as {
    DOMMatrix?: typeof DOMMatrix;
    DOMPoint?: typeof DOMPoint;
    DOMRect?: typeof DOMRect;
    ImageData?: typeof ImageData;
    Path2D?: typeof Path2D;
  };
  const globals = globalThis as typeof globalThis & {
    DOMMatrix?: typeof DOMMatrix;
    DOMPoint?: typeof DOMPoint;
    DOMRect?: typeof DOMRect;
    ImageData?: typeof ImageData;
    Path2D?: typeof Path2D;
  };

  if (!globals.DOMMatrix && canvas.DOMMatrix)
    globals.DOMMatrix = canvas.DOMMatrix;
  if (!globals.DOMPoint && canvas.DOMPoint) globals.DOMPoint = canvas.DOMPoint;
  if (!globals.DOMRect && canvas.DOMRect) globals.DOMRect = canvas.DOMRect;
  if (!globals.ImageData && canvas.ImageData)
    globals.ImageData = canvas.ImageData;
  if (!globals.Path2D && canvas.Path2D) globals.Path2D = canvas.Path2D;
}

function completed(
  key: WorkflowActionStatus['key'],
  detail: string,
  copy: WorkflowCopy,
): WorkflowActionStatus {
  return { key, label: labelFor(key, copy), status: 'completed', detail };
}

function skipped(
  key: WorkflowActionStatus['key'],
  detail: string,
  copy: WorkflowCopy,
): WorkflowActionStatus {
  return { key, label: labelFor(key, copy), status: 'skipped', detail };
}

function failed(
  key: WorkflowActionStatus['key'],
  detail: string,
  copy: WorkflowCopy,
): WorkflowActionStatus {
  return { key, label: labelFor(key, copy), status: 'failed', detail };
}

type WorkflowCopy = ReturnType<typeof getWorkflowCopy>;

function getWorkflowCopy(lang: WorkflowOptions['lang']) {
  if (lang === 'id') {
    return {
      labels: {
        calendar: 'File kalender',
        email: 'Email Docduit',
        csv: 'Ekspor CSV',
      },
      calendarGenerated:
        'File pengingat kalender berhasil dibuat. Unduh file ini lalu buka dengan aplikasi kalender.',
      calendarSkipped: 'File pengingat kalender tidak diminta.',
      noDueDate: 'Tanggal jatuh tempo yang valid tidak ditemukan.',
      csvGenerated: 'Ekspor CSV berhasil dibuat untuk diimpor ke spreadsheet.',
      csvSkipped: 'Ekspor CSV tidak diminta.',
      emailSkipped: 'Notifikasi email keuangan tidak diminta.',
      emailProviderMissing: 'RESEND_API_KEY belum dikonfigurasi.',
      financeEmailMissing: 'FINANCE_TEAM_EMAIL belum dikonfigurasi.',
      emailSent: (to: string) =>
        `Notifikasi keuangan berhasil dikirim ke ${to} dari Docduit.`,
    };
  }

  return {
    labels: {
      calendar: 'Calendar file',
      email: 'Docduit email',
      csv: 'CSV export',
    },
    calendarGenerated:
      'Calendar reminder file generated. Download it and open it with your calendar app.',
    calendarSkipped: 'Calendar reminder file was not requested.',
    noDueDate: 'No valid due date was found.',
    csvGenerated: 'CSV export generated for spreadsheet import.',
    csvSkipped: 'CSV export was not requested.',
    emailSkipped: 'Finance email notification was not requested.',
    emailProviderMissing: 'RESEND_API_KEY is not configured.',
    financeEmailMissing: 'FINANCE_TEAM_EMAIL is not configured.',
    emailSent: (to: string) =>
      `Finance notification sent to ${to} from Docduit.`,
  };
}

function labelFor(key: WorkflowActionStatus['key'], copy: WorkflowCopy) {
  return copy.labels[key];
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Action failed.';
}
