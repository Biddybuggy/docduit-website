import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomUUID } from 'crypto';
import { authOptions } from '@/services/auth';
import type {
  GeneratedWorkflowFile,
  InvoiceFields,
  WorkflowActionStatus,
} from '@/lib/financial-workflow/invoice-workflow';
import {
  parse_invoice,
  runInvoiceWorkflow,
} from '@/lib/financial-workflow/invoice-workflow';

export const runtime = 'nodejs';

type InvoiceWorkflowItem = {
  id: string;
  fileName: string;
  invoice?: InvoiceFields;
  actions: WorkflowActionStatus[];
  files: GeneratedWorkflowFile[];
  mode: 'preview' | 'executed';
  rawTextPreview: string;
  error?: string;
};

export async function POST(request: NextRequest) {
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

    if (uploadedFiles.length > 10) {
      return NextResponse.json(
        { error: 'Upload up to 10 invoice files at once.' },
        { status: 400 },
      );
    }

    const shouldExecute = formData.get('execute') === 'true';
    const lang = formData.get('lang') === 'id' ? 'id' : 'en';
    const mode = shouldExecute ? 'executed' : 'preview';
    const items: InvoiceWorkflowItem[] = [];

    for (const file of uploadedFiles) {
      const itemId = randomUUID();

      try {
        const { fields, rawText } = await parse_invoice(file);

        const workflow = shouldExecute
          ? await runInvoiceWorkflow(fields, {
              lang,
              createCalendarFile: formData.get('calendar') !== 'false',
              createCsvExport: formData.get('csv') !== 'false',
            })
          : { actions: [], files: [] };

        items.push({
          id: itemId,
          fileName: file.name,
          invoice: fields,
          actions: workflow.actions,
          files: workflow.files,
          mode,
          rawTextPreview: rawText.slice(0, 1500),
        });
      } catch (error) {
        items.push({
          id: itemId,
          fileName: file.name,
          actions: [],
          files: [],
          mode,
          rawTextPreview: '',
          error:
            error instanceof Error
              ? error.message
              : 'Failed to process this invoice.',
        });
      }
    }

    const firstSuccessfulItem = items.find((item) => 'invoice' in item);

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

    return NextResponse.json({
      items,
      invoice: firstSuccessfulItem.invoice,
      actions: firstSuccessfulItem.actions,
      files: firstSuccessfulItem.files,
      mode,
      rawTextPreview: firstSuccessfulItem.rawTextPreview,
    });
  } catch (error) {
    console.error('Invoice workflow failed:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process invoice workflow.',
      },
      { status: 500 },
    );
  }
}
