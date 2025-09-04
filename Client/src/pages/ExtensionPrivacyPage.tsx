import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import Layout from "@/components/shared/Layout";

const EXTENSION_PRIVACY_POLICY_CONFIG = {
  lastUpdated: "04/09/2025",
  contactEmail: "shalev396@gmail.com",
  extensionDeveloper: "Shalev Ben-Moshe (individual, side-project)",
};

export default function ExtensionPrivacyPage() {
  return (
    <Layout
      title="WoltFlow Token Reviewer Privacy Policy"
      description="Privacy policy for the WoltFlow Token Reviewer browser extension"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            WoltFlow Token Reviewer Privacy Policy
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Last Updated: {EXTENSION_PRIVACY_POLICY_CONFIG.lastUpdated}
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              The WoltFlow Token Reviewer is a simple browser extension that
              displays your Wolt access and refresh tokens when you click on it.
              This privacy policy explains how the extension handles your data
              and clarifies that no data ever leaves your browser unless you
              manually copy and paste it.
            </p>
          </section>

          <Separator />

          {/* What the Extension Does */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              What the Extension Does
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Token Display</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    Reads your Wolt access token and refresh token from browser
                    cookies
                  </li>
                  <li>
                    Displays the tokens in a simple popup interface when you
                    click the extension
                  </li>
                  <li>
                    Shows copy buttons next to each token for easy clipboard
                    copying
                  </li>
                  <li>
                    Only activates when you manually click the extension button
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Browser Permissions
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>Cookies:</strong> Read cookies from Wolt domains to
                    display your authentication tokens
                  </li>
                  <li>
                    <strong>Host Permissions:</strong> Access to *.wolt.com
                    domains only to read authentication cookies
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
                <h3 className="text-lg font-medium mb-2">What We Access</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Wolt refresh tokens (from browser cookies only)</li>
                  <li>Wolt access tokens (from browser cookies only)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Storage</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>No Storage:</strong> Extension doesn't store any
                    data anywhere - not locally, not remotely
                  </li>
                  <li>
                    <strong>Display Only:</strong> Tokens are only displayed in
                    the popup interface while it's open
                  </li>
                  <li>
                    <strong>No Persistence:</strong> When you close the popup,
                    nothing is saved or remembered
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Transmission</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>NO Data Transmission:</strong> The extension never
                    sends any data to any servers, ever
                  </li>
                  <li>
                    <strong>No Network Requests:</strong> Extension makes zero
                    network calls or connections
                  </li>
                  <li>
                    <strong>Manual Only:</strong> Data only leaves your browser
                    if you manually copy it to your clipboard and paste it
                    elsewhere
                  </li>
                  <li>
                    <strong>Completely Local:</strong> Everything happens
                    locally in your browser
                  </li>
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
                  <li>
                    No data transmission means no transmission security concerns
                  </li>
                  <li>No local storage or caching of any data</li>
                  <li>
                    Extension operates only when you click the popup button
                  </li>
                  <li>No automatic, background, or scheduled operations</li>
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
                  <li>Full control over when tokens are displayed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Control</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    Tokens displayed are your existing Wolt authentication
                    cookies
                  </li>

                  <li>
                    You control if/when/where you use the copied token
                    information
                  </li>
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
              The extension only accesses browser cookies - it does not
              communicate with any external services or servers:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Cookie Access Only</h3>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    <strong>*.wolt.com cookies:</strong> Extension reads your
                    existing authentication cookies from Wolt domains
                  </li>
                  <li>
                    <strong>No API calls:</strong> Extension never communicates
                    with Wolt servers or any other servers
                  </li>
                  <li>
                    <strong>No WoltFlow communication:</strong> Extension does
                    not send any data to WoltFlow servers
                  </li>
                  <li>
                    Extension only reads existing authentication data locally
                  </li>
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
                <strong>Extension Developer:</strong>{" "}
                {EXTENSION_PRIVACY_POLICY_CONFIG.extensionDeveloper}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {EXTENSION_PRIVACY_POLICY_CONFIG.contactEmail}
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
              This Extension Privacy Policy is effective as of{" "}
              {EXTENSION_PRIVACY_POLICY_CONFIG.lastUpdated}.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              By installing and using the WoltFlow Token Reviewer extension, you
              acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>
        </CardContent>
      </Card>
    </Layout>
  );
}
