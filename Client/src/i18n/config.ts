import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./resources";

// Supported languages
export const SUPPORTED_LANGUAGES = ["en", "he"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

// RTL languages
export const RTL_LANGUAGES: Language[] = ["he"];

// Check if a language is RTL
export const isRTL = (lng: string): boolean => {
  return RTL_LANGUAGES.includes(lng as Language);
};

// Validate if language is supported
export const isValidLanguage = (lng: string): lng is Language => {
  return SUPPORTED_LANGUAGES.includes(lng as Language);
};

// Get default language (fallback to English)
export const getDefaultLanguage = (): Language => {
  // Try to get from URL first
  const path = window.location.pathname;
  const match = path.match(/^\/(en|he)(\/|$)/);
  if (match && isValidLanguage(match[1])) {
    return match[1];
  }

  // Try browser language
  const browserLang = navigator.language.split("-")[0];
  if (isValidLanguage(browserLang)) {
    return browserLang;
  }

  // Default to English
  return "en";
};

// Update document direction and language
export const updateDocumentDirection = (lng: string): void => {
  const htmlElement = document.documentElement;
  htmlElement.lang = lng;
  htmlElement.dir = isRTL(lng) ? "rtl" : "ltr";

  // Add/remove RTL class for additional CSS targeting
  if (isRTL(lng)) {
    htmlElement.classList.add("rtl");
    htmlElement.classList.remove("ltr");
  } else {
    htmlElement.classList.add("ltr");
    htmlElement.classList.remove("rtl");
  }
};

// Initialize i18next (resources are bundled; no HTTP backend)
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    resources,

    // Supported languages
    supportedLngs: SUPPORTED_LANGUAGES,

    // Namespace configuration
    ns: [
      "common",
      "landing",
      "dashboard",
      "runs",
      "settings",
      "notFound",
      "consent",
      "navbar",
      "docsSidebar",
      "auth",
      // Legal namespaces
      "legal/privacy",
      "legal/terms",
      "legal/extensionPrivacy",
      // Documentation namespaces
      "docs/introduction",
      "docs/gettingStarted",
      "docs/woltflowExtension",
      "docs/manualSetup",
    ],
    defaultNS: "common",

    // Detection options
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
      excludeCacheFor: ["cimode"],
    },

    // React options
    react: {
      useSuspense: false,
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

// Update direction on language change
i18n.on("languageChanged", (lng: string) => {
  updateDocumentDirection(lng);
});

// Set initial direction
updateDocumentDirection(i18n.language);

export default i18n;
