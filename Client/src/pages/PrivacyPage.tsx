import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ExternalLink } from "lucide-react";
import Layout from "@/components/shared/Layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              WoltFlow Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last Updated: January 15, 2025
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                WoltFlow ("we," "us," "our") is committed to protecting your
                privacy and being transparent about how we collect, use, and
                protect your personal information. This Privacy Policy explains
                our data practices for the WoltFlow automation service operated
                by Shalev Ben Moshe.
              </p>
              <p className="text-muted-foreground">
                By using WoltFlow, you consent to the data practices described
                in this policy.
              </p>
            </section>

            <Separator />

            {/* What We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Account Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Google Account Data:</strong> Email address, name,
                      and profile picture obtained through Google OAuth
                      authentication
                    </li>
                    <li>
                      <strong>User Profile:</strong> Basic profile information
                      you consent to share during the Google sign-in process
                    </li>
                    <li>
                      <strong>Account Identifiers:</strong> Unique user IDs and
                      session tokens for authentication
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Service Configuration
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Cibus Credentials:</strong> Username, password,
                      and company information for meal benefit automation
                      (encrypted and securely stored)
                    </li>
                    <li>
                      <strong>Wolt Tokens:</strong> Refresh and access tokens
                      for gift card application (encrypted and securely stored)
                    </li>
                    <li>
                      <strong>Notification Preferences:</strong> Contact methods
                      (email/SMS), phone numbers, and notification settings
                    </li>
                    <li>
                      <strong>Automation Settings:</strong> Preferences for
                      automation modes, schedules, and gift card amounts
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Operational Data</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Run Metadata:</strong> Timestamps, statuses,
                      stages, and results of automation executions
                    </li>
                    <li>
                      <strong>Error Logs:</strong> Technical error information
                      for debugging and service improvement
                    </li>
                    <li>
                      <strong>Screenshots:</strong> Automated screenshots
                      captured during automation runs for verification and
                      debugging
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Email Processing</h3>
                  <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>Important:</strong> We only access specific Wolt
                      gift card confirmation emails through our service account,
                      not your personal Gmail account.
                    </AlertDescription>
                  </Alert>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                    <li>
                      <strong>Gift Card Emails:</strong> Wolt gift card
                      confirmation emails containing redemption codes
                    </li>
                    <li>
                      <strong>Email Metadata:</strong> Timestamps, sender
                      information, and subject lines for gift card emails only
                    </li>
                    <li>
                      <strong>Email Content:</strong> Gift card codes and
                      amounts extracted from confirmation emails
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Analytics Data</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <strong>Usage Analytics:</strong> Service usage patterns,
                      feature adoption, and performance metrics via Google
                      Analytics 4
                    </li>
                    <li>
                      <strong>Technical Data:</strong> Browser type, device
                      information, IP addresses (anonymized), and general
                      location data
                    </li>
                    <li>
                      <strong>Error Tracking:</strong> Application errors and
                      crash reports for service reliability
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Primary Services</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Authenticate and identify users securely</li>
                    <li>
                      Execute automated meal benefit claims and gift card
                      purchases
                    </li>
                    <li>Apply gift cards to your Wolt account automatically</li>
                    <li>
                      Send notifications about automation results and status
                    </li>
                    <li>Provide customer support and technical assistance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Service Improvement
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      Analyze usage patterns to improve service reliability and
                      performance
                    </li>
                    <li>Debug and resolve technical issues</li>
                    <li>Develop new features and enhancements</li>
                    <li>Monitor for security threats and prevent abuse</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Compliance and Safety
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      Comply with legal obligations and regulatory requirements
                    </li>
                    <li>Protect against fraud, abuse, and security threats</li>
                    <li>Enforce our Terms of Service</li>
                    <li>
                      Respond to legal requests and court orders when required
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Data Storage and Processing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Data Storage and Processing
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Infrastructure</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Cloud Provider:</strong> Amazon Web Services (AWS)
                      with data centers in the United States and Europe
                    </li>
                    <li>
                      <strong>Database:</strong> PostgreSQL with encryption at
                      rest and in transit
                    </li>
                    <li>
                      <strong>File Storage:</strong> AWS S3 for screenshots and
                      automation artifacts with server-side encryption
                    </li>
                    <li>
                      <strong>Backup Systems:</strong> Automated backups with
                      encryption and geographic redundancy
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Security Measures
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Encryption:</strong> All sensitive data encrypted
                      using AES-256 encryption
                    </li>
                    <li>
                      <strong>Access Controls:</strong> Least-privilege access
                      principles and multi-factor authentication
                    </li>
                    <li>
                      <strong>Network Security:</strong> TLS 1.3 for all data
                      transmission and VPC isolation
                    </li>
                    <li>
                      <strong>Audit Logging:</strong> Comprehensive logs of all
                      data access and system activities
                    </li>
                    <li>
                      <strong>Regular Security Reviews:</strong> Periodic
                      security assessments and penetration testing
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Google Services Compliance */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Google API Services Compliance
              </h2>

              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 mb-4">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Google API Services User Data Policy:</strong>{" "}
                  WoltFlow's use and transfer of information received from
                  Google APIs adheres to the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-600 inline-flex items-center gap-1"
                  >
                    Google API Services User Data Policy
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  , including the Limited Use requirements.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Data Use Commitment
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Limited Use:</strong> We only request and use the
                      minimum Google API scopes necessary for WoltFlow
                      functionality
                    </li>
                    <li>
                      <strong>No Sale of Data:</strong> We do not sell, rent, or
                      otherwise distribute your Google user data to third
                      parties
                    </li>
                    <li>
                      <strong>No Human Review:</strong> Google user data is
                      processed automatically; no human review occurs except for
                      debugging with explicit user consent
                    </li>
                    <li>
                      <strong>Purpose Limitation:</strong> Google data is used
                      solely for providing and improving WoltFlow services as
                      disclosed
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Required Scopes</h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Profile Information:</strong> Basic profile data
                      for account creation and identification
                    </li>
                    <li>
                      <strong>Email Access:</strong> Limited Gmail access to
                      read Wolt gift card confirmation emails only
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Analytics and Tracking */}
            <section>
              <h2 className="text-2xl font-semibond mb-4">
                Analytics and Tracking
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Google Analytics 4
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We use Google Analytics 4 to understand how users interact
                    with WoltFlow and improve our service:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Privacy-Enhanced:</strong> GA4 is configured with
                      enhanced privacy settings including IP anonymization by
                      default
                    </li>
                    <li>
                      <strong>Regional Data Handling:</strong> Data processing
                      complies with regional privacy laws including GDPR
                    </li>
                    <li>
                      <strong>Limited Retention:</strong> Analytics data is
                      automatically deleted after 14 months
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Opt-Out Options</h3>
                  <p className="text-muted-foreground mb-2">
                    You can opt out of analytics tracking:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Enable "Do Not Track" in your browser settings</li>
                    <li>
                      Install the{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                      >
                        Google Analytics Opt-out Browser Add-on
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      Use privacy-focused browsers or extensions that block
                      analytics
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Data Retention and Deletion */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Data Retention and Deletion
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Retention Periods
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Account Data:</strong> Retained while your account
                      is active and for 90 days after account deletion
                    </li>
                    <li>
                      <strong>Automation Logs:</strong> Retained for 12 months
                      for debugging and service improvement
                    </li>
                    <li>
                      <strong>Screenshots:</strong> Retained for 90 days for
                      verification and support purposes
                    </li>
                    <li>
                      <strong>Analytics Data:</strong> Automatically deleted
                      after 14 months
                    </li>
                    <li>
                      <strong>Encrypted Credentials:</strong> Deleted
                      immediately upon account deletion or credential update
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Data Deletion Rights
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Request deletion of your personal data</li>
                    <li>Export your data in a machine-readable format</li>
                    <li>Correct inaccurate personal information</li>
                    <li>Withdraw consent for data processing</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Your Privacy Rights
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Access and Control
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>Account Settings:</strong> Modify your automation
                      preferences and notification settings anytime
                    </li>
                    <li>
                      <strong>Data Export:</strong> Request a copy of your
                      personal data in JSON format
                    </li>
                    <li>
                      <strong>Account Deletion:</strong> Delete your account and
                      associated data through the settings page
                    </li>
                    <li>
                      <strong>Credential Management:</strong> Update or remove
                      stored credentials at any time
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Legal Rights (GDPR/CCPA)
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Depending on your jurisdiction, you may have additional
                    rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Right to be informed about data processing</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Data Sharing and Third Parties
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Service Providers
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    We share data with trusted service providers who help us
                    operate WoltFlow:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      <strong>AWS:</strong> Cloud infrastructure, database, and
                      file storage
                    </li>
                    <li>
                      <strong>Google:</strong> Authentication, analytics, and
                      email processing
                    </li>
                    <li>
                      <strong>SMS Providers:</strong> Delivery of notification
                      messages (phone numbers only)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Legal Disclosures
                  </h3>
                  <p className="text-muted-foreground">
                    We may disclose your information if required by law, legal
                    process, or to protect the rights, property, or safety of
                    WoltFlow, our users, or the public.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Business Transfers
                  </h3>
                  <p className="text-muted-foreground">
                    In the event of a merger, acquisition, or sale of assets,
                    user information may be transferred. We will provide notice
                    and ensure data protection continues under any new
                    ownership.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                International Data Transfers
              </h2>
              <p className="text-muted-foreground mb-4">
                WoltFlow processes data globally using cloud infrastructure in
                the United States and Europe. We ensure appropriate safeguards
                are in place for international transfers:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>
                  <strong>Standard Contractual Clauses:</strong> EU-approved
                  data transfer mechanisms
                </li>
                <li>
                  <strong>Adequacy Decisions:</strong> Transfers to countries
                  with adequate data protection levels
                </li>
                <li>
                  <strong>Encryption:</strong> All data encrypted in transit and
                  at rest during transfers
                </li>
                <li>
                  <strong>Data Minimization:</strong> Only necessary data is
                  transferred across borders
                </li>
              </ul>
            </section>

            <Separator />

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For privacy-related questions, concerns, or requests regarding
                your personal data, please contact us:
              </p>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p>
                  <strong>Data Controller:</strong> Shalev Ben Moshe
                </p>
                <p>
                  <strong>Email:</strong> privacy@woltflow.com
                </p>
                <p>
                  <strong>Response Time:</strong> We will respond to privacy
                  requests within 30 days
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.shalev396.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    www.shalev396.com
                  </a>
                </p>
              </div>

              <p className="text-muted-foreground text-sm mt-4">
                For urgent privacy concerns or data breach notifications, please
                mark your email as "URGENT - PRIVACY" in the subject line.
              </p>
            </section>

            <Separator />

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy periodically to reflect
                changes in our practices, technology, legal requirements, or
                other factors. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground mb-4">
                <li>
                  Update the "Last Updated" date at the top of this policy
                </li>
                <li>Notify active users via email or in-app notification</li>
                <li>Post the updated policy on our website</li>
                <li>
                  For significant changes, request renewed consent where
                  required by law
                </li>
              </ul>
              <p className="text-muted-foreground">
                Your continued use of WoltFlow after policy changes constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <Separator />

            {/* Effective Date */}
            <section className="text-center">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy is effective as of January 15, 2025, and was
                last reviewed on January 15, 2025.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                By using WoltFlow, you acknowledge that you have read,
                understood, and agree to be bound by this Privacy Policy.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
