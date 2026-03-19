'use client';
import IntroductionSection from './_sections/introduction';
import FeatureSection from './_sections/features';
import CalculatorSection from './_sections/calculators';
import TestimonySection from './_sections/testimonies';
import ArticleSection from './_sections/articles';
import { ReactQueryProvider } from '@/lib/react-query';

interface ILandingPageContent {
  lang: string;
  vocabularies: any;
}

export default function LandingPageContent({
  lang,
  vocabularies,
}: ILandingPageContent) {
  return (
    <div className='mx-5 lg:mx-16 xl:mx-24 my-8 lg:my-12 flex flex-col gap-12'>
      <ReactQueryProvider>
        <IntroductionSection lang={lang} vocabularies={vocabularies} />
        <FeatureSection vocabularies={vocabularies} />
        <CalculatorSection lang={lang} vocabularies={vocabularies} />
        <TestimonySection vocabularies={vocabularies} />
        <ArticleSection lang={lang} vocabularies={vocabularies} />
      </ReactQueryProvider>
    </div>
  );
}
