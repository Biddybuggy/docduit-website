import { getDictionary, Locale } from '../_utils/dictionaries';
import LandingPageContent from './_content';

interface LayoutProps {
  params: Promise<{ lang: string }>;
}

export default async function Home({ params }: LayoutProps) {
  const { lang } = await params;
  const vocabularies = await getDictionary(lang as Locale);
  return <LandingPageContent lang={lang} vocabularies={vocabularies} />;
}
