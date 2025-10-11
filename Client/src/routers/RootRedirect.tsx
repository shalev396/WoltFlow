import { Navigate, useLocation } from "react-router-dom";
import { getDefaultLanguage } from "@/i18n/config";

/**
 * Smart redirect that detects user's preferred language
 * Redirects any path without language to the same path with language prefix
 * This prevents the flash of wrong language content
 *
 * Examples:
 * - / → /en (or /he based on browser)
 * - /dashboard → /en/dashboard
 * - /settings → /he/settings
 */
export function RootRedirect() {
  const location = useLocation();

  // Get user's preferred language (checks browser language)
  const language = getDefaultLanguage();

  // Redirect to language-prefixed version of current path
  const redirectPath = `/${language}${location.pathname}${location.search}${location.hash}`;

  return <Navigate to={redirectPath} replace />;
}
