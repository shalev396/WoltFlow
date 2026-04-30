/**
 * Bundled i18n resources. All locale modules are imported so they are included in the JS bundle.
 */
import enAuth from "./locales/en/auth";
import enCommon from "./locales/en/common";
import enConsent from "./locales/en/consent";
import enDashboard from "./locales/en/dashboard";
import enDocsGettingStarted from "./locales/en/docs/gettingStarted";
import enDocsIntroduction from "./locales/en/docs/introduction";
import enDocsManualSetup from "./locales/en/docs/manualSetup";
import enDocsWoltflowExtension from "./locales/en/docs/woltflowExtension";
import enDocsSidebar from "./locales/en/docsSidebar";
import enLanding from "./locales/en/landing";
import enLegalExtensionPrivacy from "./locales/en/legal/extensionPrivacy";
import enLegalPrivacy from "./locales/en/legal/privacy";
import enLegalTerms from "./locales/en/legal/terms";
import enNavbar from "./locales/en/navbar";
import enNotFound from "./locales/en/notFound";
import enRuns from "./locales/en/runs";
import enSettings from "./locales/en/settings";

import heAuth from "./locales/he/auth";
import heCommon from "./locales/he/common";
import heConsent from "./locales/he/consent";
import heDashboard from "./locales/he/dashboard";
import heDocsGettingStarted from "./locales/he/docs/gettingStarted";
import heDocsIntroduction from "./locales/he/docs/introduction";
import heDocsManualSetup from "./locales/he/docs/manualSetup";
import heDocsWoltflowExtension from "./locales/he/docs/woltflowExtension";
import heDocsSidebar from "./locales/he/docsSidebar";
import heLanding from "./locales/he/landing";
import heLegalExtensionPrivacy from "./locales/he/legal/extensionPrivacy";
import heLegalPrivacy from "./locales/he/legal/privacy";
import heLegalTerms from "./locales/he/legal/terms";
import heNavbar from "./locales/he/navbar";
import heNotFound from "./locales/he/notFound";
import heRuns from "./locales/he/runs";
import heSettings from "./locales/he/settings";

export const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    consent: enConsent,
    dashboard: enDashboard,
    "docs/gettingStarted": enDocsGettingStarted,
    "docs/introduction": enDocsIntroduction,
    "docs/manualSetup": enDocsManualSetup,
    "docs/woltflowExtension": enDocsWoltflowExtension,
    docsSidebar: enDocsSidebar,
    landing: enLanding,
    "legal/extensionPrivacy": enLegalExtensionPrivacy,
    "legal/privacy": enLegalPrivacy,
    "legal/terms": enLegalTerms,
    navbar: enNavbar,
    notFound: enNotFound,
    runs: enRuns,
    settings: enSettings,
  },
  he: {
    auth: heAuth,
    common: heCommon,
    consent: heConsent,
    dashboard: heDashboard,
    "docs/gettingStarted": heDocsGettingStarted,
    "docs/introduction": heDocsIntroduction,
    "docs/manualSetup": heDocsManualSetup,
    "docs/woltflowExtension": heDocsWoltflowExtension,
    docsSidebar: heDocsSidebar,
    landing: heLanding,
    "legal/extensionPrivacy": heLegalExtensionPrivacy,
    "legal/privacy": heLegalPrivacy,
    "legal/terms": heLegalTerms,
    navbar: heNavbar,
    notFound: heNotFound,
    runs: heRuns,
    settings: heSettings,
  },
} as const;
