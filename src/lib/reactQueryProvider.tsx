'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import localforage from 'localforage';

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 60 * 24,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  useEffect(() => {
    // Only setup persistence on the client side
    if (typeof window !== 'undefined') {
      try {
        // Configure localforage
        localforage.config({
          driver: [
            localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE,
          ],
          name: 'careipro-billing',
          version: 1.0,
          storeName: 'query-cache',
        });

        // Create persister with error handling
        const persister = createAsyncStoragePersister({
          storage: localforage,
          throttleTime: 1000,
        });

        // Setup persistence with error handling
        const [, persistPromise] = persistQueryClient({
          queryClient,
          persister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              // Only persist successful queries
              return query.state.status === 'success';
            },
          },
        });

        // Handle persistence restoration errors
        persistPromise.catch((error: unknown) => {
          console.warn('Failed to restore query cache:', error);
          // Clear corrupted cache
          localforage.clear().catch(() => {
            console.warn('Failed to clear corrupted cache');
          });
        });
      } catch (error) {
        console.warn('Failed to setup query persistence:', error);
      }
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
