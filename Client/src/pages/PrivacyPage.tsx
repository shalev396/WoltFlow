import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import Layout from "@/components/shared/Layout";
// Configuration variables - update these as needed
const POLICY_CONFIG = {
  ownerOperator: "Shalev Ben-Moshe (individual, side-project)",
  territory: `AWS, primary region ${import.meta.env.VITE_AWS_REGION} (${
    import.meta.env.VITE_AWS_REGION_CITY
  })`,
  lastUpdated: "04/09/2025",
  contactEmail: "shalev396@gmail.com",
  productName: "WoltFlow",
  productDescription:
    "automation that buys Wolt gift credit using a user's Cibus meal benefit and applies it to the user's Wolt account",
};

export default function PrivacyPage() {
  return (
    <Layout
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your personal information in compliance with Israeli privacy laws."
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Who We Are</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Owner/Operator:</strong> {POLICY_CONFIG.ownerOperator}
                </p>
                <p>
                  <strong>Territory & Hosting:</strong>{" "}
                  {POLICY_CONFIG.territory}
                </p>
                <p>
                  <strong>Product:</strong> "{POLICY_CONFIG.productName}" –{" "}
                  {POLICY_CONFIG.productDescription}
                </p>
                <p className="text-sm">
                  <strong>Last Updated:</strong> {POLICY_CONFIG.lastUpdated}
                </p>
              </div>
            </section>

            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <p className="text-muted-foreground leading-relaxed">
                  This policy explains what we collect, why we collect it, where
                  it's stored, how long we keep it, who we share it with, and
                  how you can control it. It is written to meet Israeli privacy
                  law requirements, including the transparency duties introduced
                  with Amendment 13 to the Privacy Protection Law and the
                  data-security regulations ("תקנות אבטחת מידע").
                </p>
              </section>

              <Separator />

              {/* 1) What data we collect */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  1) What Data We Collect (by data model)
                </h2>

                <p className="text-muted-foreground mb-6">
                  We only collect what's needed to run the automation and
                  optional notifications. Everything marked{" "}
                  <strong>[enc: AES-256]</strong> is encrypted by the
                  application before storage; it is decrypted only inside server
                  code when needed for the automation and never returned to the
                  client.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      A. Authentication & Account
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2">User</h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>
                            googleId (Google OAuth "sub"), name, email (from
                            Google login)
                          </li>
                          <li>googleRefreshToken [enc: AES-256]</li>
                          <li>
                            apiKey (optional; for user-initiated SMS forwarding
                            integrations)
                          </li>
                          <li>Audit: lastLoginAt, createdAt, updatedAt</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Session (cookie)
                        </h4>
                        <p className="text-muted-foreground">
                          First-party session cookie for authentication
                          (access/refresh token or session ID). No third-party
                          ad cookies. Analytics is blocked by default until
                          consent (see §7).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      B. Wolt & Cibus credentials / tokens
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          WoltSettings
                        </h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>woltRefreshToken [enc: AES-256]</li>
                          <li>
                            woltAccessToken [enc: AES-256] (JSON string incl.
                            expiry)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          CibusSettings
                        </h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>cibusUsername [enc: AES-256]</li>
                          <li>cibusPassword [enc: AES-256]</li>
                          <li>cibusCompany [enc: AES-256]</li>
                        </ul>
                        {/* <p className="text-sm text-muted-foreground mt-2 italic">
                          Storage/usage note: these encrypted strings are read
                          by server code, decrypted in-memory on the
                          server/function for the specific run step, used, and
                          not exposed to clients.
                        </p> */}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      C. One-time codes (short-lived)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Cibus2FA (2FA codes Cibus sends to the user's phone)
                        </h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>
                            userId, code (6-digit), message (raw SMS),
                            receivedAt, expiresAt, isUsed, usedAt
                          </li>
                          <li>
                            <strong>Source:</strong> your mobile device forwards
                            the SMS to our API (e.g., iOS Shortcuts/Android SMS
                            forwarder you configure).
                          </li>
                          <li>
                            <strong>Retention:</strong> deleted in daily purge
                            (may be deleted earlier by rolling cleanup).
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          TwoFactorAuthentication (our own verification)
                        </h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>
                            notificationSettingsId, method (sms/email), contact,
                            code, purpose, expiresAt, verified
                          </li>
                          <li>
                            <strong>Retention:</strong> deleted in daily purge
                            (verification codes only).
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          Code (Wolt gift code purchased during a run)
                        </h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>
                            userId, runId (if generated in run), emailId (if
                            extracted from email), code, isUsed
                          </li>
                          <li>
                            <strong>Retention:</strong> deleted in daily purge
                            after use or expiry window.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      D. Email ingestion (for gift code extraction)
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2">Inbox</h4>
                        <p className="text-muted-foreground">
                          userId, emailAddress (unique SES-style recipient
                          assigned per user)
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">Emails</h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>
                            inboxId, s3EmailUrl, attachmentUrls[], fromEmail,
                            fromName, toEmail, toName, subject, body, emailDate
                          </li>
                          <li>
                            <strong>Flow:</strong> messages sent to your
                            assigned recipient address are received by AWS SES →
                            delivered to S3 → processed; we create an Emails
                            record linked to your Inbox.
                          </li>
                          <li>
                            <strong>Retention:</strong> default 90 days (see
                            §5); S3 objects follow the same retention unless
                            required shorter.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      E. Automation runs & artifacts
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-2">
                          RunSettings
                        </h4>
                        <p className="text-muted-foreground">
                          automationMode ("full-run" | "buy-only" |
                          "cross-account"), giftAmount
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">Run</h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li>
                            userId, status, stage (e.g., buying_gift,
                            applying_gift), automationMode, errorMessage?
                          </li>
                          <li>
                            <strong>Purpose:</strong> operational trace for your
                            automations.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-2">Screenshot</h4>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                          <li className="break-words">
                            runId, screenshotType
                            ("error"/"success"/"step"/"debug"/"final"), stage?,
                            siteUrl?, screenshotUrl, isError
                          </li>
                          <li>
                            <strong>Purpose:</strong> debugging/trace for the
                            run; may be shown in the UI.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      F. Notifications
                    </h3>
                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        NotificationSettings
                      </h4>
                      <p className="text-muted-foreground">
                        isEnabled, notificationOnSuccess, notificationOnError,
                        notificationMethod ("sms" | "email" | "both"),
                        phoneNumber?, phoneVerified, email?, emailVerified
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* 2) Why we collect it */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  2) Why We Collect It (purposes & legal basis)
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Provide the service
                    </h3>
                    <p className="text-muted-foreground">
                      Authenticate you (Google OAuth), run the buy/apply
                      automation for Wolt using Cibus benefits, ingest gift
                      emails to extract codes, and apply them to your Wolt
                      account.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Operate the product
                    </h3>
                    <p className="text-muted-foreground">
                      Run orchestration (jobs, queues, functions), show run
                      history/screenshots, and send opt-in notifications on
                      success/error.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Security & fraud-prevention
                    </h3>
                    <p className="text-muted-foreground">
                      Rate-limits, anomaly/error detection, and protecting
                      credentials/tokens.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Analytics</h3>
                    <p className="text-muted-foreground">
                      Opt-in only (see §7).
                    </p>
                  </div>

                  <p className="text-muted-foreground mt-6">
                    Under Israeli law the primary bases here are{" "}
                    <strong>performance of a relationship you initiate</strong>
                    (providing the service you asked for) and{" "}
                    <strong>legitimate interests</strong> (technical operation
                    and security), together with consent where required
                    (analytics cookies/identifiers). We also follow the duty to
                    inform about what we collect, where it's stored, retention,
                    and sharing.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 3) Where we process & store */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  3) Where We Process & Store
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Primary region
                    </h3>
                    <p className="text-muted-foreground">
                      AWS {import.meta.env.VITE_AWS_REGION} (
                      {import.meta.env.VITE_AWS_REGION_CITY}) for Aurora
                      PostgreSQL, Lambda, API Gateway, VPC, CloudWatch logs,
                      EventBridge, Step Functions, CloudFormation, IAM, S3, SES,
                      Certificate Manager, Route 53, CloudFront.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Global delivery
                    </h3>
                    <p className="text-muted-foreground">
                      CloudFront serves static web assets and fronts API
                      endpoints globally (edge POPs). Requests ultimately
                      terminate to our APIs hosted in{" "}
                      {import.meta.env.VITE_AWS_REGION}.
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      If data must move outside Israel for CDN transit or
                      provider operations, we rely on provider safeguards and
                      transmit over TLS; storage location for core records is
                      {import.meta.env.VITE_AWS_REGION}.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* 4) Security */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  4) Security (how we protect data)
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Application-level encryption
                    </h3>
                    <p className="text-muted-foreground">
                      AES-256 for Wolt tokens, Cibus username/password/company,
                      Google refresh token. Decryption happens only inside
                      server code; those values are never returned to the
                      browser.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Transport</h3>
                    <p className="text-muted-foreground">
                      TLS for client⇄API and API⇄AWS services. (RDS and service
                      links use AWS defaults; client traffic to us is always
                      HTTPS.)
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">At rest</h3>
                    <p className="text-muted-foreground">
                      RDS storage encryption; S3 bucket encryption; plus our
                      application-level AES-256 for the sensitive fields listed
                      above.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Access</h3>
                    <p className="text-muted-foreground">
                      Production data access limited to the owner/operator for
                      operational needs.
                    </p>
                  </div>

                  {/* <p className="text-muted-foreground text-sm mt-6">
                    We are not describing internal incident-response playbooks
                    here, as that is not a legal requirement for this notice. We
                    will comply with any incident notification duties that apply
                    under Israeli law/regulator guidance.
                  </p> */}
                </div>
              </section>

              <Separator />

              {/* 5) Retention */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  5) How Long We Keep Data (retention)
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      One-time codes
                    </h3>
                    <p className="text-muted-foreground">
                      Cibus2FA, TwoFactorAuthentication (verification codes),
                      and Code (gift codes) – deleted in a daily purge (may be
                      deleted earlier by rolling cleanup).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Operational history
                    </h3>
                    <p className="text-muted-foreground">
                      Run and Screenshot – 90 days.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Emails & attachments
                    </h3>
                    <p className="text-muted-foreground">Up to 90 days.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Logs</h3>
                    <p className="text-muted-foreground">
                      CloudWatch / app logs – 30 days.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Account & settings
                    </h3>
                    <p className="text-muted-foreground">
                      User account, Settings, WoltSettings, CibusSettings,
                      RunSettings, NotificationSettings, Inbox – kept until you
                      delete your account.
                    </p>
                  </div>

                  <p className="text-muted-foreground mt-6">
                    <strong>Account deletion:</strong> triggers deletion of all
                    the above user-linked data, including runs, screenshots,
                    emails, and stored credentials/tokens, subject only to
                    technical delay for safe purge. (We do not keep database
                    backups for this project.)
                  </p>
                </div>
              </section>

              <Separator />

              {/* 6) Your controls */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  6) Your Controls
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Sign-in & profile
                    </h3>
                    <p className="text-muted-foreground">
                      Google Sign-In. You can see name/email in the UI.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Delete account (and all data)
                    </h3>
                    <p className="text-muted-foreground">
                      Available in Settings. This removes your account and
                      linked data sets listed in §5.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Edit data</h3>
                    <p className="text-muted-foreground">
                      You can update notification preferences, run preferences,
                      and (by design) you re-enter Cibus/Wolt credentials when
                      needed.
                    </p>
                  </div>

                  {/* <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Access copy/export
                    </h3>
                    <p className="text-muted-foreground">
                      Not offered in this MVP. If later required by law or
                      regulator guidance for your specific case, we'll add an
                      in-app export. (We implement the legally required
                      transparency in this notice; deletion is already
                      self-service.)
                    </p>
                  </div> */}
                </div>
              </section>

              <Separator />

              {/* 7) Cookies & Analytics */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  7) Cookies & Analytics
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Auth cookie</h3>
                    <p className="text-muted-foreground">
                      First-party session token (strictly necessary). Used to
                      keep you logged in and to authorize requests to the API.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Analytics</h3>
                    <p className="text-muted-foreground">
                      Google Analytics (GA4) runs only after consent. We
                      implement Google Consent Mode V2 – Basic, which blocks
                      Google tags until you choose on the banner. If you do not
                      consent, GA remains off. You can change your consent
                      anytime from the banner link in the app.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* 8) Third-party services */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  8) Third-party Services (categories)
                </h2>

                <p className="text-muted-foreground mb-6">
                  We use third-party processors to operate the product. They
                  handle data only as needed to provide their specific function:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Google</h3>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>
                        OAuth (sign-in: name/email/profile pic; refresh token
                        stored encrypted)
                      </li>
                      <li>Google Analytics (only after consent; see §7)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Amazon Web Services (AWS)
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Compute & API:</strong> Lambda, API Gateway, EC2
                        (as needed)
                      </li>
                      <li>
                        <strong>Storage/Data:</strong> Aurora PostgreSQL (RDS),
                        S3
                      </li>
                      <li>
                        <strong>Messaging/Email:</strong> Amazon SES (receive
                        email into S3; send outbound emails), AWS End User
                        Messaging (for SMS/notifications, if configured)
                      </li>
                      <li>
                        <strong>Orchestration/Monitoring:</strong> EventBridge,
                        Step Functions, CloudWatch
                      </li>
                      <li>
                        <strong>Network & Delivery:</strong> VPC, Route 53,
                        CloudFront (global CDN & API edge), Certificate Manager
                        (TLS)
                      </li>
                      <li>
                        <strong>Platform:</strong> IAM (access control),
                        CloudFormation (infrastructure as code)
                      </li>
                    </ul>
                    {/* <p className="text-sm text-muted-foreground mt-2 italic">
                      (We do not use ECS or ECR for this project.)
                    </p> */}
                  </div>
                </div>
              </section>

              <Separator />

              {/* 9) Sharing */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">9) Sharing</h2>

                <p className="text-muted-foreground mb-4">
                  <strong>We do not sell personal data.</strong> We share data
                  only with:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Processors listed in §8 to operate the service; and</li>
                  <li>
                    Authorities if required by applicable law, court order, or
                    regulator instruction.
                  </li>
                </ul>
              </section>

              <Separator />

              {/* 10) Children */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">10) Children</h2>

                <p className="text-muted-foreground">
                  The service is not directed to children. Do not use{" "}
                  {POLICY_CONFIG.productName} if you are under the legal age to
                  form a binding agreement.
                </p>
              </section>

              <Separator />

              {/* 11) Changes */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  11) Changes to this Policy
                </h2>

                <p className="text-muted-foreground mb-4">
                  If we materially change this notice, we'll update the "Last
                  updated" date and surface a notice in-app.
                </p>

                <p className="text-sm text-muted-foreground">
                  Last updated: {POLICY_CONFIG.lastUpdated}
                </p>
              </section>

              <Separator />

              {/* Contact section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
                <p className="text-muted-foreground mb-4">
                  For any questions about this privacy policy or how we handle
                  your data, feel free to contact me directly.
                </p>
                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={`mailto:${POLICY_CONFIG.contactEmail}`}
                    className="font-medium break-all"
                    aria-label="Email Shalev Ben-Moshe"
                  >
                    {POLICY_CONFIG.contactEmail}
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
