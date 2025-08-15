import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ExternalLink } from "lucide-react";
import Layout from "@/components/shared/Layout";

export default function ExtensionPrivacyPage() {
  return (
    <Layout
      title="WoltFlow Extension Privacy Policy"
      description="Privacy policy for the WoltFlow browser extension"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            WoltFlow Extension Privacy Policy
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
              The WoltFlow browser extension helps you securely extract your
              Wolt account credentials to automate gift card purchases. This
              privacy policy explains how the extension handles your data during
              the credential extraction process.
            </p>
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Key Principle:</strong> The extension only extracts
                credentials when you explicitly request it and immediately
                transfers them to your WoltFlow account. No data is stored
                permanently by the extension.
              </AlertDescription>
            </Alert>
          </section>

          <Separator />

          {/* What the Extension Does */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              What the Extension Does
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Credential Extraction
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Detects when you're logged into your Wolt account</li>
                  <li>
                    Extracts your Wolt refresh token and access token from
                    browser storage
                  </li>
                  <li>Only activates when you click the extension button</li>
                  <li>Immediately transfers extracted data to WoltFlow</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Browser Permissions
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>ActiveTab:</strong> Access the current tab when
                    extension is clicked
                  </li>
                  <li>
                    <strong>Storage:</strong> Temporarily store extracted tokens
                    during transfer
                  </li>
                  <li>
                    <strong>Host Permissions:</strong> Access to wolt.com and
                    consumer-api.wolt.com
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Data Handling */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Handling</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">What We Extract</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Wolt refresh tokens (for authentication)</li>
                  <li>Wolt access tokens (for API access)</li>
                  <li>
                    No personal information, passwords, or payment details
                  </li>
                  <li>No browsing history or other website data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Storage</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>No Permanent Storage:</strong> Extension doesn't
                    store any data permanently
                  </li>
                  <li>
                    <strong>Temporary Storage:</strong> Tokens held briefly
                    during transfer process
                  </li>
                  <li>
                    <strong>Automatic Cleanup:</strong> All temporary data
                    cleared after transfer
                  </li>
                  <li>
                    <strong>No Analytics:</strong> Extension doesn't collect
                    usage statistics
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Transmission</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    Tokens sent directly to your WoltFlow account via HTTPS
                  </li>
                  <li>No third-party services or external analytics</li>
                  <li>Encrypted transmission using TLS 1.3</li>
                  <li>Data only sent to WoltFlow servers</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Security Measures */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Security Measures</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Extension Security</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Minimal permissions requested (only what's necessary)</li>
                  <li>No background processing or persistent scripts</li>
                  <li>Code is minimized and focused on single purpose</li>
                  <li>No external dependencies or third-party libraries</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Protection</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>All data encrypted during transmission</li>
                  <li>No local storage or caching of sensitive data</li>
                  <li>Extension operates only when explicitly activated</li>
                  <li>No automatic or background data collection</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Your Rights and Control
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Extension Control</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Uninstall the extension anytime from browser settings</li>
                  <li>Extension only runs when you click it</li>
                  <li>No automatic or scheduled operations</li>
                  <li>Full control over when credentials are extracted</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Control</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Revoke Wolt tokens anytime from your Wolt account</li>
                  <li>Remove stored tokens from WoltFlow settings</li>
                  <li>No data remains in extension after use</li>
                  <li>Complete control over automation settings</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Third-Party Services
            </h2>
            <p className="text-muted-foreground mb-4">
              The extension interacts with the following services:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Wolt Services</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>wolt.com:</strong> Main Wolt website where tokens
                    are extracted
                  </li>
                  <li>
                    <strong>consumer-api.wolt.com:</strong> Wolt API endpoints
                  </li>
                  <li>Extension reads existing authentication data only</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">WoltFlow Services</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Your WoltFlow account receives extracted tokens</li>
                  <li>Tokens stored securely in WoltFlow infrastructure</li>
                  <li>Subject to main WoltFlow Privacy Policy</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              For questions about the extension or this privacy policy:
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p>
                <strong>Extension Developer:</strong> Shalev Ben Moshe
              </p>
              <p>
                <strong>Email:</strong> privacy@woltflow.com
              </p>
              <p>
                <strong>Website:</strong>{" "}
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
              For issues specific to the main WoltFlow service, please refer to
              our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                main Privacy Policy
              </a>
              .
            </p>
          </section>

          <Separator />

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className="text-muted-foreground">
              This privacy policy may be updated to reflect changes in the
              extension's functionality or legal requirements. Users will be
              notified of material changes through the extension update process
              or via the main WoltFlow service.
            </p>
          </section>

          <Separator />

          {/* Effective Date */}
          <section className="text-center">
            <p className="text-sm text-muted-foreground">
              This Extension Privacy Policy is effective as of January 15, 2025.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              By installing and using the WoltFlow extension, you acknowledge
              that you have read and understood this Privacy Policy.
            </p>
          </section>
        </CardContent>
      </Card>
    </Layout>
  );
}
