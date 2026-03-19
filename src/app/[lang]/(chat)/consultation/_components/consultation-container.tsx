'use client';

import { ReactQueryProvider } from '@/lib/react-query';
import ConsultationContent from './consultation-content';

interface ContainerProps {
  vocabularies: any;
}

export default function ConsultationContainer({
  vocabularies,
}: ContainerProps) {
  return (
    <ReactQueryProvider>
      <ConsultationContent vocabularies={vocabularies} />
    </ReactQueryProvider>
  );
}
