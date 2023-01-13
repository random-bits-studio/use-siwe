import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, PropsWithChildren } from "react";
import { UseSiweOptions } from "./types.js";

export const queryContext = createContext<QueryClient | undefined>(undefined);
export const optionsContext = createContext<UseSiweOptions>({});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

type SiweProviderProps = PropsWithChildren & {
  options?: UseSiweOptions,
};

export const SiweProvider = ({ children, options = {} }: SiweProviderProps) => (
  <optionsContext.Provider value={options}>
    <QueryClientProvider client={queryClient} context={queryContext}>
      {children}
    </QueryClientProvider>
  </optionsContext.Provider>
);
