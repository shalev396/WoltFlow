import {
  Globe,
  Copy,
  CheckCircle,
  AlertCircle,
  LogIn,
  Settings,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { safeTranslationArray } from "@/utils/translationHelpers";

export function WoltFlowExtensionContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/woltflowExtension");

  return (
    <section id="woltflow-extension" className="space-y-8">
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-green-100 text-green-800">
              {t("badges.recommended")}
            </Badge>
            <Badge variant="outline">{t("badges.free")}</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              {t("privacyFirst.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {t("privacyFirst.description")}{" "}
              <Link
                to={`/${language}/legal/extension-privacy-policy`}
                target="_blank"
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium underline"
              >
                {t("privacyFirst.linkText")}
              </Link>{" "}
              {t("privacyFirst.linkSuffix")}
            </p>
          </div>
        </div>
      </div>

      <div id="extension-installation" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("installation.title")}</h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("installation.step1.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("installation.step1.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex items-center gap-2" asChild>
                  <a
                    href="https://chromewebstore.google.com/detail/woltflow-token-reviewer/ghlbloemllihpoephjhmimdodfodnmcf?authuser=0&hl=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                    {t("installation.step1.buttons.chromeWebStore")}
                  </a>
                </Button>
                {/* <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Direct Download
                </Button> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("installation.step2.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("installation.step2.description")}
              </p>

              <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {t("installation.step2.browserSupport.title")}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t("installation.step2.browserSupport.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("installation.step3.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("installation.step3.description")}
              </p>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>{t("installation.step3.iconLocation")}</strong>{" "}
                  {t("installation.step3.iconLocationDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="extracting-credentials" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          {t("extractingCredentials.title")}
        </h2>

        <div className="p-3 sm:p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <LogIn className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                {t("extractingCredentials.loginRequired.title")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                {t("extractingCredentials.loginRequired.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("extractingCredentials.step1.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("extractingCredentials.step1.description")}{" "}
                <a
                  href="https://wolt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-muted px-2 py-1 rounded"
                >
                  {t("extractingCredentials.step1.woltLink")}
                </a>{" "}
                {t("extractingCredentials.step1.descriptionSuffix")}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("extractingCredentials.step2.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("extractingCredentials.step2.description")}
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>
                    {t("extractingCredentials.step2.cantFindIcon")}
                  </strong>{" "}
                  {t("extractingCredentials.step2.cantFindIconDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("extractingCredentials.step3.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("extractingCredentials.step3.description")}
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {t("extractingCredentials.step3.accessToken.title")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("extractingCredentials.step3.accessToken.description")}
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {t("extractingCredentials.step3.refreshToken.title")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("extractingCredentials.step3.refreshToken.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                {t("extractingCredentials.step4.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("extractingCredentials.step4.description")}
              </p>

              <Button asChild className="inline-flex">
                <Link to={`/${language}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t("extractingCredentials.step4.button")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="extension-troubleshooting" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("troubleshooting.title")}</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                {t("troubleshooting.noCredentialsFound.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("troubleshooting.noCredentialsFound.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("troubleshooting.noCredentialsFound.solutionsTitle")}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    {safeTranslationArray<string>(
                      t("troubleshooting.noCredentialsFound.solutions", {
                        returnObjects: true,
                      })
                    ).map((solution: string, idx: number) => (
                      <li key={idx}>{solution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                {t("troubleshooting.iconNotVisible.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("troubleshooting.iconNotVisible.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("troubleshooting.iconNotVisible.checkLocationsTitle")}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    {safeTranslationArray<string>(
                      t("troubleshooting.iconNotVisible.checkLocations", {
                        returnObjects: true,
                      })
                    ).map((location: string, idx: number) => (
                      <li key={idx}>{location}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                {t("troubleshooting.credentialsKeepChanging.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("troubleshooting.credentialsKeepChanging.description")}
                </p>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        {t(
                          "troubleshooting.credentialsKeepChanging.bestPractice.title"
                        )}
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {t(
                          "troubleshooting.credentialsKeepChanging.bestPractice.description"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                {t("troubleshooting.securityConcerns.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("troubleshooting.securityConcerns.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("troubleshooting.securityConcerns.featuresTitle")}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    {safeTranslationArray<string>(
                      t("troubleshooting.securityConcerns.features", {
                        returnObjects: true,
                      })
                    ).map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <Button asChild variant="outline" size="sm">
                  <Link
                    to={`/${language}/legal/extension-privacy-policy`}
                    target="_blank"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {t("troubleshooting.securityConcerns.viewPrivacyPolicy")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              {t("needMoreHelp.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {t("needMoreHelp.description")}{" "}
              <Link
                to={`/${language}/docs/manual-setup`}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium underline"
              >
                {t("needMoreHelp.manualSetupLink")}
              </Link>{" "}
              {t("needMoreHelp.descriptionSuffix")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
