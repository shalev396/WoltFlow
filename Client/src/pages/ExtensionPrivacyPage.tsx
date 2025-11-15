import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/shared/Layout";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

const EXTENSION_PRIVACY_POLICY_CONFIG = {
  lastUpdated: "04/09/2025",
  contactEmail: "shalev396@gmail.com",
  extensionDeveloper: "Shalev Ben-Moshe (individual, side-project)",
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

export default function ExtensionPrivacyPage() {
  const { language } = useLanguage();
  const { t } = useTranslation("legal/extensionPrivacy");

  // Section counter for numbering
  let sectionNumber = 0;
  const getNextSection = () => ++sectionNumber;

  return (
    <Layout title={t("title")} description={t("description")}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="space-y-8 pt-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">
              {t("lastUpdated")} {EXTENSION_PRIVACY_POLICY_CONFIG.lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.introduction.title")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("sections.introduction.description")}
            </p>
          </section>

          <Separator />

          {/* What the Extension Does */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.whatDoes.title")}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.whatDoes.tokenDisplay.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.whatDoes.tokenDisplay.items"
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.whatDoes.permissions.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.whatDoes.permissions.items"
                  )}
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Data Handling */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.dataHandling.title")}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.dataHandling.access.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.dataHandling.access.items"
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.dataHandling.storage.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.dataHandling.storage.items"
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.dataHandling.transmission.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.dataHandling.transmission.items"
                  )}
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Security Measures */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.security.title")}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.security.extension.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.security.extension.items"
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.security.protection.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.security.protection.items"
                  )}
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.rights.title")}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.rights.control.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(t, "sections.rights.control.items")}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.rights.data.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(t, "sections.rights.data.items")}
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.thirdParty.title")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("sections.thirdParty.intro")}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("sections.thirdParty.cookieAccess.title")}
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {renderTranslationArray(
                    t,
                    "sections.thirdParty.cookieAccess.items"
                  )}
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.contact.title")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("sections.contact.intro")}
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p>
                <strong>{t("sections.contact.developer")}</strong>{" "}
                {EXTENSION_PRIVACY_POLICY_CONFIG.extensionDeveloper}
              </p>
              <p>
                <strong>{t("sections.contact.email")}</strong>{" "}
                {EXTENSION_PRIVACY_POLICY_CONFIG.contactEmail}
              </p>
              <p>
                <strong>{t("sections.contact.website")}</strong>{" "}
                <a
                  href="https://www.shalev396.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                >
                  www.shalev396.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            <p className="text-muted-foreground text-sm mt-4">
              {t("sections.contact.mainPolicy")}{" "}
              <Link
                to={`/${language}/legal/privacy-policy`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {t("sections.contact.mainPolicyLink")}
              </Link>
              .
            </p>
          </section>

          <Separator />

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.updates.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("sections.updates.description")}
            </p>
          </section>

          <Separator />

          {/* Effective Date */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              §{getNextSection()}. {t("sections.effective.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("sections.effective.p1", {
                date: EXTENSION_PRIVACY_POLICY_CONFIG.lastUpdated,
              })}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("sections.effective.p2")}
            </p>
          </section>
        </CardContent>
      </Card>
    </Layout>
  );
}
