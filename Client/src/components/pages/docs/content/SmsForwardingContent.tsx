import {
  MessageCircle,
  Smartphone,
  Shield,
  Code,
  AlertCircle,
  CheckCircle,
  Apple,
  Settings,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SmsForwardingContent() {
  return (
    <section id="sms-forwarding" className="space-y-8">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold">SMS Forwarding Setup</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          SMS forwarding allows WoltFlow to automatically handle Cibus
          two-factor authentication by receiving and processing SMS verification
          codes on your behalf during automation runs.
        </p>
      </div>

      <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Why SMS Forwarding is Needed
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              When WoltFlow logs into your Cibus account, Cibus may send a
              verification code to your phone for security. SMS forwarding
              allows our automation to receive and process these codes
              automatically, ensuring uninterrupted daily runs.
            </p>
          </div>
        </div>
      </div>

      <div id="sms-api-setup" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">API Endpoint Setup</h2>

        <div className="p-3 sm:p-6 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Developer Information</h3>
          </div>

          <p className="text-muted-foreground mb-4">
            SMS forwarding requires technical setup using our API endpoint. Your
            SMS forwarding app will send HTTP requests to this endpoint when it
            receives relevant messages.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">API Endpoint URL</h4>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <code className="text-xs sm:text-sm font-mono break-all">
                  POST https://{import.meta.env.VITE_DOMAIN_NAME}
                  /api/forward/sms
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Headers</h4>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <code className="text-xs sm:text-sm text-muted-foreground font-mono break-all">
                  X-API-Key: your-api-key-here
                </code>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Request Body (JSON)</h4>
              <div className="p-2 sm:p-3 bg-background border rounded overflow-x-auto">
                <pre className="text-xs sm:text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                  {`{
  "message": "Your verification code is: 123456"
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Replace{" "}
                <code className="bg-muted px-1 rounded">your-api-key-here</code>{" "}
                with your personal API key generated from WoltFlow settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="android-setup" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Android Configuration</h2>

        <p className="text-muted-foreground">
          Choose between our official WoltFlow SMS Forwarder (recommended) or
          alternative apps for Android SMS forwarding.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-purple-100 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl text-purple-700 dark:text-purple-300">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 flex-shrink-0" />
                  <span className="break-words">WoltFlow SMS Forwarder</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800 text-xs w-fit">
                  Recommended
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Our official SMS forwarding app designed specifically for
                  WoltFlow integration. Features automatic configuration and
                  optimized performance.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-purple-600" />
                      Pre-configured for WoltFlow
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-purple-600" />
                      Automatic API key detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-purple-600" />
                      Smart filtering for 2FA codes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-purple-600" />
                      Minimal battery usage
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled
                >
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Alternative Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">SMS Forwarder</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Popular third-party app with webhook support
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Automate (Tasker)</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Advanced automation with SMS forwarding capabilities
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="ios-setup" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">iOS Configuration</h2>

        <p className="text-muted-foreground">
          iOS has strict restrictions on SMS access, but you can use the
          Shortcuts app to create automated workflows for SMS forwarding.
        </p>

        <Card className="border-2 border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-gray-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-gray-600" />
              iOS Shortcuts Setup
              <Badge variant="secondary">Semi-Automatic</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Use the iOS Shortcuts app to automatically forward SMS messages
                from Wolt Two Factor Authentication to WoltFlow.
              </p>

              <div className="space-y-4">
                <h4 className="font-medium">Step-by-Step Instructions:</h4>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Open Shortcuts App
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Launch the Shortcuts app on your iPhone and tap the
                        "Automation" tab
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Create New Automation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tap the "+" button to create a new automation
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Search for "Message"
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Search for and select "Message" as your trigger
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Configure Sender
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Set the sender to "Wolt Two Factor Authentication" (the
                        exact number will be provided later)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Message Contains
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In "Message contains", press space then enter. This
                        captures all messages from this number.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Enable Immediate Activation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Turn on "Run Immediately" to avoid manual confirmation
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      7
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Add Action: Text
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tap "New Blank Automation" then search for and add
                        "Text" action. Enter your WoltFlow API key here.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      8
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Add Action: Get Contents of URL
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Search for and add "Get Contents of URL" action
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      9
                    </div>
                    <div>
                      <p className="font-medium break-words">
                        Configure HTTP Request
                      </p>
                      <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                        <div>
                          <p className="font-medium mb-1">URL:</p>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs break-all block">
                            https://{import.meta.env.VITE_DOMAIN_NAME}
                            /api/forward/sms
                          </code>
                        </div>
                        <p>
                          <strong>Method:</strong> POST
                        </p>
                        <p>
                          <strong>Headers:</strong> Add "X-API-Key" with value
                          from the Text box (step 7)
                        </p>
                        <p>
                          <strong>Request Body:</strong> JSON format
                        </p>
                        <div>
                          <p className="font-medium mb-1">Body Content:</p>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs break-all block">
                            {'{ "message": "[Message Content from trigger]" }'}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                        iOS Limitations
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        iOS Shortcuts requires user confirmation for network
                        requests. While this setup works, it may require manual
                        approval for each SMS forward. For fully automatic
                        forwarding, consider using a dedicated Android device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Alternative iOS Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Dual Device Setup</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Use an Android device or tablet for SMS forwarding while
                  keeping your main iPhone
                </p>
                <Badge variant="outline" className="text-xs">
                  Recommended
                </Badge>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Email 2FA Switch</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Check if Cibus supports email-based 2FA instead of SMS
                </p>
                <Badge variant="outline" className="text-xs">
                  If Available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Testing Your Setup</h2>

        <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Verify SMS Forwarding
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                After setting up your SMS forwarding, send yourself a test
                message containing a 6-digit verification code. Check that the
                message is successfully forwarded to the WoltFlow API endpoint.
                You can monitor this in your app's forwarding logs.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Once SMS forwarding is configured, you can proceed to set up email
            forwarding to complete your automation setup.
          </p>
          <div className="flex justify-center">
            <Button asChild size="sm" className="max-w-xs">
              <a href="/docs/email-forwarding">
                <span className="text-xs sm:text-sm">
                  Continue to Email Forwarding Setup
                </span>
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 flex-shrink-0" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
