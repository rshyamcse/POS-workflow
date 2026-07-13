'use client';

import React, { useState } from 'react';
import { POSProvider } from '@/context/POSContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <POSProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </POSProvider>
    </QueryClientProvider>
  );
}
