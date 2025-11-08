import { Link } from "react-router-dom";
import { CookieSettings } from "../shared/consent/CookieSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <footer className="relative z-20 bg-background border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            {t("footer.rights")}
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-center md:text-left">
            <Link
              to={`/${language}/legal/privacy-policy`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to={`/${language}/legal/extension-privacy-policy`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.extensionPrivacy")}
            </Link>
            <Link
              to={`/${language}/legal/terms-of-service`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.terms")}
            </Link>
            <CookieSettings variant="link" />
          </div>
        </div>
      </div>
    </footer>
  );
}
