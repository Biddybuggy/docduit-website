import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomUUID } from 'crypto';
import { authOptions } from '@/services/auth';
import { checkRateLimit } from '@/lib/security/rate-limit';
import type {
  GeneratedWorkflowFile,
  InvoiceFields,
  WorkflowActionStatus,
} from '@/lib/financial-workflow/invoice-workflow';
import {
  createInvoicesCsvFile,
  parse_invoice,
  runInvoiceWorkflow,
} from '@/lib/financial-workflow/invoice-workflow';
import {
  invoiceWorkflowFormSchema,
  isAllowedInvoiceFile,
  MAX_INVOICE_FILES,
  sanitizeInvoiceFileName,
} from '@/lib/security/schemas/invoice-workflow';
import { sanitizeErrorForClient } from '@/lib/security/api-response';

export const runtime = 'nodejs';
export const maxDuration = 60;

type InvoiceWorkflowItem = {
  id: string;
  fileName: string;
  invoice?: InvoiceFields;
  actions: WorkflowActionStatus[];
  files: GeneratedWorkflowFile[];
  mode: 'preview' | 'executed';
  error?: string;
};

export async function POST(request: NextRequest) {
  const rateLimitRes = await checkRateLimit(request, 'general');
  if (rateLimitRes) return rateLimitRes;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        error:
          'Smart financial workflow automator is available only for signed-in users.',
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const formValues = Object.fromEntries(
      [...formData.entries()].filter(([, value]) => typeof value === 'string'),
    );
    const parsedForm = invoiceWorkflowFormSchema.safeParse(formValues);

    if (!parsedForm.success) {
      return NextResponse.json(
        { error: parsedForm.error.issues[0]?.message ?? 'Invalid form data' },
        { status: 400 },
      );
    }

    const uploadedFiles = [
      ...formData.getAll('files'),
      formData.get('file'),
    ].filter((item): item is File => item instanceof File && item.size > 0);

    if (!uploadedFiles.length) {
      return NextResponse.json(
        { error: 'Upload at least one invoice file.' },
        { status: 400 },
      );
    }

    if (uploadedFiles.length > MAX_INVOICE_FILES) {
      return NextResponse.json(
        { error: `Upload up to ${MAX_INVOICE_FILES} invoice files at once.` },
        { status: 400 },
      );
    }

    for (const file of uploadedFiles) {
      if (!isAllowedInvoiceFile(file)) {
        return NextResponse.json(
          {
            error:
              'One or more files are invalid. Upload PDF, DOCX, TXT, CSV, PNG, or JPG files up to 10 MB each.',
          },
          { status: 400 },
        );
      }
    }

    const shouldExecute = parsedForm.data.execute === 'true';
    const lang = parsedForm.data.lang === 'id' ? 'id' : 'en';
    const mode = shouldExecute ? 'executed' : 'preview';
    const fileIds = parsedForm.data.fileIds ?? [];
    const items: InvoiceWorkflowItem[] = [];
    const batchFiles: GeneratedWorkflowFile[] = [];

    for (const [index, file] of uploadedFiles.entries()) {
      const itemId = fileIds[index] || randomUUID();

      try {
        const { fields } = await parse_invoice(file);

        const workflow = shouldExecute
          ? await runInvoiceWorkflow(fields, {
              lang,
              createCalendarFile: parsedForm.data.calendar !== 'false',
              createCsvExport: false,
            })
          : { actions: [], files: [] };

        items.push({
          id: itemId,
          fileName: sanitizeInvoiceFileName(file.name),
          invoice: fields,
          actions: workflow.actions,
          files: workflow.files,
          mode,
        });
      } catch (error) {
        items.push({
          id: itemId,
          fileName: sanitizeInvoiceFileName(file.name),
          actions: [],
          files: [],
          mode,
          error: sanitizeErrorForClient(
            error,
            'Failed to process this invoice.',
          ),
        });
      }
    }

    const firstSuccessfulItem = items.find((item) => item.invoice);

    if (!firstSuccessfulItem) {
      return NextResponse.json(
        {
          error: 'No invoice files could be processed.',
          items,
          mode,
        },
        { status: 422 },
      );
    }

    if (shouldExecute && parsedForm.data.csv !== 'false') {
      batchFiles.push(
        createInvoicesCsvFile(
          items
            .map((item) => item.invoice)
            .filter((invoice): invoice is InvoiceFields => Boolean(invoice)),
          `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
        ),
      );
    }

    return NextResponse.json({
      items,
      invoice: firstSuccessfulItem.invoice,
      actions: firstSuccessfulItem.actions,
      files: firstSuccessfulItem.files,
      batchFiles,
      mode,
    });
  } catch (error) {
    console.error('Invoice workflow failed:', error);
    return NextResponse.json(
      {
        error: sanitizeErrorForClient(
          error,
          'Failed to process invoice workflow.',
        ),
      },
      { status: 500 },
    );
  }
}
