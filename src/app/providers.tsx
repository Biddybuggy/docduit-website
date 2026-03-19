'use client';

import { SWRConfig } from 'swr';
import fetcher from '@/lib/fetcher';
import { ReactNode } from 'react';

interface SWRConfigProviderProps {
  children: ReactNode;
}

export default function SWRConfigProvider({ children }: SWRConfigProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        // refreshInterval: 3000,
      }}
    >
      {children}
    </SWRConfig>
  );
}