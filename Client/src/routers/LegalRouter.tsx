import { Routes, Route } from "react-router-dom";
import PrivacyPage from "../pages/PrivacyPage";
import ExtensionPrivacyPage from "../pages/ExtensionPrivacyPage";
import TermsOfService from "../pages/TermsOfService";
import NotFound from "@/pages/NotFound";

export function LegalRouter() {
  return (
    <Routes>
      {/* Privacy Policy - handle both nested and direct routes */}
      <Route path="privacy-policy" element={<PrivacyPage />} />

      {/* Extension Privacy Policy */}
      <Route
        path="extension-privacy-policy"
        element={<ExtensionPrivacyPage />}
      />

      {/* Terms of Service */}
      <Route path="terms-of-service" element={<TermsOfService />} />

      {/* Default redirect to privacy policy
      <Route index element={<PrivacyPage />} /> */}

      {/* Fallback - redirect any unknown legal path to privacy policy
      <Route path="*" element={<Navigate to="/privacy-policy" replace />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
