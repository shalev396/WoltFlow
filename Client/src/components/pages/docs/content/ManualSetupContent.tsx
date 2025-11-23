import {
  Settings,
  Key,
  Shield,
  AlertTriangle,
  Code,
  Copy,
  Eye,
  RefreshCw,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { safeTranslationArray } from "@/utils/translationHelpers";

export function ManualSetupContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/manualSetup");

  return (
    <section id="manual-setup" className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{t("badges.advanced")}</Badge>
            <Badge variant="outline">{t("badges.alternative")}</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              {t("preferExtension.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              {t("preferExtension.description")}{" "}
              <Link
                to={`/${language}/docs/woltflow-extension`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
              >
                {t("preferExtension.linkText")}
              </Link>{" "}
              {t("preferExtension.descriptionSuffix")}
            </p>
          </div>
        </div>
      </div>

      <div id="understanding-tokens" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          {t("understandingTokens.title")}
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          {t("understandingTokens.description")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Key className="h-5 w-5" />
                {t("understandingTokens.accessToken.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("understandingTokens.accessToken.description")}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {t("understandingTokens.accessToken.badges.shortLived")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t("understandingTokens.accessToken.badges.autoRefreshed")}
                  </Badge>
                </div>
                <div className="p-2 bg-white dark:bg-background rounded border">
                  <code className="text-xs text-muted-foreground font-mono">
                    {t("understandingTokens.accessToken.example")}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <Shield className="h-5 w-5" />
                {t("understandingTokens.refreshToken.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("understandingTokens.refreshToken.description")}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {t("understandingTokens.refreshToken.badges.longLived")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t("understandingTokens.refreshToken.badges.essential")}
                  </Badge>
                </div>
                <div className="p-2 bg-white dark:bg-background rounded border">
                  <code className="text-xs text-muted-foreground font-mono">
                    {t("understandingTokens.refreshToken.example")}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Monitor className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                {t("understandingTokens.deviceSpecific.title")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                {t("understandingTokens.deviceSpecific.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="manual-extraction" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("stepByStep.title")}</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step1.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step1.description")}{" "}
                <a
                  href="https://wolt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono bg-muted px-2 py-1 rounded"
                >
                  {t("stepByStep.step1.woltLink")}
                </a>{" "}
                {t("stepByStep.step1.descriptionSuffix")}
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>{t("stepByStep.step1.important.label")}</strong>{" "}
                  {t("stepByStep.step1.important.text")}
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step2.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step2.description")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {t("stepByStep.step2.keyboardShortcut.title")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("stepByStep.step2.keyboardShortcut.windows")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("stepByStep.step2.keyboardShortcut.mac")}
                  </p>
                </div>

                <div className="p-2 sm:p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {t("stepByStep.step2.rightClickMenu.title")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("stepByStep.step2.rightClickMenu.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step3.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step3.description")}
              </p>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {t("stepByStep.step3.cantFind.title")}
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {safeTranslationArray<string>(
                    t("stepByStep.step3.cantFind.tips", {
                      returnObjects: true,
                    })
                  ).map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step4.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step4.description")}
              </p>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>{t("stepByStep.step4.path")}</strong>
                </p>
              </div>

              <p className="text-muted-foreground text-sm">
                {t("stepByStep.step4.note")}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                5
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step5.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step5.description")}
              </p>

              <div className="grid gap-4">
                <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      {t("stepByStep.step5.accessToken.title")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("stepByStep.step5.accessToken.description")}
                  </p>
                  <div className="p-2 bg-white dark:bg-background rounded border text-xs font-mono text-muted-foreground">
                    {t("stepByStep.step5.accessToken.cookieName")}
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      {t("stepByStep.step5.refreshToken.title")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("stepByStep.step5.refreshToken.description")}
                  </p>
                  <div className="p-2 bg-white dark:bg-background rounded border text-xs font-mono text-muted-foreground">
                    {t("stepByStep.step5.refreshToken.cookieName")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                6
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step6.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step6.description")}
              </p>

              <div className="space-y-3">
                {safeTranslationArray<string>(
                  t("stepByStep.step6.steps", {
                    returnObjects: true,
                  })
                ).map((step: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
                  >
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {t("stepByStep.step6.warning.title")}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t("stepByStep.step6.warning.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                7
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("stepByStep.step7.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("stepByStep.step7.description")}
              </p>

              <Button asChild className="inline-flex">
                <Link to={`/${language}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t("stepByStep.step7.button")}
                </Link>
              </Button>

              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>{t("stepByStep.step7.fieldMapping.label")}</strong>{" "}
                  {t("stepByStep.step7.fieldMapping.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="token-security" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("tokenSecurity.title")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-100 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-red-700 dark:text-red-300">
                <Shield className="h-5 w-5" />
                {t("tokenSecurity.keepPrivate.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {safeTranslationArray<string>(
                  t("tokenSecurity.keepPrivate.tips", {
                    returnObjects: true,
                  })
                ).map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Monitor className="h-5 w-5" />
                {t("tokenSecurity.deviceManagement.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {safeTranslationArray<string>(
                  t("tokenSecurity.deviceManagement.tips", {
                    returnObjects: true,
                  })
                ).map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                {t("tokenSecurity.securityWarning.title")}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                {t("tokenSecurity.securityWarning.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Settings className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              {t("extractionComplete.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {t("extractionComplete.description")}
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm">
                <Link to={`/${language}/docs/getting-started#activation-guide`}>
                  {t("extractionComplete.button")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
