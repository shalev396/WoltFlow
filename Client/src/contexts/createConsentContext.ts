import { createContext } from "react";
import type { ConsentState } from "../types/consent";

export interface ConsentContextType {
  consentState: ConsentState;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  showConsentBanner: () => void;
  resetConsent: () => void;
}

export const ConsentContext = createContext<ConsentContextType | undefined>(
  undefined
);
