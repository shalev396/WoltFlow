import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              WoltFlow Terms of Service
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Last Updated: August 2025
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Agreement to Terms
              </h2>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your use of WoltFlow
                ("Service"), an automated Wolt gift card purchasing platform
                operated by Shalev Ben Moshe ("we," "us," "our"). By accessing
                or using our Service, you agree to be bound by these Terms. If
                you disagree with any part of these terms, you may not access
                the Service.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Description of Service
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  WoltFlow provides automated purchasing of Wolt gift cards
                  using your Cibus meal benefits. Our service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Automated login to your Cibus account</li>
                  <li>Automated purchase of Wolt gift cards</li>
                  <li>Retrieval of gift card codes from your Gmail account</li>
                  <li>
                    Automated application of gift cards to your Wolt account
                  </li>
                  <li>Notification services for automation status</li>
                  <li>Usage monitoring and reporting</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                User Accounts and Authentication
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Creation</h3>
                  <p className="text-muted-foreground">
                    You must create an account using Google OAuth authentication
                    to use our Service. You are responsible for maintaining the
                    confidentiality of your account credentials.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Required Permissions
                  </h3>
                  <p className="text-muted-foreground">
                    By using our Service, you grant us permission to:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                    <li>
                      Access your Gmail account to retrieve Wolt gift card
                      emails
                    </li>
                    <li>
                      Store and use your Cibus credentials for automated
                      purchases
                    </li>
                    <li>
                      Store and use your Wolt tokens for automated gift card
                      application
                    </li>
                    <li>Send notifications via SMS or email as configured</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                User Responsibilities
              </h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Provide accurate and complete information when using the
                  Service
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Use the Service only for lawful purposes and in accordance
                  with these Terms
                </li>
                <li>Comply with all applicable laws and regulations</li>
                <li>
                  Not attempt to reverse engineer, hack, or interfere with the
                  Service
                </li>
                <li>
                  Not use the Service to violate the terms of service of Cibus,
                  Wolt, or Google
                </li>
                <li>
                  Promptly notify us of any unauthorized use of your account
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Service Availability and Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Service Availability
                  </h3>
                  <p className="text-muted-foreground">
                    While we strive to maintain high availability, the Service
                    may be temporarily unavailable due to maintenance, updates,
                    or factors beyond our control.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Third-Party Dependencies
                  </h3>
                  <p className="text-muted-foreground">
                    Our Service depends on third-party platforms (Cibus, Wolt,
                    Google). Changes to these platforms may affect Service
                    functionality. We are not responsible for disruptions caused
                    by third-party service changes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Limits</h3>
                  <p className="text-muted-foreground">
                    Automation frequency and gift card amounts are subject to
                    the limits and policies of Cibus and Wolt. We may implement
                    reasonable usage limits to ensure Service stability.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data and Privacy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Data Processing</h3>
                  <p className="text-muted-foreground">
                    We process your personal data in accordance with our Privacy
                    Policy. This includes storing encrypted credentials,
                    accessing Gmail for gift card retrieval, and maintaining
                    automation logs.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Data Security</h3>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures including
                    encryption, secure AWS cloud infrastructure, and access
                    controls to protect your data.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Gmail API Usage</h3>
                  <p className="text-muted-foreground">
                    Our use of Gmail API is limited to reading Wolt gift card
                    emails. We do not access, read, or store any other emails or
                    personal information from your Gmail account.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Fees and Payment</h2>
              <p className="text-muted-foreground">
                WoltFlow is currently provided as a free service. We reserve the
                right to introduce fees in the future with appropriate notice to
                users. Any future fees will be clearly communicated before
                implementation.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Our Rights</h3>
                  <p className="text-muted-foreground">
                    WoltFlow, including its source code, design, and
                    documentation, is owned by Shalev Ben Moshe and protected by
                    intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Your Data</h3>
                  <p className="text-muted-foreground">
                    You retain ownership of your data. You grant us a limited
                    license to process your data solely for providing the
                    Service.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Disclaimers and Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Service Disclaimer
                  </h3>
                  <p className="text-muted-foreground">
                    THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY
                    KIND. WE DO NOT GUARANTEE UNINTERRUPTED SERVICE OR
                    ERROR-FREE OPERATION.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Limitation of Liability
                  </h3>
                  <p className="text-muted-foreground">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE
                    LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR
                    PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Third-Party Services
                  </h3>
                  <p className="text-muted-foreground">
                    We are not responsible for the performance, availability, or
                    policies of third-party services (Cibus, Wolt, Google) that
                    our Service integrates with.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Termination by You
                  </h3>
                  <p className="text-muted-foreground">
                    You may terminate your account at any time by deleting your
                    account through the Service interface or contacting us.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Termination by Us
                  </h3>
                  <p className="text-muted-foreground">
                    We may terminate or suspend your account immediately if you
                    violate these Terms or engage in behavior that could harm
                    the Service or other users.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Effect of Termination
                  </h3>
                  <p className="text-muted-foreground">
                    Upon termination, your access to the Service will cease, and
                    we will delete your personal data in accordance with our
                    Privacy Policy.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will
                notify users of material changes via email or through the
                Service. Continued use of the Service after changes constitutes
                acceptance of the new Terms.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance
                with the laws of Israel. Any disputes arising under these Terms
                shall be subject to the exclusive jurisdiction of the courts of
                Israel.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please
                  contact WoltFlow at support
                </p>
                {/* <div className="pl-4 space-y-1 text-muted-foreground">
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:legal@woltflow.com"
                      className="text-blue-600 hover:underline"
                    >
                      legal@woltflow.com
                    </a>
                  </p>
                  <p>
                    Website:{" "}
                    <a
                      href="https://www.shalev396.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      www.shalev396.com
                    </a>
                  </p>
                </div> */}
              </div>
            </section>

            <Separator />

            <section>
              <p className="text-sm text-muted-foreground text-center">
                By using WoltFlow, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
