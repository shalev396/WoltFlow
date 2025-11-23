import {
  MessageCircle,
  Smartphone,
  Shield,
  Code,
  AlertCircle,
  CheckCircle,
  Apple,
  Settings,
  Zap,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

export function SmsForwardingContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/smsForwarding");

  return (
    <section id="sms-forwarding" className="space-y-8">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              {t("whyNeeded.title")}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              {t("whyNeeded.description")}
            </p>
          </div>
        </div>
      </div>

      <div id="sms-api-setup" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("apiSetup.title")}</h2>

        {/* Android Compatibility Notice */}
        <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                {t("apiSetup.androidNotice.title")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                {t("apiSetup.androidNotice.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold">
              {t("apiSetup.developerInfo.title")}
            </h3>
          </div>

          <p className="text-muted-foreground mb-4">
            {t("apiSetup.developerInfo.description")}
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                {t("apiSetup.endpointUrl.title")}
              </h4>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <code className="text-xs sm:text-sm font-mono break-all">
                  POST https://woltflow.shalev396.com/api/forward/sms
                </code>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">{t("apiSetup.headers.title")}</h4>
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  Recommended
                </Badge>
              </div>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <code className="text-xs sm:text-sm text-muted-foreground font-mono break-all">
                  X-API-Key: your-api-key-here
                </code>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">
                  {t("apiSetup.queryParams.title")}
                </h4>
                <Badge variant="outline" className="text-xs">
                  Android
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {t("apiSetup.queryParams.description")}
              </p>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <code className="text-xs sm:text-sm text-muted-foreground font-mono break-all">
                  POST
                  https://woltflow.shalev396.com/api/forward/sms?apiKey=your-api-key-here
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                {t("apiSetup.requestBody.title")}
              </h4>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <pre className="text-xs sm:text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                  {`{
  "message": "Your verification code is: 123456"
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                {t("apiSetup.authentication.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("apiSetup.authentication.description", {
                  code: t("apiSetup.authentication.code"),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="android-setup" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("androidSetup.title")}</h2>

        <p className="text-muted-foreground">{t("androidSetup.description")}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-purple-100 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl text-purple-700 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 flex-shrink-0" />
                  <span className="break-words">
                    {t("androidSetup.official.title")}
                  </span>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-xs w-fit">
                  {t("androidSetup.official.badge")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("androidSetup.official.description")}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {t("androidSetup.official.features.title")}
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {(
                      t("androidSetup.official.features.list", {
                        returnObjects: true,
                      }) as string[]
                    ).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-purple-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled
                >
                  {t("androidSetup.official.button")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                {t("androidSetup.alternative.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">
                    {t("androidSetup.alternative.smsForwarder.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("androidSetup.alternative.smsForwarder.description")}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {t("androidSetup.alternative.smsForwarder.badge")}
                  </Badge>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">
                    {t("androidSetup.alternative.automate.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t("androidSetup.alternative.automate.description")}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {t("androidSetup.alternative.automate.badge")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="ios-setup" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("iosSetup.title")}</h2>

        <p className="text-muted-foreground">{t("iosSetup.description")}</p>

        <Card className="border-2 border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-gray-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-gray-600" />
              {t("iosSetup.shortcuts.title")}
              <Badge variant="secondary">{t("iosSetup.shortcuts.badge")}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {t("iosSetup.shortcuts.description")}
              </p>

              <div className="space-y-4">
                <h4 className="font-medium">
                  {t("iosSetup.shortcuts.stepsTitle")}
                </h4>

                <div className="space-y-3">
                  {(
                    t("iosSetup.shortcuts.steps", {
                      returnObjects: true,
                    }) as Array<{
                      title: string;
                      description: string;
                      details?: {
                        url: string;
                        method: string;
                        headers: string;
                        requestBody: string;
                        bodyContent: string;
                      };
                    }>
                  ).map((step, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium break-words">{step.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        {step.details && (
                          <div className="text-xs sm:text-sm text-muted-foreground space-y-2 mt-2">
                            <div>
                              <p className="font-medium mb-1">
                                {step.details.url}
                              </p>
                              <code className="bg-muted px-1 py-0.5 rounded text-xs break-all block">
                                https://woltflow.shalev396.com/api/forward/sms
                              </code>
                            </div>
                            <p>
                              <strong>{step.details.method}</strong>
                            </p>
                            <p>
                              <strong>{step.details.headers}</strong>
                            </p>
                            <p>
                              <strong>{step.details.requestBody}</strong>
                            </p>
                            <div>
                              <p className="font-medium mb-1">
                                {step.details.bodyContent}
                              </p>
                              <code className="bg-muted px-1 py-0.5 rounded text-xs break-all block">
                                {
                                  '{ "message": "[Message Content from trigger]" }'
                                }
                              </code>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                        {t("iosSetup.shortcuts.limitations.title")}
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        {t("iosSetup.shortcuts.limitations.description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              {t("iosSetup.alternatives.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">
                  {t("iosSetup.alternatives.dualDevice.title")}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {t("iosSetup.alternatives.dualDevice.description")}
                </p>
                <Badge variant="outline" className="text-xs">
                  {t("iosSetup.alternatives.dualDevice.badge")}
                </Badge>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">
                  {t("iosSetup.alternatives.email2fa.title")}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {t("iosSetup.alternatives.email2fa.description")}
                </p>
                <Badge variant="outline" className="text-xs">
                  {t("iosSetup.alternatives.email2fa.badge")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("testing.title")}</h2>

        <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                {t("testing.verify.title")}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                {t("testing.verify.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t("testing.complete.description")}
          </p>
          <div className="flex justify-center">
            <Button asChild size="sm" className="max-w-xs">
              <Link to={`/${language}/docs/email-forwarding`}>
                <span className="text-xs sm:text-sm">
                  {t("testing.complete.button")}
                </span>
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
