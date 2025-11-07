import { useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isValidLanguage, getDefaultLanguage } from "@/i18n/config";

/**
 * Layout component that wraps all routes and handles language detection
 * Extracts :lng from URL and syncs with i18n
 * Redirects invalid languages to default language
 */
export function LanguageLayout() {
  const { lng } = useParams<{ lng: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If no language in URL, redirect to default language
    if (!lng) {
      const defaultLang = getDefaultLanguage();
      navigate(
        `/${defaultLang}${location.pathname}${location.search}${location.hash}`,
        {
          replace: true,
        }
      );
      return;
    }

    // If invalid language, redirect to default language  
    if (!isValidLanguage(lng)) {
      const defaultLang = getDefaultLanguage();
      // When /:lng matches an invalid language (e.g., /auth/callback where lng="auth"),
      // we need to preserve the entire original path including the invalid "language" part
      // The pathname is already complete (e.g., "/auth/callback"), just add the language prefix
      navigate(
        `/${defaultLang}${location.pathname}${location.search}${location.hash}`,
        {
          replace: true,
        }
      );
      return;
    }

    // If language is valid but different from current i18n language, change it
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n, navigate, location]);

  // Render child routes
  return <Outlet />;
}
