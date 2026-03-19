'use client';

import Link from 'next/link';
import SheetSideChat from './sheet-side-chat';
import NewConsultationBtn from './new-consultation-btn';
import { ReactQueryProvider } from '@/lib/react-query';

export default function MobileNavigationContents({
  lang,
  vocabularies,
}: {
  lang: string;
  vocabularies: any;
}) {
  return (
    <ReactQueryProvider>
      <SheetSideChat vocabularies={vocabularies} language={lang} />
      <Link href={`/${lang}/`}>
        <p className='font-epilogue font-bold lg:text-2xl'>
          Doc<span className='text-docduit-blue'>duit</span>
        </p>
      </Link>
      <NewConsultationBtn color='black' />
    </ReactQueryProvider>
  );
}
