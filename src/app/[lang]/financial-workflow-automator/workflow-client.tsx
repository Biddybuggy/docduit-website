'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import {
  Bell,
  CalendarDays,
  Download,
  FileText,
  Mail,
  Send,
  Sheet,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Locale } from '../_utils/dictionaries';

type InvoiceFields = {
  vendor: string;
  invoiceNumber: string;
  amount: number | null;
  currency: string;
  dueDate: string;
};

type ActionStatus = {
  key: string;
  label: string;
  status: 'completed' | 'skipped' | 'failed';
  detail: string;
};

type WorkflowFile = {
  key: 'calendar' | 'csv';
  fileName: string;
  mimeType: string;
  content: string;
};

type WorkflowResponse = {
  invoice: InvoiceFields;
  actions: ActionStatus[];
  files: WorkflowFile[];
  mode: 'preview' | 'executed';
  rawTextPreview: string;
  error?: string;
};

type Props = {
  lang: Locale;
  userEmail: string;
  vocabularies: any;
};

const actionConfigs = [
  {
    key: 'calendar',
    icon: CalendarDays,
    defaultChecked: true,
  },
  {
    key: 'email',
    icon: Mail,
    defaultChecked: true,
  },
  {
    key: 'csv',
    icon: Sheet,
    defaultChecked: true,
  },
  {
    key: 'slack',
    icon: Bell,
    defaultChecked: false,
  },
] as const;

type ActionKey = (typeof actionConfigs)[number]['key'];

function getCopy(lang: Locale) {
  if (lang === 'id') {
    return {
      title: 'Otomatisasi Alur Keuangan Pintar',
      subtitle:
        'Unggah faktur, periksa hasil ekstraksi, lalu buat file kalender, ekspor CSV, dan notifikasi tanpa izin Google tambahan.',
      signedInTitle: 'Pengguna yang masuk',
      signedInBody:
        'Akun ini hanya dipakai untuk masuk ke Docduit. Pengingat kalender dan data spreadsheet akan dibuat sebagai file yang bisa kamu unduh.',
      intakeTitle: 'Unggah faktur',
      invoiceFile: 'File faktur',
      financeEmail: 'Email keuangan',
      actions: 'Aksi',
      uploadFirst: 'Unggah faktur terlebih dahulu.',
      processing: 'Memproses...',
      preview: 'Pratinjau',
      generate: 'Buat',
      extractedInvoice: 'Data faktur',
      parsedPlaceholder:
        'Data hasil ekstraksi akan muncul di sini setelah pratinjau atau pembuatan file.',
      vendor: 'Vendor',
      invoiceNumber: 'Nomor faktur',
      amount: 'Jumlah',
      dueDate: 'Tanggal jatuh tempo',
      unknown: 'Tidak diketahui',
      workflowStatus: 'Status alur kerja',
      previewStatus:
        'Mode pratinjau mengekstrak dan memvalidasi faktur tanpa menjalankan aksi eksternal.',
      generatedFiles: 'File yang dibuat',
      rawTextPreview: 'Pratinjau teks mentah',
      workflowFailed: 'Alur kerja gagal.',
      statusLabels: {
        completed: 'selesai',
        skipped: 'dilewati',
        failed: 'gagal',
      },
      actionLabels: {
        calendar: {
          label: 'File kalender',
          description:
            'Buat pengingat .ics yang bisa dibuka di aplikasi kalender.',
        },
        email: {
          label: 'Email keuangan',
          description:
            'Kirim dari email Docduit jika penyedia email aplikasi sudah dikonfigurasi.',
        },
        csv: {
          label: 'Ekspor CSV',
          description: 'Buat baris faktur yang siap diimpor ke spreadsheet.',
        },
        slack: {
          label: 'Notifikasi Slack',
          description: 'Kirim pemberitahuan singkat ke kanal keuangan.',
        },
      },
    };
  }

  return {
    title: 'Smart Financial Workflow Automator',
    subtitle:
      'Upload an invoice, review extracted fields, then generate calendar files, CSV exports, and notifications without extra Google permissions.',
    signedInTitle: 'Signed-in user',
    signedInBody:
      'This account is only used to sign in to Docduit. Calendar reminders and spreadsheet data are created as downloadable files.',
    intakeTitle: 'Invoice intake',
    invoiceFile: 'Invoice file',
    financeEmail: 'Finance email',
    actions: 'Actions',
    uploadFirst: 'Upload an invoice first.',
    processing: 'Processing...',
    preview: 'Preview',
    generate: 'Generate',
    extractedInvoice: 'Extracted invoice',
    parsedPlaceholder:
      'Parsed fields will appear here after preview or generation.',
    vendor: 'Vendor',
    invoiceNumber: 'Invoice number',
    amount: 'Amount',
    dueDate: 'Due date',
    unknown: 'Unknown',
    workflowStatus: 'Workflow status',
    previewStatus:
      'Preview mode extracts and validates the invoice without creating external actions.',
    generatedFiles: 'Generated files',
    rawTextPreview: 'Raw text preview',
    workflowFailed: 'Workflow failed.',
    statusLabels: {
      completed: 'completed',
      skipped: 'skipped',
      failed: 'failed',
    },
    actionLabels: {
      calendar: {
        label: 'Calendar file',
        description:
          'Generate an .ics reminder that opens in any calendar app.',
      },
      email: {
        label: 'Email finance',
        description:
          'Send from Docduit email if the app email provider is configured.',
      },
      csv: {
        label: 'CSV export',
        description: 'Generate a spreadsheet-ready invoice row.',
      },
      slack: {
        label: 'Slack alert',
        description: 'Post a concise notice to the finance channel.',
      },
    },
  };
}

export default function FinancialWorkflowAutomatorClient({
  lang,
  userEmail,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [financeEmail, setFinanceEmail] = useState('docduit48@gmail.com');
  const [selectedActions, setSelectedActions] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      actionConfigs.map((action) => [action.key, action.defaultChecked]),
    ),
  );
  const [result, setResult] = useState<WorkflowResponse | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = useMemo(() => getCopy(lang), [lang]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setResult(null);
    setError('');
  };

  const submitWorkflow = async (execute: boolean) => {
    if (!file) {
      setError(copy.uploadFirst);
      return;
    }

    const body = new FormData();
    body.set('file', file);
    body.set('execute', String(execute));
    body.set('financeEmail', financeEmail);
    body.set('lang', lang);
    Object.entries(selectedActions).forEach(([key, value]) => {
      body.set(key, String(value));
    });

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/financial-workflow/invoice', {
        method: 'POST',
        body,
      });
      const data = (await response.json()) as WorkflowResponse;
      if (!response.ok) {
        throw new Error(data.error || copy.workflowFailed);
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.workflowFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='min-h-[calc(100vh-80px)] bg-[#f7faf9] px-5 py-8 lg:px-16 xl:px-24'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6'>
        <section className='grid gap-6 lg:grid-cols-[1fr_360px]'>
          <div className='flex flex-col justify-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-[#16243d] md:text-5xl'>
                {copy.title}
              </h1>
              <p className='mt-3 max-w-2xl text-base text-[#526173] md:text-lg'>
                {copy.subtitle}
              </p>
            </div>
          </div>

          <Card className='rounded-lg border-docduit-blue/10 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-lg'>{copy.signedInTitle}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm text-[#526173]'>
              <p className='font-medium text-[#16243d]'>{userEmail}</p>
              <p>{copy.signedInBody}</p>
            </CardContent>
          </Card>
        </section>

        <section className='grid gap-6 lg:grid-cols-[420px_1fr]'>
          <Card className='rounded-lg border-0 shadow-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-xl'>
                <Upload className='h-5 w-5 text-docduit-red' />
                {copy.intakeTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className='space-y-5'>
                <div className='space-y-2'>
                  <Label htmlFor='invoice-file'>{copy.invoiceFile}</Label>
                  <Input
                    id='invoice-file'
                    type='file'
                    accept='.pdf,.docx,.txt,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv'
                    onChange={handleFileChange}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='finance-email'>{copy.financeEmail}</Label>
                  <Input
                    id='finance-email'
                    type='email'
                    value={financeEmail}
                    onChange={(event) => setFinanceEmail(event.target.value)}
                  />
                </div>

                <div className='space-y-3'>
                  <Label>{copy.actions}</Label>
                  <div className='grid gap-3'>
                    {actionConfigs.map((action) => {
                      const Icon = action.icon;
                      const actionCopy = copy.actionLabels[action.key];
                      return (
                        <label
                          key={action.key}
                          className='flex cursor-pointer items-start gap-3 rounded-lg border border-[#dfe7ea] bg-white p-3'
                        >
                          <input
                            type='checkbox'
                            className='mt-1 h-4 w-4 accent-docduit-blue'
                            checked={selectedActions[action.key]}
                            onChange={(event) =>
                              setSelectedActions((prev) => ({
                                ...prev,
                                [action.key]: event.target.checked,
                              }))
                            }
                          />
                          <Icon className='mt-0.5 h-5 w-5 text-docduit-blue' />
                          <span>
                            <span className='block text-sm font-semibold text-[#16243d]'>
                              {actionCopy.label}
                            </span>
                            <span className='block text-xs text-[#607086]'>
                              {actionCopy.description}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <p className='rounded-md border border-docduit-red/20 bg-docduit-red/10 px-3 py-2 text-sm text-docduit-red'>
                    {error}
                  </p>
                )}

                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Button
                    type='button'
                    variant='blue'
                    disabled={isSubmitting}
                    className='w-full'
                    onClick={() => void submitWorkflow(false)}
                  >
                    <FileText />
                    {isSubmitting ? copy.processing : copy.preview}
                  </Button>
                  <Button
                    type='button'
                    variant='red'
                    disabled={isSubmitting}
                    className='w-full'
                    onClick={() => void submitWorkflow(true)}
                  >
                    <Send />
                    {copy.generate}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card className='rounded-lg border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-xl'>
                  {copy.extractedInvoice}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <Field label={copy.vendor} value={result.invoice.vendor} />
                    <Field
                      label={copy.invoiceNumber}
                      value={result.invoice.invoiceNumber}
                    />
                    <Field
                      label={copy.amount}
                      value={
                        result.invoice.amount === null
                          ? copy.unknown
                          : `${result.invoice.currency} ${result.invoice.amount.toLocaleString()}`
                      }
                    />
                    <Field
                      label={copy.dueDate}
                      value={result.invoice.dueDate || copy.unknown}
                    />
                  </div>
                ) : (
                  <p className='text-sm text-[#607086]'>
                    {copy.parsedPlaceholder}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className='rounded-lg border-0 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-xl'>{copy.workflowStatus}</CardTitle>
              </CardHeader>
              <CardContent>
                {result?.actions.length ? (
                  <div className='grid gap-3'>
                    {result.actions.map((action) => (
                      <div
                        key={action.key}
                        className='rounded-lg border border-[#dfe7ea] bg-white p-3'
                      >
                        <div className='flex items-center justify-between gap-3'>
                          <p className='font-semibold text-[#16243d]'>
                            {action.label}
                          </p>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-xs font-semibold',
                              action.status === 'completed' &&
                                'bg-emerald-100 text-emerald-700',
                              action.status === 'skipped' &&
                                'bg-slate-100 text-slate-600',
                              action.status === 'failed' &&
                                'bg-red-100 text-red-700',
                            )}
                          >
                            {copy.statusLabels[action.status]}
                          </span>
                        </div>
                        <p className='mt-1 text-sm text-[#607086]'>
                          {action.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-[#607086]'>{copy.previewStatus}</p>
                )}
              </CardContent>
            </Card>

            {result?.files.some((file) => file.content) && (
              <Card className='rounded-lg border-0 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-xl'>
                    {copy.generatedFiles}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {result.files
                      .filter((file) => file.content)
                      .map((file) => (
                        <Button
                          key={file.key}
                          type='button'
                          variant='outline'
                          className='justify-start'
                          onClick={() => downloadWorkflowFile(file)}
                        >
                          <Download />
                          {file.fileName}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result?.rawTextPreview && (
              <Card className='rounded-lg border-0 shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-xl'>
                    {copy.rawTextPreview}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className='max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-[#16243d] p-4 text-xs text-white'>
                    {result.rawTextPreview}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function downloadWorkflowFile(file: WorkflowFile) {
  const blob = new Blob([file.content], { type: file.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-lg border border-[#dfe7ea] bg-white p-3'>
      <p className='text-xs font-medium uppercase text-[#607086]'>{label}</p>
      <p className='mt-1 break-words text-base font-semibold text-[#16243d]'>
        {value}
      </p>
    </div>
  );
}
