import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useCallback } from "react";
import {
  isValidLanguage,
  type Language,
  SUPPORTED_LANGUAGES,
} from "@/i18n/config";

export function useLanguage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lng } = useParams<{ lng: string }>();

  // Get current language from URL parameter
  const getCurrentLanguage = useCallback((): Language => {
    // Language is always in the URL as first segment
    if (lng && isValidLanguage(lng)) {
      return lng;
    }

    // Fallback to i18n current language
    const currentLang = i18n.language;
    if (isValidLanguage(currentLang)) {
      return currentLang;
    }

    return "en"; // ultimate fallback
  }, [lng, i18n.language]);

  // Change language by updating the URL
  const changeLanguage = useCallback(
    (newLang: Language) => {
      const currentLang = getCurrentLanguage();

      // If already on the correct language, do nothing
      if (currentLang === newLang) {
        return;
      }

      // Update i18next language
      i18n.changeLanguage(newLang);

      // Replace language in URL path
      const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}/, "");
      const newPath = `/${newLang}${pathWithoutLang || ""}`;

      navigate(newPath + location.search + location.hash, { replace: true });
    },
    [i18n, getCurrentLanguage, navigate, location]
  );

  return {
    language: getCurrentLanguage(),
    changeLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
    isRTL: i18n.dir() === "rtl",
  };
}
