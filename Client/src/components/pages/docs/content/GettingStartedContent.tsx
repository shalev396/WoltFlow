import {
  Play,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Settings,
  Chrome,
  CreditCard,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export function GettingStartedContent() {
  return (
    <section id="getting-started" className="space-y-8">
      <div className="flex items-center gap-3">
        <Play className="h-8 w-8 text-green-600" />
        <h1 className="text-4xl font-bold">Getting Started</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          Follow this step-by-step guide to set up your WoltFlow automation in
          under 10 minutes. We'll walk you through everything you need to get
          your daily meal benefits automated.
        </p>
      </div>

      <div id="setup-checklist" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Setup Checklist</h2>

        <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Quick Setup Overview
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Complete these 4 main steps to activate your WoltFlow
                automation. Each step has detailed guides linked below.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <Chrome className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Get Wolt credentials</span>
              <Badge variant="secondary" className="ml-auto">
                2 options
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Add Cibus credentials</span>
              <Badge variant="secondary" className="ml-auto">
                3 fields
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Set up SMS forwarding</span>
              <Badge variant="secondary" className="ml-auto">
                For 2FA
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Set up email forwarding
              </span>
              <Badge variant="secondary" className="ml-auto">
                For codes
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white dark:bg-background rounded border">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Configure automation</span>
              <Badge variant="secondary" className="ml-auto">
                Final step
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div id="account-requirements" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Account Requirements</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Chrome className="h-5 w-5 text-blue-600" />
                Wolt Account Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                You'll need your Wolt authentication tokens to allow our
                automation to apply gift cards.
              </p>

              <div className="space-y-3">
                <h4 className="font-medium">Two Setup Options:</h4>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Chrome className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      WoltFlow Token Reviewer
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Install our browser extension and copy credentials with one
                    click.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/docs/woltflow-extension">
                      Extension Guide
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Manual Extraction
                    </span>
                    <Badge variant="secondary">Advanced</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Extract tokens manually using browser developer tools.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/docs/manual-setup">
                      Manual Guide
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                      Device Consideration
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Each device has unique tokens. Extract credentials from a
                      device you won't frequently log in/out of Wolt, as this
                      may invalidate tokens.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Cibus Account Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Simple credential entry - just your login information that you
                normally use.
              </p>

              <div className="space-y-3">
                <h4 className="font-medium">Required Information:</h4>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">Email/Username:</span>
                    <span className="text-muted-foreground">
                      Your Cibus login email
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">Password:</span>
                    <span className="text-muted-foreground">
                      Your account password
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="font-medium">Company:</span>
                    <span className="text-muted-foreground">
                      Your company identifier
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                      Secure Storage
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      All Cibus credentials are encrypted with bank-level
                      security before being stored.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="activation-guide" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Step-by-Step Activation</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Set Up Wolt Credentials
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Choose your preferred method to extract your Wolt authentication
                tokens:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  asChild
                  className="h-auto p-2 sm:p-4 justify-start w-full"
                >
                  <Link to="/docs/woltflow-extension">
                    <div className="w-full">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Chrome className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">
                            Extension Method
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs w-fit">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        Quick and easy with our extension
                      </p>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-2 sm:p-4 justify-start w-full"
                >
                  <Link to="/docs/manual-setup">
                    <div className="w-full">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">
                            Manual Method
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs w-fit">
                          Advanced
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        Extract tokens using developer tools
                      </p>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Add Cibus Credentials
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Go to the Settings page and enter your Cibus login information
                in the Cibus section.
              </p>

              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 Quick Tip:</p>
                <p className="text-sm text-muted-foreground">
                  Use the exact same credentials you use to log into Cibus
                  manually.
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Configure Forwarding
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Set up SMS and email forwarding to enable full automation:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">SMS Forwarding</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Required to handle Cibus 2FA codes automatically during
                    authentication.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Link to="/docs/sms-forwarding">Setup SMS Forwarding</Link>
                  </Button>
                </div>

                <div className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Email Forwarding</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Forward gift card emails to your WoltFlow inbox for
                    automatic code extraction.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Link to="/docs/email-forwarding">
                      Setup Email Forwarding
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Activate Automation
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Configure your automation preferences and activate the daily
                process:
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Choose automation mode (Full Run recommended)
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Set gift card amount within your Cibus allowance
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Enable automation toggle</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      You're All Set!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Once activated, WoltFlow will automatically run every day
                      at 12:00 PM Israel time. You'll receive notifications
                      about the status of each run.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Ready to Begin?</h3>
        <p className="text-muted-foreground">
          Start with getting your Wolt credentials - choose the method that
          works best for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/docs/woltflow-extension">
              Start with Extension
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/docs/manual-setup">Manual Setup Instead</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
