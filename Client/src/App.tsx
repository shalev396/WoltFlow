import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/shared/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./lib/queryClient";
import LoadingScreen from "./components/shared/LoadingScreen";
import { ConsentProvider } from "./contexts/ConsentContext";
import { ConsentManager } from "./components/consent/ConsentManager";

import { router } from "./routers/Router";
import { checkAuth } from "./store/slices/userSlice";
import type { RootState, AppDispatch } from "./store/store";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isInitialized, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Check authentication status on app initialization
    if (!isInitialized) {
      dispatch(checkAuth());
    }
  }, [dispatch, isInitialized]);

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="woltflow-theme">
          <ConsentProvider>
            <LoadingScreen message="Starting WoltFlow..." />
            <ConsentManager />
          </ConsentProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="woltflow-theme">
        <ConsentProvider>
          <RouterProvider router={router} />
          <Toaster />
          <ConsentManager />
          <ReactQueryDevtools initialIsOpen={false} />
        </ConsentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
