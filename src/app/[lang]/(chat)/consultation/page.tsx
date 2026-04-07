import { getDictionary, Locale } from '../../_utils/dictionaries';
import UnderMaintenanceContent from '../../_components/under-maintenance/under-maintenance-content';
import ConsultationContainer from './_components/consultation-container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth';
import { redirect } from 'next/navigation';

interface LayoutProps {
  params: Promise<{ lang: string }>;
}

const isDemoMode = process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true';

export default async function ConsultationPage({ params }: LayoutProps) {
  const { lang } = await params;
  const vocabularies = await getDictionary(lang as Locale);

  if (isDemoMode) {
    return <ConsultationContainer vocabularies={vocabularies} />;
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/api/auth/signin/google?callbackUrl=${encodeURIComponent('/' + lang + '/consultation')}`);
  }

  return <ConsultationContainer vocabularies={vocabularies} />;
}
