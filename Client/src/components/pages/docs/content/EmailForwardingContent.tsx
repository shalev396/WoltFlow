import {
  Mail,
  Settings,
  CheckCircle,
  Info,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

export function EmailForwardingContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/emailForwarding");

  return (
    <section id="email-forwarding" className="space-y-8">
      <div className="flex items-center gap-3">
        <Mail className="h-8 w-8 text-green-600" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              {t("howItWorks.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {t("howItWorks.description")}
            </p>
          </div>
        </div>
      </div>

      <div id="gmail-forwarding" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("gmailForwarding.title")}</h2>

        <p className="text-muted-foreground">
          {t("gmailForwarding.description")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span className="break-words">
                    {t("gmailForwarding.nativeGmailForwarding.title")}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("gmailForwarding.nativeGmailForwarding.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    {t("gmailForwarding.nativeGmailForwarding.benefitsTitle")}
                  </h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                    {(
                      t("gmailForwarding.nativeGmailForwarding.benefits", {
                        returnObjects: true,
                      }) as string[]
                    ).map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <span className="break-words">
                  {t("gmailForwarding.yourWoltFlowInbox.title")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("gmailForwarding.yourWoltFlowInbox.description")}
                </p>

                <div className="p-2 sm:p-3 bg-muted rounded-lg overflow-hidden">
                  <div className="flex items-start gap-2 mb-2">
                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="font-mono text-xs text-muted-foreground break-all">
                      [your-unique-id]@users.woltflow.shalev396.com
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("gmailForwarding.yourWoltFlowInbox.addressNote")}
                  </p>
                </div>

                <Button asChild size="sm" className="w-full">
                  <Link to={`/${language}/inbox`}>
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">
                      {t("gmailForwarding.yourWoltFlowInbox.viewInboxButton")}
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">
            {t("gmailForwarding.stepByStepTitle")}
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  {t("gmailForwarding.steps.1.title")}
                </h4>
                <p className="text-muted-foreground">
                  {t("gmailForwarding.steps.1.description")}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://mail.google.com/mail/u/0/#settings/general"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t("gmailForwarding.steps.1.button")}
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  {t("gmailForwarding.steps.2.title")}
                </h4>
                <p className="text-muted-foreground">
                  {t("gmailForwarding.steps.2.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  {t("gmailForwarding.steps.3.title")}
                </h4>
                <p className="text-muted-foreground">
                  {t("gmailForwarding.steps.3.description")}
                </p>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t("gmailForwarding.steps.3.note")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  {t("gmailForwarding.steps.4.title")}
                </h4>
                <p className="text-muted-foreground">
                  {t("gmailForwarding.steps.4.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  {t("gmailForwarding.steps.5.title")}
                </h4>
                <p className="text-muted-foreground">
                  {t("gmailForwarding.steps.5.description")}
                </p>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t("gmailForwarding.steps.5.recommendation")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="email-filters" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("emailFilters.title")}</h2>

        <p className="text-muted-foreground">{t("emailFilters.description")}</p>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {t("emailFilters.creatingFilterTitle")}
          </h3>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">{t("emailFilters.steps.1.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("emailFilters.steps.1.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">{t("emailFilters.steps.2.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("emailFilters.steps.2.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">{t("emailFilters.steps.3.title")}</p>
                <div className="mt-2 space-y-2">
                  <div className="p-2 bg-background border rounded text-sm">
                    <strong>{t("emailFilters.steps.3.from")}</strong>{" "}
                    {t("emailFilters.steps.3.fromValue")}
                  </div>
                  <div className="p-2 bg-background border rounded text-sm">
                    <strong>{t("emailFilters.steps.3.subject")}</strong>{" "}
                    {t("emailFilters.steps.3.subjectValue")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">{t("emailFilters.steps.4.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("emailFilters.steps.4.description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                {t("emailFilters.importantWarning.title")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                {t("emailFilters.importantWarning.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="other-providers" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("otherProviders.title")}</h2>

        <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t("otherProviders.gmailRecommended.title")}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                {t("otherProviders.gmailRecommended.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                {t("otherProviders.outlook.title")}
                <Badge variant="secondary">
                  {t("otherProviders.outlook.badge")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("otherProviders.outlook.description")}
                </p>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {t("otherProviders.outlook.note")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                {t("otherProviders.otherProvidersCard.title")}
                <Badge variant="outline">
                  {t("otherProviders.otherProvidersCard.badge")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("otherProviders.otherProvidersCard.description")}
                </p>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {t("otherProviders.otherProvidersCard.note")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              {t("complete.title")}
            </p>
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 leading-relaxed break-words">
              {t("complete.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-3 max-w-full">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link to={`/${language}/inbox`}>
                  <span className="text-xs sm:text-sm">
                    {t("complete.viewInboxButton")}
                  </span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 flex-shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Link to={`/${language}/docs/getting-started#activation-guide`}>
                  <span className="text-xs sm:text-sm">
                    {t("complete.completeSetupButton")}
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
