import UnderMaintenanceContent from '../_components/under-maintenance/under-maintenance-content';
import { getDictionary, Locale } from '../_utils/dictionaries';

interface LayoutProps {
  params: Promise<{ lang: string }>;
}

export default async function UnderMaintenancePage({ params }: LayoutProps) {
  const { lang } = await params;

  // Ensure the route always renders even if params is unexpected.
  const safeLang = (lang === 'id' || lang === 'en' ? lang : 'id') as Locale;

  // Force dictionary loading so the page language consistently matches the rest
  // of the app (even though we currently use static maintenance copy).
  await getDictionary(safeLang);

  return <UnderMaintenanceContent lang={safeLang} />;
}

