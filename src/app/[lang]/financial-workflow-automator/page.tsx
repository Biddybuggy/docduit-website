import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/services/auth';
import { getDictionary, Locale } from '@/app/[lang]/_utils/dictionaries';
import FinancialWorkflowAutomatorClient from './workflow-client';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function FinancialWorkflowAutomatorPage({
  params,
}: PageProps) {
  const { lang } = await params;
  const session = await getServerSession(authOptions);

  const callbackUrl = encodeURIComponent(`/${lang}/financial-workflow-automator`);

  if (!session?.user?.email) {
    redirect(`/login?lang=${lang}&callbackUrl=${callbackUrl}`);
  }

  const vocabularies = await getDictionary(lang as Locale);

  return (
    <FinancialWorkflowAutomatorClient
      lang={lang as Locale}
      userEmail={session.user.email || ''}
      vocabularies={vocabularies}
    />
  );
}
