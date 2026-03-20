import { getDictionary, Locale } from '../../_utils/dictionaries';
import UnderMaintenanceContent from '../../_components/under-maintenance/under-maintenance-content';
import ConsultationContainer from './_components/consultation-container';

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
  return <UnderMaintenanceContent lang={lang as Locale} />;
}
