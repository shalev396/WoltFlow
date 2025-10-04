import Layout from "@/components/shared/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

// Configuration object for easy editing
const TERMS_CONFIG = {
  serviceName: "WoltFlow",
  effectiveDate: "04/09/2025", // Update this date when you modify the terms
  contactEmail: "shalev396@gmail.com", // Update with your contact email
  ownerOperator: "Shalev Ben-Moshe (individual, side-project)",
  territory: `AWS, primary region ${import.meta.env.VITE_AWS_REGION} (${import.meta.env.VITE_AWS_REGION_CITY})`,
  productName: "WoltFlow",
  productDescription:
    "automation that buys Wolt gift credit using a user's Cibus meal benefit and applies it to the user's Wolt account",
};

export default function TermsOfService() {
  return (
    <Layout
      title="Terms of Service"
      description="Terms and conditions governing your use of our automation service."
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Service Information
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Service Name:</strong> {TERMS_CONFIG.serviceName}
                </p>
                <p>
                  <strong>Owner/Operator:</strong> {TERMS_CONFIG.ownerOperator}
                </p>
                <p>
                  <strong>Territory & Hosting:</strong> {TERMS_CONFIG.territory}
                </p>
                <p>
                  <strong>Product:</strong> "{TERMS_CONFIG.productName}" –{" "}
                  {TERMS_CONFIG.productDescription}
                </p>
                <p className="text-sm">
                  <strong>Effective Date:</strong> {TERMS_CONFIG.effectiveDate}
                </p>
              </div>
            </section>

            <div className="space-y-8">
              {/* 1) Acceptance of the Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  1) Acceptance of the Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") are a binding agreement
                  between {TERMS_CONFIG.serviceName} ("Service," "we," "us," or
                  "our") and the person who creates an account or uses any part
                  of the Service ("you" or "User"). By accessing or using the
                  Service, you agree to these Terms. If you do not agree, do not
                  use the Service.
                </p>
              </section>

              <Separator />

              {/* 2) What the Service Does */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  2) What the Service Does (Summary)
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is an automation tool that, after you configure
                  it, runs up to once per day to (a) access your Cibus meal
                  benefits and (b) purchase Wolt credit/gift card on your behalf
                  using those benefits (when possible). The Service can also
                  receive forwarded SMS or emails that you direct to the Service
                  to complete verification steps. An API is available and
                  documented for sending required messages to complete flows.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The Service is provided as-is, may change or stop at any time,
                  and is currently offered as a side project with limited
                  availability and support.
                </p>
              </section>

              <Separator />

              {/* 3) Your Account; Eligibility */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  3) Your Account; Eligibility
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a)</strong> You must be 18+ and legally capable of
                    contracting.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b)</strong> You must only use the Service for your
                    own accounts (Cibus, Wolt, email, phone). You represent and
                    warrant you have all rights and permissions to use
                    automation on those accounts, and that your use complies
                    with their terms.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c)</strong> You are responsible for maintaining the
                    confidentiality of your login methods (including API key)
                    and for all activity under your account.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 4) Initial Setup & Your Inputs */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  4) Initial Setup & Your Inputs
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) Configuration required.</strong> The automation
                    runs only after you provide and save required inputs (e.g.,
                    Cibus credentials, Wolt tokens if any, phone/email
                    forwarding, preferences).
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) Credentials & secrets.</strong> Sensitive fields
                    (e.g., usernames, passwords, tokens, codes) are encrypted
                    with AES-256 in our database at rest and are transmitted
                    encrypted in transit to the server. Decryption occurs only
                    on the server/function at the time of use. Secrets are never
                    sent to clients.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c) Forwarded SMS & emails.</strong> You may forward
                    your own messages to the Service or use a mobile
                    automation/SMS-forwarder to send the one-time codes needed
                    to complete login steps. Do not forward messages that are
                    not yours.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>d) Accuracy.</strong> You are responsible for
                    providing accurate, up-to-date information. The Service will
                    act based on what you configure.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 5) Third-Party Services */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  5) Third-Party Services (No Affiliation)
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service interacts with third-party services (e.g., Cibus,
                  Wolt, email providers, mobile carriers). These are independent
                  third parties. We do not own, control, or endorse them, and
                  are not affiliated with them. Your use of third-party services
                  is subject to their terms and policies, and you are solely
                  responsible for any consequences, including account actions
                  (e.g., suspension/ban), charges, limits, or reversals imposed
                  by those services.
                </p>
              </section>

              <Separator />

              {/* 6) Permitted Use; Prohibited Activities */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  6) Permitted Use; Prohibited Activities
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) Permitted.</strong> Use the Service solely to
                    automate the flows described in our documentation, and
                    solely for your own accounts. Use the API only as documented
                    and within any rate/volume limits we set.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) Prohibited.</strong> You must not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Use the Service for any unlawful purpose or to violate
                      third-party terms.
                    </li>
                    <li>
                      Use other people's accounts or content, or misrepresent
                      your identity.
                    </li>
                    <li>
                      Reverse engineer, interfere with, disrupt, overload, or
                      bypass any access controls for the Service.
                    </li>
                    <li>
                      Submit malware, automated attacks, or content that
                      infringes rights or privacy.
                    </li>
                    <li>
                      Attempt to evade verification or fraud-prevention steps of
                      any third-party service.
                    </li>
                    <li>
                      Do not use web scrapers, bots, or similar automated tools
                      to access or harvest data from our Service, including the
                      website or API. Only use the documented automation API and
                      flows—for your own account—and follow the instructions
                      exactly
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    We may suspend or terminate your access immediately for
                    suspected violations.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 7) Running the Automation */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  7) Running the Automation; Frequency; Outcomes
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a)</strong> The automation attempts to run up to
                    once per day (or as configured) but timing, success, and
                    outcomes are not guaranteed.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b)</strong> The automation may not complete if
                    third-party services change flows, block automation,
                    rate-limit, require manual steps, or experience outages.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c)</strong> If the Service detects inconsistent or
                    risky states (e.g., invalid code, payment failure, unusual
                    prompts), it may abort or skip the run.
                  </p>
                </div>
              </section>

              <Separator />

              {/* 8) Payments, Fees, Taxes */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  8) Payments, Fees, Taxes
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a)</strong> If we charge fees now or in the future,
                    we will present them to you in-product before you incur
                    them.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b)</strong> You are responsible for any taxes or
                    third-party charges (e.g., card issuer, carrier SMS/MMS/data
                    fees).
                  </p>
                </div>
              </section>

              <Separator />

              {/* 9) Risk Allocation & Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  9) Risk Allocation & Disclaimers
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To the maximum extent permitted by law:
                </p>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) Use at your own risk.</strong> You understand and
                    agree that using automation on Cibus/Wolt or related
                    accounts can lead to denied transactions, account
                    flags/bans, chargebacks, lost or frozen balances, failed
                    purchases, or changed program rules.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>
                      b) No responsibility for third-party actions.
                    </strong>{" "}
                    We are not responsible for actions or decisions by Cibus,
                    Wolt, card issuers, email providers, carriers, or any other
                    third party.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c) No responsibility for value outcomes.</strong> We
                    are not responsible for any loss of credit, gift cards,
                    balances, vouchers, or benefits, including where:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      A third party changes its terms, APIs, limits,
                      eligibility, or availability;
                    </li>
                    <li>A purchase is declined, reversed, or misapplied;</li>
                    <li>A third party bans/suspends your account(s);</li>
                    <li>
                      Funds/credits become unusable, expire, or are restricted;
                    </li>
                    <li>
                      A payment method other than Cibus is used by the third
                      party during checkout (including a credit card on file)
                    </li>
                    <li>
                      Forwarded SMS/email codes fail, are delayed, or are
                      intercepted on your device or network.
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>d) No warranties.</strong> The Service is provided
                    "as is" and "as available" without warranties of any kind
                    (including uptime, accuracy, fitness, non-infringement, or
                    compatibility with third-party rules, flows, or
                    anti-automation measures).
                  </p>
                </div>
              </section>

              <Separator />

              {/* 10) Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  10) Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, in no event will we be
                  liable for any indirect, incidental, special, consequential,
                  exemplary, or punitive damages, or for lost profits, lost
                  data, lost goodwill, loss of credits/balances/gift cards, or
                  account actions, even if foreseeable.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Our total aggregate liability for all claims arising out of or
                  relating to the Service shall not exceed the greater of: (i)
                  ₪35; or (ii) the fees you paid us for the Service in the three
                  (3) months preceding the event giving rise to liability.
                </p>
              </section>

              <Separator />

              {/* 11) Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  11) Indemnification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You will defend, indemnify, and hold harmless us and our
                  developers from and against any claims, damages, liabilities,
                  costs, and expenses (including reasonable attorneys' fees)
                  arising from: (a) your use of the Service; (b) your violation
                  of these Terms; (c) your violation of any third-party terms
                  (including Cibus/Wolt); or (d) your misuse of the API,
                  forwarded SMS/emails, or credentials.
                </p>
              </section>

              <Separator />

              {/* 12) Privacy */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">12) Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our handling of your information is described in the Privacy
                  Policy for the Service (as updated from time to time). By
                  using the Service, you consent to those practices.
                </p>
              </section>

              <Separator />

              {/* 13) Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  13) Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service (software, documentation, and all related IP) is
                  owned by us or our licensors. These Terms do not grant you any
                  intellectual-property rights except for a limited, revocable,
                  non-exclusive, non-transferable license to use the Service as
                  described herein.
                </p>
              </section>

              <Separator />

              {/* 14) Suspension; Termination */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  14) Suspension; Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may suspend or terminate the Service or your access at any
                  time with or without notice, including if we detect misuse or
                  risk. You may stop using the Service at any time. Upon
                  termination we may "pull the plug"—i.e., stop all automations
                  and disable access. Sections intended to survive (e.g.,
                  Disclaimers, Limitation of Liability, Indemnification,
                  Governing Law) will survive.
                </p>
              </section>

              <Separator />

              {/* 15) Changes to the Service or Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  15) Changes to the Service or Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may modify the Service or these Terms at any time. Material
                  changes will be indicated in-product or by updating the
                  "Effective date." If you continue using the Service after
                  changes become effective, you accept the changes.
                </p>
              </section>

              <Separator />

              {/* 16) Governing Law; Venue */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  16) Governing Law; Venue
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of the State of Israel,
                  without regard to conflict-of-laws rules. The exclusive
                  jurisdiction and venue for any dispute shall be the competent
                  courts in Tel-Aviv-Yafo, Israel.
                </p>
              </section>

              <Separator />

              {/* 17) Miscellaneous */}
              <section>
                <h2 className="text-2xl font-semibold mb-6">
                  17) Miscellaneous
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>a) No affiliation.</strong> Names of third-party
                    services are used solely to describe interoperable services;
                    they are trademarks of their respective owners.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>b) Entire agreement.</strong> These Terms constitute
                    the entire agreement between you and us regarding the
                    Service and supersede any prior understandings.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>c) Severability.</strong> If any part of these Terms
                    is held invalid, the remainder remains in effect.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>d) No waiver.</strong> A failure to enforce a
                    provision is not a waiver.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>e) Assignment.</strong> You may not assign these
                    Terms. We may assign them in connection with a
                    reorganization, transfer, or similar event.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Contact section */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
                <p className="text-muted-foreground mb-4">
                  For any questions about these Terms of Service, feel free to
                  contact me directly.
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
