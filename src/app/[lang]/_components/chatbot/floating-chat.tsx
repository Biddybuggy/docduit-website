'use client';

import { ReactQueryProvider } from '@/lib/react-query';
import FloatingChatComponent from './floating-chat-component';
import { Suspense } from 'react';

interface FloatingChatProps {
  vocabularies: any;
  locale: string;
}

export default function FloatingChat({
  vocabularies,
  locale,
}: FloatingChatProps) {
  return (
    <ReactQueryProvider>
      <Suspense fallback={null}>
        <FloatingChatComponent vocabularies={vocabularies} locale={locale} />
      </Suspense>
    </ReactQueryProvider>
  );
}
