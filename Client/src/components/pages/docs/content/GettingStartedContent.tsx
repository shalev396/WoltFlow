import {
  Play,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Settings,
  Globe,
  CreditCard,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

export function GettingStartedContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/gettingStarted");

  return (
    <section id="getting-started" className="space-y-8">
      <div className="flex items-center gap-3">
        <Play className="h-8 w-8 text-green-600" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div id="setup-checklist" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("setupChecklist.title")}</h2>

        <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                {t("setupChecklist.overview.title")}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {t("setupChecklist.overview.description")}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("setupChecklist.steps.woltCredentials.label")}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {t("setupChecklist.steps.woltCredentials.badge")}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("setupChecklist.steps.cibusCredentials.label")}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {t("setupChecklist.steps.cibusCredentials.badge")}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("setupChecklist.steps.smsForwarding.label")}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {t("setupChecklist.steps.smsForwarding.badge")}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("setupChecklist.steps.emailForwarding.label")}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {t("setupChecklist.steps.emailForwarding.badge")}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("setupChecklist.steps.configureAutomation.label")}
              </span>
              <Badge variant="secondary" className="ml-auto">
                {t("setupChecklist.steps.configureAutomation.badge")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div id="account-requirements" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          {t("accountRequirements.title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                {t("accountRequirements.woltAccount.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {t("accountRequirements.woltAccount.description")}
              </p>

              <div className="space-y-3">
                <h4 className="font-medium">
                  {t("accountRequirements.woltAccount.optionsTitle")}
                </h4>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {t("accountRequirements.woltAccount.extension.title")}
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      {t("accountRequirements.woltAccount.extension.badge")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("accountRequirements.woltAccount.extension.description")}
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/${language}/docs/woltflow-extension`}>
                      {t("accountRequirements.woltAccount.extension.button")}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {t("accountRequirements.woltAccount.manual.title")}
                    </span>
                    <Badge variant="secondary">
                      {t("accountRequirements.woltAccount.manual.badge")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("accountRequirements.woltAccount.manual.description")}
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/${language}/docs/manual-setup`}>
                      {t("accountRequirements.woltAccount.manual.button")}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                      {t(
                        "accountRequirements.woltAccount.deviceConsideration.title"
                      )}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {t(
                        "accountRequirements.woltAccount.deviceConsideration.description"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                {t("accountRequirements.cibusAccount.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {t("accountRequirements.cibusAccount.description")}
              </p>

              <div className="space-y-3">
                <h4 className="font-medium">
                  {t("accountRequirements.cibusAccount.requiredInfoTitle")}
                </h4>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">
                      {t("accountRequirements.cibusAccount.fields.email.label")}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "accountRequirements.cibusAccount.fields.email.description"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">
                      {t(
                        "accountRequirements.cibusAccount.fields.password.label"
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "accountRequirements.cibusAccount.fields.password.description"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">
                      {t(
                        "accountRequirements.cibusAccount.fields.company.label"
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {t(
                        "accountRequirements.cibusAccount.fields.company.description"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      {t(
                        "accountRequirements.cibusAccount.secureStorage.title"
                      )}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {t(
                        "accountRequirements.cibusAccount.secureStorage.description"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="activation-guide" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("activationGuide.title")}</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("activationGuide.step1.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("activationGuide.step1.description")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  asChild
                  className="h-auto p-2 sm:p-4 justify-start w-full"
                >
                  <Link to={`/${language}/docs/woltflow-extension`}>
                    <div className="w-full">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">
                            {t("activationGuide.step1.extensionMethod.title")}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs w-fit">
                          {t("activationGuide.step1.extensionMethod.badge")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {t("activationGuide.step1.extensionMethod.description")}
                      </p>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-2 sm:p-4 justify-start w-full"
                >
                  <Link to={`/${language}/docs/manual-setup`}>
                    <div className="w-full">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">
                            {t("activationGuide.step1.manualMethod.title")}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {t("activationGuide.step1.manualMethod.badge")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {t("activationGuide.step1.manualMethod.description")}
                      </p>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("activationGuide.step2.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("activationGuide.step2.description")}
              </p>

              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  {t("activationGuide.step2.quickTip.title")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("activationGuide.step2.quickTip.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("activationGuide.step3.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("activationGuide.step3.description")}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      {t("activationGuide.step3.sms.title")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("activationGuide.step3.sms.description")}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Link to={`/${language}/docs/sms-forwarding`}>
                      {t("activationGuide.step3.sms.button")}
                    </Link>
                  </Button>
                </div>

                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      {t("activationGuide.step3.email.title")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("activationGuide.step3.email.description")}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Link to={`/${language}/docs/email-forwarding`}>
                      {t("activationGuide.step3.email.button")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("activationGuide.step4.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("activationGuide.step4.description")}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("activationGuide.step4.settings.automationMode")}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("activationGuide.step4.settings.giftCardAmount")}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    {t("activationGuide.step4.settings.enableToggle")}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {t("activationGuide.step4.allSet.title")}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {t("activationGuide.step4.allSet.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">{t("readyToBegin.title")}</h3>
        <p className="text-muted-foreground">{t("readyToBegin.description")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to={`/${language}/docs/woltflow-extension`}>
              {t("readyToBegin.buttons.startWithExtension")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to={`/${language}/docs/manual-setup`}>
              {t("readyToBegin.buttons.manualSetup")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
