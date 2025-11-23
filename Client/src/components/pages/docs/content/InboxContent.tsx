import {
  Inbox,
  Shield,
  Mail,
  Download,
  Search,
  CheckCircle,
  Info,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";
import { safeTranslationArray } from "@/utils/translationHelpers";

export function InboxContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/inbox");

  return (
    <section id="inbox" className="space-y-8">
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-purple-600" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div className="p-3 sm:p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
        <div className="flex items-start gap-3">
          <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              {t("personalEmailAddress.title")}
            </p>
            <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 leading-relaxed break-words mb-3">
              {t("personalEmailAddress.description")}
            </p>
            <div className="p-2 sm:p-3 bg-purple-100/70 dark:bg-purple-900/30 rounded border overflow-x-auto">
              <code className="text-xs font-mono text-purple-800 dark:text-purple-200 break-all block">
                [your-unique-id]@users.woltflow.shalev396.com
              </code>
            </div>
            <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 leading-relaxed break-words mt-2">
              {t("personalEmailAddress.note")}
            </p>
          </div>
        </div>
      </div>

      <div id="inbox-overview" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("howItWorks.title")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Mail className="h-5 w-5" />
                {t("howItWorks.emailReception.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("howItWorks.emailReception.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("howItWorks.emailReception.emailContentTitle")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {safeTranslationArray<string>(
                      t("howItWorks.emailReception.emailContent", {
                        returnObjects: true,
                      })
                    ).map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                {t("howItWorks.automaticProcessing.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("howItWorks.automaticProcessing.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("howItWorks.automaticProcessing.autoProcessingTitle")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {safeTranslationArray<string>(
                      t("howItWorks.automaticProcessing.autoProcessing", {
                        returnObjects: true,
                      })
                    ).map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {t("howItWorks.processingFlow.title")}
          </h3>

          <div className="space-y-3">
            {safeTranslationArray<{ title: string; description: string }>(
              t("howItWorks.processingFlow.steps", {
                returnObjects: true,
              })
            ).map((step, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg"
              >
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="managing-emails" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("managingEmails.title")}</h2>

        <p className="text-muted-foreground">
          {t("managingEmails.description")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                {t("managingEmails.inboxFeatures.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {safeTranslationArray<string>(
                    t("managingEmails.inboxFeatures.features", {
                      returnObjects: true,
                    })
                  ).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                {t("managingEmails.searchFilter.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {safeTranslationArray<string>(
                    t("managingEmails.searchFilter.features", {
                      returnObjects: true,
                    })
                  ).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {t("managingEmails.attachmentHandling.title")}
          </h3>

          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {t("managingEmails.attachmentHandling.secureDownloads.title")}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  {t(
                    "managingEmails.attachmentHandling.secureDownloads.description"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {safeTranslationArray<{
              type: string;
              title: string;
              description: string;
            }>(
              t("managingEmails.attachmentHandling.attachmentTypes", {
                returnObjects: true,
              })
            ).map((attachment, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {attachment.type}
                  </Badge>
                  {attachment.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {attachment.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to={`/${language}/inbox`}>
            <Inbox className="h-4 w-4 mr-2" />
            {t("managingEmails.accessInboxButton")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div id="inbox-privacy" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("privacySecurity.title")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-100 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-red-700 dark:text-red-300">
                <Shield className="h-5 w-5" />
                {t("privacySecurity.dataIsolation.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("privacySecurity.dataIsolation.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("privacySecurity.dataIsolation.securityMeasuresTitle")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {safeTranslationArray<string>(
                      t("privacySecurity.dataIsolation.securityMeasures", {
                        returnObjects: true,
                      })
                    ).map((measure, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <Eye className="h-5 w-5" />
                {t("privacySecurity.privacyPolicy.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("privacySecurity.privacyPolicy.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("privacySecurity.privacyPolicy.commitmentsTitle")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {safeTranslationArray<string>(
                      t("privacySecurity.privacyPolicy.commitments", {
                        returnObjects: true,
                      })
                    ).map((commitment, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {commitment}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {t("privacySecurity.dataRetention.title")}
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {safeTranslationArray<{
              period: string;
              title: string;
              description: string;
              color: string;
            }>(
              t("privacySecurity.dataRetention.policies", {
                returnObjects: true,
              })
            ).map((policy, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 border rounded-lg text-center"
              >
                <div
                  className={`text-2xl font-bold text-${policy.color}-600 mb-1`}
                >
                  {policy.period}
                </div>
                <div className="text-sm font-medium mb-2">{policy.title}</div>
                <p className="text-xs text-muted-foreground">
                  {policy.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t("privacySecurity.dataControl.title")}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                {t("privacySecurity.dataControl.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">{t("readyToUse.title")}</h3>
        <p className="text-muted-foreground">{t("readyToUse.description")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to={`/${language}/inbox`}>
              {t("readyToUse.viewInboxButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to={`/${language}/docs/email-forwarding`}>
              {t("readyToUse.setupForwardingButton")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
