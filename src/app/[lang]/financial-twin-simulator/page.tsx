import { getDictionary, Locale } from '@/app/[lang]/_utils/dictionaries';
import FinancialTwinSimulator from './simulator-client';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function FinancialTwinSimulatorPage({
  params,
}: PageProps) {
  const { lang } = await params;
  const vocabularies = await getDictionary(lang as Locale);

  return (
    <FinancialTwinSimulator
      lang={lang as Locale}
      vocabularies={vocabularies}
    />
  );
}

