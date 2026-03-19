import { getDictionary, Locale } from '../../_utils/dictionaries';
import UnderMaintenanceContent from '../../_components/under-maintenance/under-maintenance-content';

interface LayoutProps {
  params: Promise<{ lang: string }>;
}

export default async function ConsultationPage({ params }: LayoutProps) {
  const { lang } = await params;
  const vocabularies = await getDictionary(lang as Locale);
  // Consultation currently depends on backend services; show maintenance instead.
  void vocabularies;
  return <UnderMaintenanceContent lang={lang as Locale} />;
}
