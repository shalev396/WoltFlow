import { useState, type ReactNode } from "react";
import type { ConsentState, ConsentPreferences } from "../types/consent";
import {
  ConsentContext,
  type ConsentContextType,
} from "./createConsentContext";

const CONSENT_STORAGE_KEY = "woltflow-consent-preferences";

const defaultPreferences: ConsentPreferences = {
  analytics: false,
  timestamp: Date.now(),
};

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consentState, setConsentState] = useState<ConsentState>(() => {
    // Check if user has already consented
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      try {
        const preferences: ConsentPreferences = JSON.parse(stored);
        return {
          hasConsented: true,
          preferences,
          showBanner: false,
        };
      } catch {
        // Invalid stored data, start fresh
      }
    }

    return {
      hasConsented: false,
      preferences: defaultPreferences,
      showBanner: true,
    };
  });

  const savePreferences = (preferences: ConsentPreferences) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  };

  const acceptAll = () => {
    const preferences: ConsentPreferences = {
      analytics: true,
      timestamp: Date.now(),
    };

    setConsentState({
      hasConsented: true,
      preferences,
      showBanner: false,
    });

    savePreferences(preferences);
  };

  const acceptEssentialOnly = () => {
    const preferences: ConsentPreferences = {
      analytics: false,
      timestamp: Date.now(),
    };

    setConsentState({
      hasConsented: true,
      preferences,
      showBanner: false,
    });

    savePreferences(preferences);
  };

  const showConsentBanner = () => {
    setConsentState((prev) => ({
      ...prev,
      showBanner: true,
    }));
  };

  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsentState({
      hasConsented: false,
      preferences: defaultPreferences,
      showBanner: true,
    });
  };

  const contextValue: ConsentContextType = {
    consentState,
    acceptAll,
    acceptEssentialOnly,
    showConsentBanner,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
}
