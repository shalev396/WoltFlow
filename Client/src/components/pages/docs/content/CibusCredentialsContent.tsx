import {
  CreditCard,
  CheckCircle,
  Info,
  User,
  Lock,
  Building,
  Settings,
  Shield,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

export function CibusCredentialsContent() {
  const { language } = useLanguage();
  const { t } = useTranslation("docs/cibusCredentials");

  return (
    <section id="cibus-credentials" className="space-y-8">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{t("badges.required")}</Badge>
            <Badge variant="outline">{t("badges.accountSetup")}</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>{t("description")}</p>
      </div>

      <div id="what-is-cibus" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("whatIsCibus.title")}</h2>

        <p className="text-muted-foreground leading-relaxed">
          {t("whatIsCibus.description")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <CreditCard className="h-5 w-5" />
                {t("whatIsCibus.whatWoltFlowDoes.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(
                  t("whatIsCibus.whatWoltFlowDoes.features", {
                    returnObjects: true,
                  }) as string[]
                ).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <Shield className="h-5 w-5" />
                {t("whatIsCibus.securityPrivacy.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(
                  t("whatIsCibus.securityPrivacy.features", {
                    returnObjects: true,
                  }) as string[]
                ).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="required-credentials" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          {t("requiredCredentials.title")}
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          {t("requiredCredentials.description")}
        </p>

        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                {t("requiredCredentials.username.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("requiredCredentials.username.description")}
                </p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-1">
                    {t("requiredCredentials.username.exampleLabel")}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {(
                      t("requiredCredentials.username.examples", {
                        returnObjects: true,
                      }) as string[]
                    ).map((example, idx) => (
                      <li key={idx}>• {example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-orange-600" />
                {t("requiredCredentials.password.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("requiredCredentials.password.description")}
                </p>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                        {t("requiredCredentials.password.securityTitle")}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        {t("requiredCredentials.password.securityNote")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-purple-600" />
                {t("requiredCredentials.companyName.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("requiredCredentials.companyName.description")}
                </p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-2">
                    {t("requiredCredentials.companyName.tipsLabel")}
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    {(
                      t("requiredCredentials.companyName.tips", {
                        returnObjects: true,
                      }) as string[]
                    ).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="setup-instructions" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          {t("setupInstructions.title")}
        </h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("setupInstructions.step1.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("setupInstructions.step1.description")}
              </p>

              <Button asChild className="inline-flex">
                <Link to={`/${language}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t("setupInstructions.step1.buttonText")}
                </Link>
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("setupInstructions.step2.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("setupInstructions.step2.description")}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("setupInstructions.step3.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("setupInstructions.step3.description")}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("setupInstructions.step3.fields.username")}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("setupInstructions.step3.fields.password")}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("setupInstructions.step3.fields.companyName")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                {t("setupInstructions.step4.title")}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                {t("setupInstructions.step4.description")}
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {t("setupInstructions.step4.testTitle")}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t("setupInstructions.step4.testDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="cibus-2fa" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("twoFactorAuth.title")}</h2>

        <p className="text-muted-foreground leading-relaxed">
          {t("twoFactorAuth.description")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {t("twoFactorAuth.smsSupport.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(
                  t("twoFactorAuth.smsSupport.features", {
                    returnObjects: true,
                  }) as string[]
                ).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("twoFactorAuth.setupRequirements.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                {(
                  t("twoFactorAuth.setupRequirements.steps", {
                    returnObjects: true,
                  }) as string[]
                ).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/${language}/docs/sms-forwarding`}>
                    {t("twoFactorAuth.setupRequirements.buttonText")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                {t("twoFactorAuth.seamlessIntegration.title")}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                {t("twoFactorAuth.seamlessIntegration.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="troubleshooting" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">{t("troubleshooting.title")}</h2>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                {t("troubleshooting.commonIssues.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-2">
                    {t("troubleshooting.commonIssues.invalidCredentials.title")}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    {(
                      t(
                        "troubleshooting.commonIssues.invalidCredentials.solutions",
                        { returnObjects: true }
                      ) as string[]
                    ).map((solution, idx) => (
                      <li key={idx}>{solution}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">
                    {t("troubleshooting.commonIssues.twoFACodes.title")}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    {(
                      t("troubleshooting.commonIssues.twoFACodes.solutions", {
                        returnObjects: true,
                      }) as string[]
                    ).map((solution, idx) => (
                      <li key={idx}>{solution}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">
                    {t("troubleshooting.commonIssues.companyNotFound.title")}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    {(
                      t(
                        "troubleshooting.commonIssues.companyNotFound.solutions",
                        { returnObjects: true }
                      ) as string[]
                    ).map((solution, idx) => (
                      <li key={idx}>{solution}</li>
                    ))}
                  </ul>
                </div>
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
              {t("conclusion.title")}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              {t("conclusion.description")}
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm">
                <Link to={`/${language}/docs/getting-started`}>
                  {t("conclusion.continueButton")}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={`/${language}/docs/sms-forwarding`}>
                  {t("conclusion.setupSmsButton")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
