import { useContext } from "react";
import {
  ConsentContext,
  type ConsentContextType,
} from "../contexts/createConsentContext";

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
};
