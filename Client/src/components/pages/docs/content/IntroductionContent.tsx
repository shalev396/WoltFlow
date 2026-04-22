import {
  BookOpen,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { safeTranslationArray } from "@/utils/translationHelpers";

export function IntroductionContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/introduction");

  return (
    <section id="introduction" className="space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div id="what-is-woltflow" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("whatIsWoltflow.title")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Zap className="h-5 w-5" />
                {t("whatIsWoltflow.automatedSolution.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("whatIsWoltflow.automatedSolution.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                {t("whatIsWoltflow.dailyBenefits.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("whatIsWoltflow.dailyBenefits.description")}
              </p>
            </CardContent>
          </Card>
        </div>

      </div>

      <div id="how-it-works" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("howItWorks.title")}</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("howItWorks.steps.1.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("howItWorks.steps.1.description")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("howItWorks.steps.2.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("howItWorks.steps.2.description")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("howItWorks.steps.3.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("howItWorks.steps.3.description")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t("howItWorks.steps.4.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("howItWorks.steps.4.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                {t("howItWorks.perfectTiming.title")}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {t("howItWorks.perfectTiming.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="security-privacy" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("securityPrivacy.title")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-orange-100 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-orange-700 dark:text-orange-300">
                <Shield className="h-5 w-5" />
                {t("securityPrivacy.bankLevelEncryption.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {safeTranslationArray<string>(
                  t("securityPrivacy.bankLevelEncryption.features", {
                    returnObjects: true,
                  })
                ).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-purple-700 dark:text-purple-300">
                <Shield className="h-5 w-5" />
                {t("securityPrivacy.individualPrivacy.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {safeTranslationArray<string>(
                  t("securityPrivacy.individualPrivacy.features", {
                    returnObjects: true,
                  })
                ).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t("securityPrivacy.yourDataYourControl.title")}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                {t("securityPrivacy.yourDataYourControl.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button asChild size="lg" className="group">
          <Link to={`/${language}/docs/getting-started`}>
            {t("cta.getStarted")}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to={`/${language}/docs/woltflow-extension`}>
            {t("cta.downloadExtension")}
          </Link>
        </Button>
      </div>
    </section>
  );
}
