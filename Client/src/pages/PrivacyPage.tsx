import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import Layout from "@/components/shared/Layout";
import { useTranslation } from "react-i18next";

const PRIVACY_POLICY_CONFIG = {
  lastUpdated: "04/09/2025",
  contactEmail: "shalev396@gmail.com",
  ownerOperator: "Shalev Ben-Moshe (individual, side-project)",
  territory: "AWS, primary region il-central-1 (Tel Aviv)",
  productName: "WoltFlow",
};

// Helper function to safely render translation arrays
const renderTranslationArray = (
  t: (key: string, options?: { returnObjects: boolean }) => unknown,
  key: string
): React.ReactElement[] => {
  const items = t(key, { returnObjects: true });
  if (Array.isArray(items)) {
    return items.map((item: string, idx: number) => <li key={idx}>{item}</li>);
  }
  return [];
};

export default function PrivacyPage() {
  const { t } = useTranslation("legal/privacy");
  const region = "il-central-1";
  const city = "Tel Aviv";

  // Section counter for numbering
  let sectionNumber = 0;
  const getNextSection = () => ++sectionNumber;

  return (
    <Layout title={t("title")} description={t("description")}>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="space-y-8 pt-6">
            {/* Last Updated */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
              <p className="text-muted-foreground">
                {t("lastUpdated")}: {PRIVACY_POLICY_CONFIG.lastUpdated}
              </p>
            </div>

            {/* Who We Are */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                §{getNextSection()}. {t("sections.whoWeAre.title")}
              </h2>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p>
                  <strong>{t("sections.whoWeAre.owner")}</strong>{" "}
                  {PRIVACY_POLICY_CONFIG.ownerOperator}
                </p>
                <p>
                  <strong>{t("sections.whoWeAre.territory")}</strong>{" "}
                  {PRIVACY_POLICY_CONFIG.territory}
                </p>
                <p>
                  <strong>{t("sections.whoWeAre.product")}</strong>{" "}
                  {PRIVACY_POLICY_CONFIG.productName}
                </p>
                <p className="text-sm">
                  <strong>{t("sections.whoWeAre.lastUpdated")}</strong>{" "}
                  {PRIVACY_POLICY_CONFIG.lastUpdated}
                </p>
              </div>
            </section>

            <Separator />

            {/* Introduction */}
            <section>
              <p className="text-muted-foreground leading-relaxed">
                {t("sections.introduction")}
              </p>
            </section>

            <Separator />

            {/* What Data We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.whatData.title")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("sections.whatData.intro")}
              </p>

              <div className="space-y-6">
                {/* Authentication & Account */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("sections.whatData.auth.title")}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.auth.user.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.auth.user.items"
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.auth.session.title")}
                      </h4>
                      <p className="text-muted-foreground text-sm pl-6">
                        {t("sections.whatData.auth.session.description")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wolt & Cibus credentials */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("sections.whatData.credentials.title")}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.credentials.wolt.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.credentials.wolt.items"
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.credentials.cibus.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.credentials.cibus.items"
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* One-time codes */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("sections.whatData.codes.title")}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.codes.cibus2fa.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.codes.cibus2fa.items"
                        )}
                      </ul>
                      <p className="text-muted-foreground text-sm pl-6 mt-2">
                        {t("sections.whatData.codes.cibus2fa.source")}
                      </p>
                      <p className="text-muted-foreground text-sm pl-6">
                        {t("sections.whatData.codes.cibus2fa.retention")}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.codes.twoFactor.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.codes.twoFactor.items"
                        )}
                      </ul>
                      <p className="text-muted-foreground text-sm pl-6 mt-2">
                        {t("sections.whatData.codes.twoFactor.retention")}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.codes.code.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.codes.code.items"
                        )}
                      </ul>
                      <p className="text-muted-foreground text-sm pl-6 mt-2">
                        {t("sections.whatData.codes.code.retention")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email ingestion */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("sections.whatData.email.title")}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.email.inbox.title")}
                      </h4>
                      <p className="text-muted-foreground text-sm pl-6">
                        {t("sections.whatData.email.inbox.description")}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.email.emails.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.email.emails.items"
                        )}
                      </ul>
                      <p className="text-muted-foreground text-sm pl-6 mt-2">
                        {t("sections.whatData.email.emails.flow")}
                      </p>
                      <p className="text-muted-foreground text-sm pl-6">
                        {t("sections.whatData.email.emails.retention")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Automation runs */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("sections.whatData.runs.title")}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.runs.runSettings.title")}
                      </h4>
                      <p className="text-muted-foreground text-sm pl-6">
                        {t("sections.whatData.runs.runSettings.description")}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.runs.run.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.runs.run.items"
                        )}
                      </ul>
                      <p className="text-muted-foreground text-sm pl-6 mt-2">
                        {t("sections.whatData.runs.run.purpose")}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        {t("sections.whatData.runs.screenshot.title")}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {renderTranslationArray(
                          t,
                          "sections.whatData.runs.screenshot.items"
                        )}
                      </ul>
                      <p className="text-muted-foreground text-sm pl-6 mt-2">
                        {t("sections.whatData.runs.screenshot.purpose")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("sections.whatData.notifications.title")}
                  </h3>
                  <div>
                    <h4 className="font-medium mb-2">
                      {t("sections.whatData.notifications.settings.title")}
                    </h4>
                    <p className="text-muted-foreground text-sm pl-6">
                      {t(
                        "sections.whatData.notifications.settings.description"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Why We Collect It */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.whyCollect.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.whyCollect.service.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.whyCollect.service.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.whyCollect.operate.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.whyCollect.operate.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.whyCollect.security.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.whyCollect.security.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.whyCollect.analytics.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.whyCollect.analytics.description")}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm italic mt-4">
                  {t("sections.whyCollect.legalBasis")}
                </p>
              </div>
            </section>

            <Separator />

            {/* Where We Process & Store */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.whereProcess.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.whereProcess.primary.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.whereProcess.primary.description", {
                      region,
                      city,
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.whereProcess.global.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.whereProcess.global.description", {
                      region,
                    })}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm italic">
                  {t("sections.whereProcess.dataMovement", { region })}
                </p>
              </div>
            </section>

            <Separator />

            {/* Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.security.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.security.appLevel.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.security.appLevel.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.security.transport.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.security.transport.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.security.atRest.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.security.atRest.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.security.access.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.security.access.description")}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Retention */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.retention.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.retention.oneTime.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.retention.oneTime.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.retention.operational.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.retention.operational.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.retention.emails.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.retention.emails.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.retention.logs.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.retention.logs.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.retention.account.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.retention.account.description")}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm italic mt-4">
                  {t("sections.retention.deletion")}
                </p>
              </div>
            </section>

            <Separator />

            {/* Your Controls */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.controls.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.controls.signIn.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.controls.signIn.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.controls.delete.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.controls.delete.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.controls.edit.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.controls.edit.description")}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Cookies & Analytics */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.cookies.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.cookies.authToken.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.cookies.authToken.description")}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.cookies.analytics.title")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("sections.cookies.analytics.description")}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Third-party Services */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.thirdParty.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("sections.thirdParty.intro")}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.thirdParty.aws.title")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    {renderTranslationArray(t, "sections.thirdParty.aws.items")}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("sections.thirdParty.analytics.title")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                    {renderTranslationArray(
                      t,
                      "sections.thirdParty.analytics.items"
                    )}
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.sharing.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("sections.sharing.intro")}
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                {renderTranslationArray(t, "sections.sharing.items")}
              </ul>
            </section>

            <Separator />

            {/* Children */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.children.title")}
              </h2>
              <p className="text-muted-foreground">
                {t("sections.children.description", {
                  productName: PRIVACY_POLICY_CONFIG.productName,
                })}
              </p>
            </section>

            <Separator />

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                §{getNextSection()}. {t("sections.changes.title")}
              </h2>
              <p className="text-muted-foreground mb-2">
                {t("sections.changes.description")}
              </p>
              <p className="text-muted-foreground text-sm italic">
                {t("sections.changes.lastUpdated", {
                  date: PRIVACY_POLICY_CONFIG.lastUpdated,
                })}
              </p>
            </section>

            <Separator />

            {/* Questions */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                §{getNextSection()}. {t("sections.questions.title")}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t("sections.questions.description")}
              </p>
              <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`mailto:${PRIVACY_POLICY_CONFIG.contactEmail}`}
                  className="font-medium break-all"
                  aria-label="Email Shalev Ben-Moshe"
                >
                  {PRIVACY_POLICY_CONFIG.contactEmail}
                </a>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
