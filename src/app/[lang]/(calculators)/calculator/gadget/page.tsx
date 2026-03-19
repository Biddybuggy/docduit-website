import { getDictionary, Locale } from '@/app/[lang]/_utils/dictionaries';
import IndexPage from './_sections';

interface LayoutProps {
  params: Promise<{ lang: string }>;
}

export default async function CalculatorPage({ params }: LayoutProps) {
  const { lang } = await params;

  const t = await getDictionary(lang as Locale);
  const { calculators } = t;

  return <IndexPage vocabularies={calculators} />;
}
