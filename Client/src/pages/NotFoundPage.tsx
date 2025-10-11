import { useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/shared/Layout";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation("notFound");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20 mb-4">
            {t("code")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            {t("message")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="min-w-[160px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("actions.goBack")}
          </Button>
          <Button
            onClick={() => navigate(`/${language}`)}
            size="lg"
            className="min-w-[160px]"
          >
            <Home className="mr-2 h-4 w-4" />
            {t("actions.goHome")}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 border border-border rounded-lg bg-muted/30">
          <h2 className="text-xl font-semibold mb-3">
            {t("help.title")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t("help.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to={`/${language}/dashboard`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {t("help.links.dashboard")}
            </Link>
            <Link
              to={`/${language}/runs`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {t("help.links.runs")}
            </Link>
            <Link
              to={`/${language}/inbox`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {t("help.links.inbox")}
            </Link>
            <Link
              to={`/${language}/settings`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {t("help.links.settings")}
            </Link>
            <Link
              to={`/${language}/legal/privacy-policy`}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {t("help.links.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
