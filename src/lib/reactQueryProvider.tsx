'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import localforage from 'localforage';

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 60 * 24,
          refetchOnWindowFocus: false,
        },
      },
    });

    // setup IndexedDB persister
    const persister = createAsyncStoragePersister({
      storage: localforage,
    });

    // attach persistence
    persistQueryClient({
      queryClient: qc,
      persister,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });

    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
