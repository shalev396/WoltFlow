import { useCallback } from "react";
import { analytics } from "../services/analytics";
import { useConsent } from "./useConsent";

/**
 * Hook for tracking analytics events and page views
 * Automatically respects user consent preferences
 */
export function useAnalytics() {
  const { consentState } = useConsent();

  const trackPageView = useCallback(
    (path: string, title?: string) => {
      if (consentState.preferences.analytics) {
        analytics.trackPageView(path, title);
      }
    },
    [consentState.preferences.analytics]
  );

  const trackEvent = useCallback(
    (action: string, category: string, label?: string, value?: number) => {
      if (consentState.preferences.analytics) {
        analytics.trackEvent(action, category, label, value);
      }
    },
    [consentState.preferences.analytics]
  );

  const trackUserAction = useCallback(
    (action: string, details?: Record<string, unknown>) => {
      if (consentState.preferences.analytics) {
        analytics.trackEvent(action, "User Action", JSON.stringify(details));
      }
    },
    [consentState.preferences.analytics]
  );

  const trackError = useCallback(
    (error: Error, context?: string) => {
      if (consentState.preferences.analytics) {
        analytics.trackEvent(
          "Error",
          "Application Error",
          `${context || "Unknown"}: ${error.message}`
        );
      }
    },
    [consentState.preferences.analytics]
  );

  return {
    trackPageView,
    trackEvent,
    trackUserAction,
    trackError,
    hasConsent: consentState.preferences.analytics,
    isInitialized: analytics.isAnalyticsInitialized(),
  };
}
