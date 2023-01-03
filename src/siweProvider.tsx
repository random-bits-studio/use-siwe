import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, PropsWithChildren } from "react";

export const siweContext = createContext<QueryClient | undefined>(undefined);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

export const SiweProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient} context={siweContext}>
    {children}
  </QueryClientProvider>
);
