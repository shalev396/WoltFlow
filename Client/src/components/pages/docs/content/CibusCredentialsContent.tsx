import {
  CreditCard,
  CheckCircle,
  Info,
  User,
  Lock,
  Building,
  Settings,
  Shield,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CibusCredentialsContent() {
  return (
    <section id="cibus-credentials" className="space-y-8">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-4xl font-bold">Cibus Credentials</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">Required</Badge>
            <Badge variant="outline">Account Setup</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          Your Cibus credentials are essential for WoltFlow to access your meal
          benefits and automatically purchase Wolt gift cards on your behalf.
          These credentials are input in your settings and used by the
          automation to log into your Cibus account during each run.
        </p>
      </div>

      <div id="what-is-cibus" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          Understanding Cibus Integration
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          Cibus is a popular meal benefits platform used by many companies to
          provide food allowances to their employees. WoltFlow connects to your
          Cibus account to automatically convert your meal benefits into Wolt
          gift cards, streamlining your food ordering experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <CreditCard className="h-5 w-5" />
                What WoltFlow Does
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Logs into your Cibus account securely
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Purchases Wolt gift cards using your meal benefits
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Handles 2FA verification automatically
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Operates within your benefit allowance limits
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  All credentials are encrypted at rest
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  Secure transmission over HTTPS
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  No credential sharing or third-party access
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  You can delete your data at any time
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="required-credentials" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Required Credentials</h2>

        <p className="text-muted-foreground leading-relaxed">
          To set up the Cibus integration, you'll need to provide three pieces
          of information that you use to log into your Cibus account:
        </p>

        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                Username/Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  The email address or username you use to log into your Cibus
                  account. This is typically your work email address.
                </p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-1">Examples:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• john.doe@company.com</li>
                    <li>• johndoe (if using a username)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-orange-600" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your Cibus account password. This will be encrypted and stored
                  securely in our systems and never transmitted in plain text.
                </p>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                        Password Security
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        We use industry-standard AES encryption to protect your
                        password. Only the automation system can decrypt it
                        during runs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-purple-600" />
                Company Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your company identifier in Cibus. This is usually your
                  company's name as it appears in the Cibus system, used to
                  direct the login to the correct company portal.
                </p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium mb-2">
                    How to find your company name:
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Log into your Cibus account normally</li>
                    <li>Check the URL or company branding on the login page</li>
                    <li>
                      Look for the company identifier in your account settings
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="setup-instructions" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Setting Up Your Credentials</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Access WoltFlow Settings
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Navigate to your WoltFlow settings page where you can configure
                all your account credentials and automation preferences.
              </p>

              <Button asChild className="inline-flex">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings Page
                </Link>
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Locate Cibus Credentials Section
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                In the settings page, find the "Cibus Credentials" section. This
                is where you'll input your login information that the automation
                will use to access your Cibus account.
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Enter Your Credentials
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Fill in all three required fields with your Cibus login
                information. Make sure the information matches exactly what you
                use to log into Cibus manually.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Enter your Cibus username/email
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Enter your Cibus password</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Enter your company name</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Save and Test
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Save your credentials and test the connection to ensure WoltFlow
                can successfully access your Cibus account. The system will
                verify your credentials during the next automation run.
              </p>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Testing Your Setup
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      The best way to test your Cibus credentials is to trigger
                      a manual automation run after setting up all your
                      credentials and forwarding configurations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="cibus-2fa" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          Two-Factor Authentication (2FA)
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          If your Cibus account has two-factor authentication enabled via SMS,
          WoltFlow can handle verification codes automatically through SMS
          forwarding. This ensures seamless automation even with enhanced
          security measures.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                SMS 2FA Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                  Automatic SMS code detection
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                  Real-time code processing during runs
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                  No manual intervention required
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                  Works with all major SMS providers
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Setup Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Configure SMS forwarding in your settings</li>
                <li>Ensure your phone number matches Cibus registration</li>
                <li>Test the forwarding with a manual 2FA trigger</li>
                <li>Verify automation can receive and process codes</li>
              </ol>
              <div className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link to="/docs/sms-forwarding">Setup SMS Forwarding</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Seamless Integration
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                Once SMS forwarding is configured, 2FA codes are processed
                completely automatically during automation runs. You don't need
                to manually enter codes or monitor the process - WoltFlow
                handles everything behind the scenes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="troubleshooting" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Troubleshooting</h2>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Common Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-2">
                    Login Failed - Invalid Credentials
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>
                      Double-check your username, password, and company name
                    </li>
                    <li>
                      Try logging into Cibus manually to verify credentials
                    </li>
                    <li>Ensure there are no extra spaces or typos</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">
                    2FA Codes Not Being Processed
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Verify SMS forwarding is configured correctly</li>
                    <li>
                      Check that your phone number matches Cibus registration
                    </li>
                    <li>
                      Test SMS forwarding manually by triggering a 2FA code
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-sm mb-2">Company Not Found</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>
                      Contact your HR department for the correct company
                      identifier
                    </li>
                    <li>
                      Check the Cibus login page URL for company information
                    </li>
                    <li>
                      Try variations of your company name (with/without spaces,
                      abbreviations)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Credentials Setup Complete!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              Once your Cibus credentials are configured, you can continue with
              the remaining setup steps including SMS forwarding, email
              forwarding, and automation settings to complete your WoltFlow
              configuration.
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm">
                <Link to="/docs/getting-started">Continue Setup Guide</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/docs/sms-forwarding">Setup SMS Forwarding</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
