import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import {
  parse_invoice,
  runInvoiceWorkflow,
} from '@/lib/financial-workflow/invoice-workflow';

export const runtime = 'nodejs';

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
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Upload an invoice file.' },
        { status: 400 },
      );
    }

    const { fields, rawText } = await parse_invoice(file);
    const shouldExecute = formData.get('execute') === 'true';
    const lang = formData.get('lang') === 'id' ? 'id' : 'en';

    const workflow = shouldExecute
      ? await runInvoiceWorkflow(fields, {
          lang,
          createCalendarFile: formData.get('calendar') !== 'false',
          createCsvExport: formData.get('csv') !== 'false',
          sendEmailNotification: formData.get('email') !== 'false',
        })
      : { actions: [], files: [] };

    return NextResponse.json({
      invoice: fields,
      actions: workflow.actions,
      files: workflow.files,
      mode: shouldExecute ? 'executed' : 'preview',
      rawTextPreview: rawText.slice(0, 1500),
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
