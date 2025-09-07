import { useEffect } from "react";
import { ConsentBanner } from "./ConsentBanner";
import { useConsent } from "../../hooks/useConsent";
import { analytics } from "../../services/analytics";

/**
 * ConsentManager - Main component that handles cookie consent flow
 * and integrates with Google Analytics based on user preferences
 */
export function ConsentManager() {
  const { consentState } = useConsent();

  // Update analytics service when consent preferences change
  useEffect(() => {
    analytics.updateConsent(consentState.preferences.analytics);
  }, [consentState.preferences.analytics]);

  // Initialize analytics on mount if consent already given
  useEffect(() => {
    if (consentState.hasConsented) {
      analytics.initialize(consentState.preferences.analytics);
    }
  }, [consentState.hasConsented, consentState.preferences.analytics]);

  return <ConsentBanner />;
}
