'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  FileText,
  Send,
  Sheet,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  InvoiceTrackerEntry,
  InvoiceTrackerInput,
  InvoiceTrackerProcessingStatus,
  InvoiceTrackerStatus,
  loadInvoiceTrackerEntriesFromFirestore,
  saveInvoiceTrackerEntriesToFirestore,
  updateInvoiceTrackerStatusInFirestore,
} from '@/services/firebase.service';
import { Locale } from '../_utils/dictionaries';

type InvoiceFields = {
  vendor: string;
  invoiceNumber: string;
  amount: number | null;
  currency: string;
  dueDate: string;
  paymentDetails: {
    payee: string;
    bankName: string;
    bankAccountNumber: string;
    instructions: string;
  };
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
  invoice?: InvoiceFields;
  actions?: ActionStatus[];
  files?: WorkflowFile[];
  batchFiles?: WorkflowFile[];
  items: WorkflowItem[];
  mode: 'preview' | 'executed';
  rawTextPreview?: string;
  error?: string;
};

type WorkflowItem = {
  id: string;
  fileName: string;
  invoice?: InvoiceFields;
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
    key: 'csv',
    icon: Sheet,
    defaultChecked: true,
  },
] as const;

function getCopy(lang: Locale) {
  if (lang === 'id') {
    return {
      title: 'Otomatisasi Alur Keuangan Pintar',
      subtitle:
        'Unggah faktur, periksa hasil ekstraksi, lalu buat pengingat kalender dan ekspor data.',
      signedInTitle: 'Pengguna yang masuk',
      signedInBody:
        'Akun ini dipakai untuk menyimpan sesi masukmu. Hasil kalender dan spreadsheet akan dibuat sebagai file yang bisa kamu unduh.',
      intakeTitle: 'Unggah faktur',
      invoiceFile: 'File faktur (maksimal 10)',
      selectedFiles: 'file dipilih',
      actions: 'Aksi',
      uploadFirst: 'Unggah minimal satu faktur terlebih dahulu.',
      uploadLimit: 'Pilih maksimal 10 file faktur.',
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
      paymentDetails: 'Detail pembayaran',
      paymentSummary: 'Ringkasan pembayaran',
      payee: 'Penerima',
      bankName: 'Bank',
      bankAccountNumber: 'Nomor rekening',
      paymentInstructions: 'Instruksi',
      unknown: 'Tidak diketahui',
      workflowStatus: 'Status alur kerja',
      previewStatus:
        'Mode pratinjau mengekstrak dan memvalidasi faktur tanpa menjalankan aksi eksternal.',
      generatedFiles: 'File yang dibuat',
      downloadTrackerCsv: 'Unduh CSV pelacak',
      rawTextPreview: 'Pratinjau teks mentah',
      workflowFailed: 'Alur kerja gagal.',
      invoiceTracker: 'Pelacak faktur',
      trackerEmpty: 'Faktur yang kamu unggah akan muncul di sini.',
      trackerSaved: 'Tersimpan di pelacak faktur.',
      trackerSaveFailed: 'Data faktur diproses, tetapi gagal disimpan.',
      processingTracker: 'Memproses',
      reviewNeeded: 'Perlu ditinjau',
      pending: 'Belum dibayar',
      paid: 'Dibayar',
      markPaid: 'Tandai dibayar',
      markPending: 'Tandai belum dibayar',
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
        csv: {
          label: 'Ekspor CSV',
          description: 'Buat satu file CSV untuk semua faktur yang diunggah.',
        },
      },
    };
  }

  return {
    title: 'Smart Financial Workflow Automator',
    subtitle:
      'Upload an invoice, review extracted fields, then create calendar reminders and export data.',
    signedInTitle: 'Signed-in user',
    signedInBody:
      'This account keeps your Docduit session active. Calendar and spreadsheet outputs are created as downloadable files.',
    intakeTitle: 'Invoice intake',
    invoiceFile: 'Invoice files (up to 10)',
    selectedFiles: 'files selected',
    actions: 'Actions',
    uploadFirst: 'Upload at least one invoice first.',
    uploadLimit: 'Choose up to 10 invoice files.',
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
    paymentDetails: 'Payment details',
    paymentSummary: 'Payment summary',
    payee: 'Payee',
    bankName: 'Bank',
    bankAccountNumber: 'Bank account',
    paymentInstructions: 'Instructions',
    unknown: 'Unknown',
    workflowStatus: 'Workflow status',
    previewStatus:
      'Preview mode extracts and validates the invoice without creating external actions.',
    generatedFiles: 'Generated files',
    downloadTrackerCsv: 'Download tracker CSV',
    rawTextPreview: 'Raw text preview',
    workflowFailed: 'Workflow failed.',
    invoiceTracker: 'Invoice tracker',
    trackerEmpty: 'Uploaded invoices will appear here.',
    trackerSaved: 'Saved to invoice tracker.',
    trackerSaveFailed: 'Invoices were processed, but tracker save failed.',
    processingTracker: 'Processing',
    reviewNeeded: 'Needs review',
    pending: 'Pending',
    paid: 'Paid',
    markPaid: 'Mark paid',
    markPending: 'Mark pending',
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
      csv: {
        label: 'CSV export',
        description: 'Generate one CSV file for all uploaded invoices.',
      },
    },
  };
}

export default function FinancialWorkflowAutomatorClient({
  lang,
  userEmail,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedActions, setSelectedActions] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      actionConfigs.map((action) => [action.key, action.defaultChecked]),
    ),
  );
  const [result, setResult] = useState<WorkflowResponse | null>(null);
  const [error, setError] = useState('');
  const [trackerMessage, setTrackerMessage] = useState('');
  const [trackerEntries, setTrackerEntries] = useState<InvoiceTrackerEntry[]>(
    [],
  );
  const [isTrackerLoading, setIsTrackerLoading] = useState(true);
  const [updatingTrackerId, setUpdatingTrackerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = useMemo(() => getCopy(lang), [lang]);

  useEffect(() => {
    let isMounted = true;

    const loadTracker = async () => {
      setIsTrackerLoading(true);

      const entries = await loadInvoiceTrackerEntriesFromFirestore(userEmail);

      if (isMounted) {
        setTrackerEntries(entries);
        setIsTrackerLoading(false);
      }
    };

    void loadTracker();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 10) {
      setFiles(selectedFiles.slice(0, 10));
      setError(copy.uploadLimit);
    } else {
      setFiles(selectedFiles);
      setError('');
    }

    setResult(null);
    setTrackerMessage('');
  };

  const submitWorkflow = async (execute: boolean) => {
    if (!files.length) {
      setError(copy.uploadFirst);
      return;
    }

    const pendingTrackerInputs = createPendingTrackerInputs(
      files,
      userEmail,
      copy.processingTracker,
    );
    const body = new FormData();

    files.forEach((file) => {
      body.append('files', file);
    });
    body.set(
      'fileIds',
      JSON.stringify(pendingTrackerInputs.map((item) => item.id)),
    );
    body.set('execute', String(execute));
    body.set('lang', lang);
    Object.entries(selectedActions).forEach(([key, value]) => {
      body.set(key, String(value));
    });

    setIsSubmitting(true);
    setError('');
    setTrackerMessage('');
    let receivedInvoiceItems = false;

    try {
      setTrackerEntries((prev) =>
        mergeTrackerEntries(prev, pendingTrackerInputs),
      );

      try {
        await saveInvoiceTrackerEntriesToFirestore(pendingTrackerInputs);
      } catch (trackerError) {
        console.error(
          'Failed to save pending invoice tracker entries:',
          trackerError,
        );
        setTrackerMessage(copy.trackerSaveFailed);
      }

      const response = await fetch('/api/financial-workflow/invoice', {
        method: 'POST',
        body,
      });
      const data = (await response.json()) as WorkflowResponse;
      if (!response.ok) {
        if (data.items?.length) {
          receivedInvoiceItems = true;
          setResult(data);
          const failedTrackerInputs = getTrackerInputs(
            data.items,
            pendingTrackerInputs,
            userEmail,
            copy.reviewNeeded,
          );
          setTrackerEntries((prev) =>
            mergeTrackerEntries(prev, failedTrackerInputs),
          );
          await saveInvoiceTrackerEntriesToFirestore(failedTrackerInputs);
        }

        throw new Error(data.error || copy.workflowFailed);
      }
      receivedInvoiceItems = true;
      setResult(data);

      const trackerInputs = getTrackerInputs(
        data.items,
        pendingTrackerInputs,
        userEmail,
        copy.reviewNeeded,
      );

      if (trackerInputs.length) {
        setTrackerEntries((prev) => mergeTrackerEntries(prev, trackerInputs));

        try {
          await saveInvoiceTrackerEntriesToFirestore(trackerInputs);
          setTrackerMessage(copy.trackerSaved);
        } catch (trackerError) {
          console.error(
            'Failed to save invoice tracker entries:',
            trackerError,
          );
          setTrackerMessage(copy.trackerSaveFailed);
        }
      }
    } catch (err) {
      if (!receivedInvoiceItems) {
        const failedTrackerInputs = pendingTrackerInputs.map((entry) => ({
          ...entry,
          processingStatus: 'failed' as const,
          invoiceNumber:
            entry.processingStatus === 'processing'
              ? copy.reviewNeeded
              : entry.invoiceNumber,
        }));

        setTrackerEntries((prev) =>
          mergeTrackerEntries(prev, failedTrackerInputs),
        );
        saveInvoiceTrackerEntriesToFirestore(failedTrackerInputs).catch(
          (trackerError) => {
            console.error(
              'Failed to save failed invoice tracker entries:',
              trackerError,
            );
          },
        );
      }

      setError(err instanceof Error ? err.message : copy.workflowFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTrackerStatus = async (
    entry: InvoiceTrackerEntry,
    status: InvoiceTrackerStatus,
  ) => {
    setUpdatingTrackerId(entry.id);

    try {
      await updateInvoiceTrackerStatusInFirestore(entry.id, status);
      setTrackerEntries((prev) =>
        prev.map((item) =>
          item.id === entry.id
            ? { ...item, status, updatedAt: new Date() }
            : item,
        ),
      );
    } catch (trackerError) {
      console.error('Failed to update invoice tracker status:', trackerError);
      setTrackerMessage(copy.trackerSaveFailed);
    } finally {
      setUpdatingTrackerId('');
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
                    multiple
                    accept='.pdf,.png,.jpg,.jpeg,.docx,.txt,.csv,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv'
                    onChange={handleFileChange}
                  />
                  {files.length > 0 && (
                    <p className='text-xs text-[#607086]'>
                      {files.length} {copy.selectedFiles}
                    </p>
                  )}
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

                {trackerMessage && (
                  <p className='rounded-md border border-docduit-blue/20 bg-docduit-blue/10 px-3 py-2 text-sm text-docduit-blue'>
                    {trackerMessage}
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
              <CardContent className='space-y-4'>
                {result?.batchFiles?.some((file) => file.content) && (
                  <div className='grid min-w-0 gap-3 sm:grid-cols-2'>
                    {result.batchFiles
                      .filter((file) => file.content)
                      .map((file) => (
                        <Button
                          key={file.fileName}
                          type='button'
                          variant='outline'
                          className='w-full min-w-0 max-w-full justify-start overflow-hidden whitespace-normal'
                          onClick={() => downloadWorkflowFile(file)}
                        >
                          <Download className='shrink-0' />
                          <span className='block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left'>
                            {file.fileName}
                          </span>
                        </Button>
                      ))}
                  </div>
                )}

                {result?.items.length ? (
                  result.items.map((item) => (
                    <InvoiceResultCard key={item.id} item={item} copy={copy} />
                  ))
                ) : (
                  <p className='text-sm text-[#607086]'>
                    {copy.parsedPlaceholder}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className='rounded-lg border-0 shadow-sm'>
              <CardHeader className='gap-3'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <CardTitle className='flex items-center gap-2 text-xl'>
                    <CircleDollarSign className='h-5 w-5 text-docduit-blue' />
                    {copy.invoiceTracker}
                  </CardTitle>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={!trackerEntries.length}
                    className='w-full justify-start sm:w-auto'
                    onClick={() =>
                      downloadWorkflowFile(
                        createTrackerCsvFile(trackerEntries, copy),
                      )
                    }
                  >
                    <Download />
                    {copy.downloadTrackerCsv}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isTrackerLoading ? (
                  <p className='text-sm text-[#607086]'>{copy.processing}</p>
                ) : trackerEntries.length ? (
                  <div className='grid gap-3'>
                    {trackerEntries.map((entry) => (
                      <TrackerEntryCard
                        key={entry.id}
                        entry={entry}
                        copy={copy}
                        isUpdating={updatingTrackerId === entry.id}
                        onUpdateStatus={(status) =>
                          void updateTrackerStatus(entry, status)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-[#607086]'>{copy.trackerEmpty}</p>
                )}
              </CardContent>
            </Card>
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

function createTrackerCsvFile(
  entries: InvoiceTrackerEntry[],
  copy: Copy,
): WorkflowFile {
  const headers = [
    'File Name',
    'Vendor',
    'Invoice Number',
    'Amount',
    'Currency',
    'Due Date',
    'Payment Status',
    'Processing Status',
    'Payment Payee',
    'Bank Name',
    'Bank Account Number',
    'Payment Instructions',
    'Payment Summary',
  ];
  const rows = entries.map((entry) => [
    entry.fileName,
    entry.vendor,
    entry.invoiceNumber,
    entry.amount ?? '',
    entry.currency,
    entry.dueDate,
    entry.status === 'paid' ? copy.paid : copy.pending,
    formatProcessingStatus(entry.processingStatus, copy),
    entry.paymentDetails.payee,
    entry.paymentDetails.bankName,
    entry.paymentDetails.bankAccountNumber,
    entry.paymentDetails.instructions,
    formatPaymentSummary(entry.paymentDetails, copy),
  ]);

  return {
    key: 'csv',
    fileName: `invoice-tracker-${new Date().toISOString().slice(0, 10)}.csv`,
    mimeType: 'text/csv;charset=utf-8',
    content: [headers, ...rows]
      .map((values) => values.map(csvCell).join(','))
      .join('\n'),
  };
}

function csvCell(value: string | number | null) {
  const text = value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

type Copy = ReturnType<typeof getCopy>;

function InvoiceResultCard({ item, copy }: { item: WorkflowItem; copy: Copy }) {
  if (item.error || !item.invoice) {
    return (
      <div className='rounded-lg border border-docduit-red/20 bg-docduit-red/10 p-4'>
        <p className='font-semibold text-docduit-red'>{item.fileName}</p>
        <p className='mt-1 text-sm text-docduit-red'>
          {item.error || copy.workflowFailed}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4 rounded-lg border border-[#dfe7ea] bg-white p-4'>
      <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
        <p className='break-words font-semibold text-[#16243d]'>
          {item.fileName}
        </p>
        <span className='w-fit rounded-full bg-docduit-blue/10 px-2 py-1 text-xs font-semibold text-docduit-blue'>
          {item.mode === 'executed' ? copy.generate : copy.preview}
        </span>
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        <Field label={copy.vendor} value={item.invoice.vendor} />
        <Field label={copy.invoiceNumber} value={item.invoice.invoiceNumber} />
        <Field
          label={copy.amount}
          value={formatInvoiceAmount(item.invoice, copy.unknown)}
        />
        <Field
          label={copy.dueDate}
          value={item.invoice.dueDate || copy.unknown}
        />
      </div>

      <div>
        <p className='mb-2 text-xs font-medium uppercase text-[#607086]'>
          {copy.paymentDetails}
        </p>
        <div className='grid gap-3 sm:grid-cols-2'>
          <Field
            label={copy.payee}
            value={item.invoice.paymentDetails.payee || copy.unknown}
          />
          <Field
            label={copy.bankName}
            value={item.invoice.paymentDetails.bankName || copy.unknown}
          />
          <Field
            label={copy.bankAccountNumber}
            value={
              item.invoice.paymentDetails.bankAccountNumber || copy.unknown
            }
          />
          <Field
            label={copy.paymentInstructions}
            value={item.invoice.paymentDetails.instructions || copy.unknown}
          />
          <Field
            label={copy.paymentSummary}
            value={formatPaymentSummary(item.invoice.paymentDetails, copy)}
            className='sm:col-span-2'
          />
        </div>
      </div>

      <WorkflowStatusList item={item} copy={copy} />

      {item.files.some((file) => file.content) && (
        <div>
          <p className='mb-2 text-xs font-medium uppercase text-[#607086]'>
            {copy.generatedFiles}
          </p>
          <div className='grid min-w-0 gap-3 sm:grid-cols-2'>
            {item.files
              .filter((file) => file.content)
              .map((file) => (
                <Button
                  key={`${item.id}-${file.key}`}
                  type='button'
                  variant='outline'
                  className='w-full min-w-0 max-w-full justify-start overflow-hidden whitespace-normal'
                  onClick={() => downloadWorkflowFile(file)}
                >
                  <Download className='shrink-0' />
                  <span className='block min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left'>
                    {file.fileName}
                  </span>
                </Button>
              ))}
          </div>
        </div>
      )}

      {item.rawTextPreview && (
        <details>
          <summary className='cursor-pointer text-sm font-semibold text-[#16243d]'>
            {copy.rawTextPreview}
          </summary>
          <pre className='mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-[#16243d] p-4 text-xs text-white'>
            {item.rawTextPreview}
          </pre>
        </details>
      )}
    </div>
  );
}

function WorkflowStatusList({
  item,
  copy,
}: {
  item: WorkflowItem;
  copy: Copy;
}) {
  if (!item.actions.length) {
    return <p className='text-sm text-[#607086]'>{copy.previewStatus}</p>;
  }

  return (
    <div>
      <p className='mb-2 text-xs font-medium uppercase text-[#607086]'>
        {copy.workflowStatus}
      </p>
      <div className='grid gap-3'>
        {item.actions.map((action) => (
          <div
            key={`${item.id}-${action.key}`}
            className='rounded-lg border border-[#dfe7ea] bg-[#f8fbfb] p-3'
          >
            <div className='flex items-center justify-between gap-3'>
              <p className='font-semibold text-[#16243d]'>{action.label}</p>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-semibold',
                  action.status === 'completed' &&
                    'bg-emerald-100 text-emerald-700',
                  action.status === 'skipped' && 'bg-slate-100 text-slate-600',
                  action.status === 'failed' && 'bg-red-100 text-red-700',
                )}
              >
                {copy.statusLabels[action.status]}
              </span>
            </div>
            <p className='mt-1 text-sm text-[#607086]'>{action.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackerEntryCard({
  entry,
  copy,
  isUpdating,
  onUpdateStatus,
}: {
  entry: InvoiceTrackerEntry;
  copy: Copy;
  isUpdating: boolean;
  onUpdateStatus: (status: InvoiceTrackerStatus) => void;
}) {
  const nextStatus = entry.status === 'paid' ? 'pending' : 'paid';

  return (
    <div className='rounded-lg border border-[#dfe7ea] bg-white p-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <p className='break-words font-semibold text-[#16243d]'>
            {entry.vendor}
          </p>
          <p className='text-sm text-[#607086]'>
            {entry.invoiceNumber} - {formatInvoiceAmount(entry, copy.unknown)}
          </p>
          <p className='text-sm text-[#607086]'>
            {copy.dueDate}: {entry.dueDate || copy.unknown}
          </p>
        </div>
        <span
          className={cn(
            'flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
            getTrackerBadgeClassName(entry),
          )}
        >
          {entry.status === 'paid' && entry.processingStatus === 'ready' ? (
            <CheckCircle2 className='h-3.5 w-3.5' />
          ) : (
            <Clock3 className='h-3.5 w-3.5' />
          )}
          {getTrackerBadgeLabel(entry, copy)}
        </span>
      </div>

      <div className='mt-3 grid gap-2 text-sm text-[#526173] sm:grid-cols-2'>
        <p>
          {copy.payee}: {entry.paymentDetails.payee || copy.unknown}
        </p>
        <p>
          {copy.bankName}: {entry.paymentDetails.bankName || copy.unknown}
        </p>
        <p>
          {copy.bankAccountNumber}:{' '}
          {entry.paymentDetails.bankAccountNumber || copy.unknown}
        </p>
        <p>
          {copy.paymentInstructions}:{' '}
          {entry.paymentDetails.instructions || copy.unknown}
        </p>
        <p className='sm:col-span-2'>
          {copy.paymentSummary}:{' '}
          {formatPaymentSummary(entry.paymentDetails, copy)}
        </p>
      </div>

      <Button
        type='button'
        variant='outline'
        className='mt-4'
        disabled={isUpdating || entry.processingStatus === 'processing'}
        onClick={() => onUpdateStatus(nextStatus)}
      >
        {entry.status === 'paid' ? copy.markPending : copy.markPaid}
      </Button>
    </div>
  );
}

function getTrackerInputs(
  items: WorkflowItem[],
  pendingItems: InvoiceTrackerInput[],
  userEmail: string,
  reviewNeededLabel: string,
): InvoiceTrackerInput[] {
  const pendingById = new Map(pendingItems.map((item) => [item.id, item]));

  return items.map((item) => {
    if (!item.invoice || item.error) {
      const pendingItem = pendingById.get(item.id);

      return {
        ...(pendingItem ??
          createEmptyTrackerInput(
            item.id,
            item.fileName,
            userEmail,
            reviewNeededLabel,
          )),
        invoiceNumber: reviewNeededLabel,
        processingStatus: 'failed',
      };
    }

    return {
      id: item.id,
      userEmail,
      fileName: item.fileName,
      vendor: item.invoice.vendor,
      invoiceNumber: item.invoice.invoiceNumber,
      amount: item.invoice.amount,
      currency: item.invoice.currency,
      dueDate: item.invoice.dueDate,
      paymentDetails: item.invoice.paymentDetails,
      status: 'pending',
      processingStatus: 'ready',
    };
  });
}

function createPendingTrackerInputs(
  files: File[],
  userEmail: string,
  processingLabel: string,
): InvoiceTrackerInput[] {
  return files.map((file) =>
    createEmptyTrackerInput(
      crypto.randomUUID(),
      file.name,
      userEmail,
      processingLabel,
    ),
  );
}

function createEmptyTrackerInput(
  id: string,
  fileName: string,
  userEmail: string,
  invoiceNumber: string,
): InvoiceTrackerInput {
  return {
    id,
    userEmail,
    fileName,
    vendor: fileName,
    invoiceNumber,
    amount: null,
    currency: '',
    dueDate: '',
    paymentDetails: {
      payee: '',
      bankName: '',
      bankAccountNumber: '',
      instructions: '',
    },
    status: 'pending',
    processingStatus: 'processing',
  };
}

function mergeTrackerEntries(
  current: InvoiceTrackerEntry[],
  incoming: InvoiceTrackerInput[],
): InvoiceTrackerEntry[] {
  const now = new Date();
  const incomingEntries = incoming.map((entry) => ({
    ...entry,
    createdAt: now,
    updatedAt: now,
  }));
  const merged = new Map<string, InvoiceTrackerEntry>();

  [...incomingEntries, ...current].forEach((entry) => {
    merged.set(entry.id, entry);
  });

  return Array.from(merged.values()).sort((a, b) =>
    (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31'),
  );
}

function getTrackerBadgeClassName(entry: InvoiceTrackerEntry) {
  if (entry.processingStatus === 'processing') {
    return 'bg-slate-100 text-slate-700';
  }

  if (entry.processingStatus === 'failed') {
    return 'bg-red-100 text-red-700';
  }

  return entry.status === 'paid'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-amber-100 text-amber-700';
}

function getTrackerBadgeLabel(entry: InvoiceTrackerEntry, copy: Copy) {
  const processingStatus = formatProcessingStatus(entry.processingStatus, copy);
  if (processingStatus) return processingStatus;

  return entry.status === 'paid' ? copy.paid : copy.pending;
}

function formatProcessingStatus(
  processingStatus: InvoiceTrackerProcessingStatus,
  copy: Copy,
) {
  if (processingStatus === 'processing') return copy.processingTracker;
  if (processingStatus === 'failed') return copy.reviewNeeded;

  return '';
}

function formatInvoiceAmount(
  invoice: Pick<InvoiceFields, 'amount' | 'currency'>,
  unknown: string,
) {
  if (invoice.amount === null) return unknown;

  if (!invoice.currency) return invoice.amount.toLocaleString();

  return `${invoice.currency} ${invoice.amount.toLocaleString()}`;
}

function formatPaymentSummary(
  details: InvoiceFields['paymentDetails'],
  copy: Copy,
) {
  const parts = [
    details.payee ? `${copy.payee}: ${details.payee}` : '',
    details.bankName ? `${copy.bankName}: ${details.bankName}` : '',
    details.bankAccountNumber
      ? `${copy.bankAccountNumber}: ${details.bankAccountNumber}`
      : '',
    details.instructions
      ? `${copy.paymentInstructions}: ${details.instructions}`
      : '',
  ].filter(Boolean);

  return parts.length ? parts.join(' | ') : copy.unknown;
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#dfe7ea] bg-white p-3',
        className,
      )}
    >
      <p className='text-xs font-medium uppercase text-[#607086]'>{label}</p>
      <p className='mt-1 break-words text-base font-semibold text-[#16243d]'>
        {value}
      </p>
    </div>
  );
}
