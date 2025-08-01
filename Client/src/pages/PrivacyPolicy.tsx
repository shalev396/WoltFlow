import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              WoltFlow Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last Updated: August 2025
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                About this Privacy Policy
              </h2>
              <p className="text-muted-foreground">
                This Privacy Policy explains how WoltFlow ("we", "us", "our")
                collects, uses, and protects your personal information when you
                use our automated Wolt gift card purchasing service. Please read
                this Privacy Policy carefully.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Account Information
                  </h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect your Google account
                    information including name, email address, and unique user
                    identifier through Google OAuth authentication.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Service Credentials
                  </h3>
                  <p className="text-muted-foreground">
                    To provide our automation services, we securely store your
                    Cibus credentials (username, password, company information)
                    and Wolt tokens. All credentials are encrypted using
                    industry-standard encryption methods.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Gmail API Data</h3>
                  <p className="text-muted-foreground">
                    With your explicit consent, we access your Gmail account to
                    retrieve Wolt gift card codes from purchase confirmation
                    emails. We only access emails from info@wolt.com containing
                    gift card information and do not read or store any other
                    emails.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Usage and Technical Data
                  </h3>
                  <p className="text-muted-foreground">
                    We collect information about how you use our service
                    including automation runs, settings configurations, error
                    logs, and technical information necessary for service
                    operation and troubleshooting.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Notification Information
                  </h3>
                  <p className="text-muted-foreground">
                    If you enable notifications, we collect your phone number or
                    email address for sending SMS or email notifications about
                    automation status.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide automated Wolt gift card purchasing services</li>
                <li>Authenticate and manage your account access</li>
                <li>
                  Process gift card purchases and apply codes to your Wolt
                  account
                </li>
                <li>Send notifications about automation status and results</li>
                <li>
                  Troubleshoot technical issues and improve service reliability
                </li>
                <li>Maintain security and prevent unauthorized access</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Data Storage and Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    AWS Cloud Infrastructure
                  </h3>
                  <p className="text-muted-foreground">
                    Your data is securely stored on Amazon Web Services (AWS)
                    cloud infrastructure with enterprise-grade security measures
                    including encryption at rest and in transit.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Database Security
                  </h3>
                  <p className="text-muted-foreground">
                    We use secure database systems with proper access controls,
                    regular backups, and monitoring to protect your information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Access Controls</h3>
                  <p className="text-muted-foreground">
                    Access to your personal information is strictly limited to
                    authorized personnel who need it to provide and maintain our
                    services.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information Sharing
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  With service providers who assist in operating our platform
                  (AWS, notification services)
                </li>
                <li>When required by law or to respond to legal process</li>
                <li>
                  To protect the rights, property, or safety of WoltFlow, our
                  users, or others
                </li>
                <li>
                  In connection with a merger, acquisition, or sale of assets
                  (with notice to users)
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Third-Party Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Google Services</h3>
                  <p className="text-muted-foreground">
                    We use Google OAuth for authentication and Gmail API for
                    retrieving gift card codes. Your use of Google services is
                    subject to Google's Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Cibus and Wolt</h3>
                  <p className="text-muted-foreground">
                    Our service automates interactions with Cibus and Wolt
                    platforms. We are not responsible for the privacy practices
                    of these third-party services.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Correct or update your information</li>
                <li>Delete your account and associated data</li>
                <li>Withdraw consent for Gmail access</li>
                <li>Export your data</li>
                <li>Opt out of notifications</li>
                <li>File complaints with data protection authorities</li>
              </ul>
            </section>

            <Separator /> */}

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to
                provide our services or as required by law. When you delete your
                account, we will delete your personal information within 30
                days, except for information we must retain for legal or
                regulatory purposes.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Children's Privacy
              </h2>
              <p className="text-muted-foreground">
                Our service is not intended for children under 18 years of age.
                We do not knowingly collect personal information from children
                under 18.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Changes to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on our website and updating the "Last Updated" date.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact WoltFlow at support
                {/* us at{" "}
                <a
                  href="mailto:privacy@woltflow.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@woltflow.com
                </a> */}
                .
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
