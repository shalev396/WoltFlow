import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { SUPPORTED_LANGUAGES } from "@/i18n/config";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

/**
 * SEO component that manages hreflang, canonical tags, and other SEO elements
 * for internationalized pages using vanilla DOM manipulation
 */
export function SEOHead({ title, description, keywords }: SEOHeadProps) {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    // Get the base URL
    const baseURL = window.location.origin;

    // All pages now have language in URL, so canonical includes language
    const canonicalURL = `${baseURL}${location.pathname}`;

    // Get the path without language for alternate URLs
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}/, "") || "";

    // Default meta information
    const pageTitle = title
      ? `${title} | WoltFlow`
      : "WoltFlow - Automate Your Wolt Gift Card Purchases";

    const pageDescription =
      description ||
      "Streamline your meal benefits with automation. WoltFlow automatically purchases Wolt gift cards from Cibus daily, saving you time and maximizing your benefits utilization.";

    const pageKeywords =
      keywords ||
      "WoltFlow, Wolt, Cibus, meal benefits, automation, gift cards, food delivery";

    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (
      selector: string,
      attribute: string,
      value: string
    ) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute.split("=")[0], attribute.split("=")[1]);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;

      let element = document.querySelector(selector) as HTMLLinkElement;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        if (hreflang) {
          element.setAttribute("hreflang", hreflang);
        }
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Remove existing hreflang and canonical links
    document
      .querySelectorAll('link[rel="alternate"], link[rel="canonical"]')
      .forEach((el) => el.remove());

    // Update primary meta tags
    updateMetaTag('meta[name="title"]', "name=title", pageTitle);
    updateMetaTag(
      'meta[name="description"]',
      "name=description",
      pageDescription
    );
    updateMetaTag('meta[name="keywords"]', "name=keywords", pageKeywords);

    // Update canonical URL
    updateLinkTag("canonical", canonicalURL);

    // Add hreflang tags for each supported language (for ALL pages now)
    SUPPORTED_LANGUAGES.forEach((lng) => {
      updateLinkTag("alternate", `${baseURL}/${lng}${pathWithoutLang}`, lng);
    });

    // Add x-default hreflang (point to English version)
    updateLinkTag("alternate", `${baseURL}/en${pathWithoutLang}`, "x-default");

    // Update Open Graph tags
    updateMetaTag('meta[property="og:type"]', "property=og:type", "website");
    updateMetaTag('meta[property="og:url"]', "property=og:url", canonicalURL);
    updateMetaTag('meta[property="og:title"]', "property=og:title", pageTitle);
    updateMetaTag(
      'meta[property="og:description"]',
      "property=og:description",
      pageDescription
    );
    updateMetaTag(
      'meta[property="og:locale"]',
      "property=og:locale",
      language === "he" ? "he_IL" : "en_US"
    );

    // Update Twitter tags
    updateMetaTag(
      'meta[property="twitter:card"]',
      "property=twitter:card",
      "summary_large_image"
    );
    updateMetaTag(
      'meta[property="twitter:url"]',
      "property=twitter:url",
      canonicalURL
    );
    updateMetaTag(
      'meta[property="twitter:title"]',
      "property=twitter:title",
      pageTitle
    );
    updateMetaTag(
      'meta[property="twitter:description"]',
      "property=twitter:description",
      pageDescription
    );
  }, [location.pathname, language, title, description, keywords]);

  return null;
}
