import Layout from "@/components/shared/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

// Configuration object for easy editing
const TERMS_CONFIG = {
  serviceName: "WoltFlow",
  effectiveDate: "04/09/2025",
  contactEmail: "shalev396@gmail.com",
  ownerOperator: "Shalev Ben-Moshe (individual, side-project)",
  territory: `AWS, primary region ${import.meta.env.VITE_AWS_REGION} (${
    import.meta.env.VITE_AWS_REGION_CITY
  })`,
  productName: "WoltFlow",
  productDescription:
    "automation that buys Wolt gift credit using a user's Cibus meal benefit and applies it to the user's Wolt account",
};

export default function TermsOfService() {
  const { t } = useTranslation("legal/terms");

  return (
    <Layout title={t("title")} description={t("description")}>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {t("sections.serviceInfo.title")}
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>{t("sections.serviceInfo.serviceName")}</strong>{" "}
                  {TERMS_CONFIG.serviceName}
                </p>
                <p>
                  <strong>{t("sections.serviceInfo.owner")}</strong>{" "}
                  {TERMS_CONFIG.ownerOperator}
                </p>
                <p>
                  <strong>{t("sections.serviceInfo.territory")}</strong>{" "}
                  {TERMS_CONFIG.territory}
                </p>
                <p>
                  <strong>{t("sections.serviceInfo.product")}</strong> "
                  {TERMS_CONFIG.productName}" –{" "}
                  {TERMS_CONFIG.productDescription}
                </p>
                <p className="text-sm">
                  <strong>{t("sections.serviceInfo.effectiveDate")}</strong>{" "}
                  {TERMS_CONFIG.effectiveDate}
                </p>
              </div>
            </section>

            <div className="space-y-8">
              {/* 1) Acceptance of the Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.acceptance.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.acceptance.description", {
                    serviceName: TERMS_CONFIG.serviceName,
                  })}
                </p>
              </section>

              <Separator />

              {/* 2) What the Service Does */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.whatService.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.whatService.p1")}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {t("sections.whatService.p2")}
                </p>
              </section>

              <Separator />

              {/* 3) Your Account; Eligibility */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.account.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a)</strong> {t("sections.account.a")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b)</strong> {t("sections.account.b")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c)</strong> {t("sections.account.c")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* 4) Initial Setup & Your Inputs */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.setup.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) {t("sections.setup.a.title")}</strong>{" "}
                    {t("sections.setup.a.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) {t("sections.setup.b.title")}</strong>{" "}
                    {t("sections.setup.b.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c) {t("sections.setup.c.title")}</strong>{" "}
                    {t("sections.setup.c.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>d) {t("sections.setup.d.title")}</strong>{" "}
                    {t("sections.setup.d.description")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* 5) Third-Party Services */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.thirdParty.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.thirdParty.description")}
                </p>
              </section>

              <Separator />

              {/* 6) Permitted Use; Prohibited Activities */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.permitted.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) {t("sections.permitted.a.title")}</strong>{" "}
                    {t("sections.permitted.a.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) {t("sections.permitted.b.title")}</strong>{" "}
                    {t("sections.permitted.b.description")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {(
                      t("sections.permitted.b.items", {
                        returnObjects: true,
                      }) as string[]
                    ).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("sections.permitted.b.footer")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* 7) Running the Automation */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.running.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a)</strong> {t("sections.running.a")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b)</strong> {t("sections.running.b")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c)</strong> {t("sections.running.c")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* 8) Payments, Fees, Taxes */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.payments.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a)</strong> {t("sections.payments.a")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b)</strong> {t("sections.payments.b")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* 9) Risk Allocation & Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.risk.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t("sections.risk.intro")}
                </p>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) {t("sections.risk.a.title")}</strong>{" "}
                    {t("sections.risk.a.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) {t("sections.risk.b.title")}</strong>{" "}
                    {t("sections.risk.b.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c) {t("sections.risk.c.title")}</strong>{" "}
                    {t("sections.risk.c.description")}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {(
                      t("sections.risk.c.items", {
                        returnObjects: true,
                      }) as string[]
                    ).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>d) {t("sections.risk.d.title")}</strong>{" "}
                    {t("sections.risk.d.description")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* 10) Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.liability.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.liability.p1")}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {t("sections.liability.p2")}
                </p>
              </section>

              <Separator />

              {/* 11) Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.indemnification.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.indemnification.description")}
                </p>
              </section>

              <Separator />

              {/* 12) Privacy */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.privacy.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.privacy.description")}
                </p>
              </section>

              <Separator />

              {/* 13) Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.ip.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.ip.description")}
                </p>
              </section>

              <Separator />

              {/* 14) Suspension; Termination */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.termination.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.termination.description")}
                </p>
              </section>

              <Separator />

              {/* 15) Changes to the Service or Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.changes.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.changes.description")}
                </p>
              </section>

              <Separator />

              {/* 16) Governing Law; Venue */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.governing.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("sections.governing.description")}
                </p>
              </section>

              <Separator />

              {/* 17) Miscellaneous */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  {t("sections.misc.title")}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) {t("sections.misc.a.title")}</strong>{" "}
                    {t("sections.misc.a.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) {t("sections.misc.b.title")}</strong>{" "}
                    {t("sections.misc.b.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c) {t("sections.misc.c.title")}</strong>{" "}
                    {t("sections.misc.c.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>d) {t("sections.misc.d.title")}</strong>{" "}
                    {t("sections.misc.d.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>e) {t("sections.misc.e.title")}</strong>{" "}
                    {t("sections.misc.e.description")}
                  </p>
                </div>
              </section>

              <Separator />

              {/* Contact section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  {t("sections.questions.title")}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t("sections.questions.description")}
                </p>
                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={`mailto:${TERMS_CONFIG.contactEmail}`}
                    className="font-medium break-all"
                    aria-label="Email Shalev Ben-Moshe"
                  >
                    {TERMS_CONFIG.contactEmail}
                  </a>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
