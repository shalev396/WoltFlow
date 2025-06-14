import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
