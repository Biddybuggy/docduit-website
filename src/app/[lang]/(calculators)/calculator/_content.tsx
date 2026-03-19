'use client';

import { ReactQueryProvider } from '@/lib/react-query';

interface ICalcultorPageContent {
  children: any;
}

export default function CalcultorPageContent({
  children,
}: ICalcultorPageContent) {
  return (
    <ReactQueryProvider>
      <main className=''>{children}</main>
    </ReactQueryProvider>
  );
}
