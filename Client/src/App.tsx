// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { queryClient } from "./lib/queryClient";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Runs from "@/pages/Runs";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";

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
          <LoadingScreen message="Starting WoltFlow..." />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="woltflow-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/runs"
              element={
                <ProtectedRoute>
                  <Runs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
