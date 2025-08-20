import {
  Mail,
  Settings,
  CheckCircle,
  Info,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function EmailForwardingContent() {
  return (
    <section id="email-forwarding" className="space-y-8">
      <div className="flex items-center gap-3">
        <Mail className="h-8 w-8 text-green-600" />
        <h1 className="text-4xl font-bold">Email Forwarding</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          Email forwarding ensures that gift card codes sent to your email are
          automatically forwarded to your{" "}
          <Link
            to="/docs/inbox"
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium underline"
          >
            WoltFlow inbox
          </Link>{" "}
          for processing. This enables our automation to extract codes and apply
          them to your Wolt account.
        </p>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              How Email Forwarding Works
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              When you purchase a gift card using Cibus, the confirmation email
              with the redemption code is automatically forwarded from your
              Gmail to your personal WoltFlow inbox. Our system then extracts
              the code and applies it to your Wolt account.
            </p>
          </div>
        </div>
      </div>

      <div id="gmail-forwarding" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Gmail Forwarding Setup</h2>

        <p className="text-muted-foreground">
          Gmail natively supports email forwarding, making it the perfect
          solution for WoltFlow automation. Currently, we have verified support
          for Gmail, though other email providers may work similarly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-lg sm:text-xl text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span className="break-words">Native Gmail Forwarding</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Gmail's built-in forwarding feature automatically sends copies
                  of incoming emails to another address.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Benefits:</h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>Instant forwarding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>No additional apps needed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>Reliable and secure</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span>Works with filters</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Settings className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <span className="break-words">Your WoltFlow Inbox</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Each WoltFlow user gets a unique email address for receiving
                  forwarded emails.
                </p>

                <div className="p-2 sm:p-3 bg-muted rounded-lg overflow-hidden">
                  <div className="flex items-start gap-2 mb-2">
                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="font-mono text-xs text-muted-foreground break-all">
                      [your-unique-id]@users.woltflow.shalev396.com
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This address is automatically generated and linked to your
                    account
                  </p>
                </div>

                <Button asChild size="sm" className="w-full">
                  <Link to="/inbox">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">View Your Inbox</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Step-by-Step Gmail Setup</h3>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Open Gmail Settings</h4>
                <p className="text-muted-foreground">
                  Log into your Gmail account and click the gear icon in the
                  top-right corner, then select "See all settings" from the
                  dropdown menu.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://mail.google.com/mail/u/0/#settings/general"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Open Gmail Settings
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  Navigate to Forwarding Tab
                </h4>
                <p className="text-muted-foreground">
                  In the Gmail settings page, click on the "Forwarding and
                  POP/IMAP" tab at the top of the settings panel.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">
                  Add Forwarding Address
                </h4>
                <p className="text-muted-foreground">
                  Click "Add a forwarding address" and enter your WoltFlow inbox
                  email address. Gmail will send a verification email to confirm
                  the forwarding setup.
                </p>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Your WoltFlow address:</strong> Check your WoltFlow
                    inbox page to find your unique email address for forwarding
                    setup.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Verify Forwarding</h4>
                <p className="text-muted-foreground">
                  Gmail will send a verification code to your WoltFlow inbox.
                  Check your WoltFlow inbox for the verification email and click
                  the confirmation link or enter the code.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Enable Forwarding</h4>
                <p className="text-muted-foreground">
                  After verification, return to Gmail settings and select
                  "Forward a copy of incoming mail to" and choose your WoltFlow
                  address. You can choose to keep Gmail's copy or delete it.
                </p>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      <strong>Recommendation:</strong> Choose "keep Gmail's copy
                      in the Inbox" to maintain your email backups while
                      enabling forwarding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="email-filters" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">
          Email Filters for Targeted Forwarding
        </h2>

        <p className="text-muted-foreground">
          Instead of forwarding all emails, you can create Gmail filters to
          forward only specific emails (like gift card confirmations) to your
          WoltFlow inbox. This keeps your WoltFlow inbox clean and focused on
          automation-related emails.
        </p>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Creating a Wolt Gift Card Filter
          </h3>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Access Gmail Filters</p>
                <p className="text-sm text-muted-foreground">
                  In Gmail settings, go to "Filters and Blocked Addresses" tab
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Create New Filter</p>
                <p className="text-sm text-muted-foreground">
                  Click "Create a new filter" and set up criteria to match Wolt
                  gift card emails
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Set Filter Criteria</p>
                <div className="mt-2 space-y-2">
                  <div className="p-2 bg-background border rounded text-sm">
                    <strong>From:</strong> info@wolt.com
                  </div>
                  <div className="p-2 bg-background border rounded text-sm">
                    <strong>Subject:</strong> הגיפט קארד של Wolt הגיע ומחכה
                    לשליחה :)
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">Set Forward Action</p>
                <p className="text-sm text-muted-foreground">
                  Choose "Forward it to" and select your WoltFlow email address
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Filter className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Filter Benefits
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                Using filters ensures only relevant emails are forwarded to
                WoltFlow, keeping your automation inbox clean and reducing
                processing overhead. You'll still receive all emails in your
                Gmail inbox normally.
              </p>
            </div>
          </div>
        </div> */}

        <div className="p-3 sm:p-6 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                Important: Filter Setup Required
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                If no specific filter is set up or applied properly, all emails
                from your Gmail will be forwarded to your WoltFlow inbox. We
                strongly recommend setting up the exact filter criteria shown
                above to ensure only Wolt gift card emails are forwarded.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="other-providers" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Other Email Providers</h2>

        <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Gmail Recommended
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                While other email providers may support similar forwarding
                features, we have thoroughly tested and verified the setup
                process with Gmail. For the most reliable experience, we
                recommend using Gmail for WoltFlow automation.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Outlook/Hotmail
                <Badge variant="secondary">Untested</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Microsoft Outlook supports email forwarding through rules and
                  may work with WoltFlow, but we haven't verified the complete
                  setup process.
                </p>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    If you need to use Outlook, the general process should be
                    similar to Gmail's forwarding setup, but specific steps may
                    vary.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Other Providers
                <Badge variant="outline">Possible</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Most modern email providers (Yahoo, ProtonMail, etc.) offer
                  forwarding features that should be compatible with WoltFlow.
                </p>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Look for "Email Forwarding" or "Mail Rules" in your
                    provider's settings. The setup should follow similar
                    principles to Gmail.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Email Forwarding Complete!
            </p>
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 leading-relaxed break-words">
              With email forwarding configured, gift card codes will
              automatically arrive in your WoltFlow inbox for processing. You
              can now view your{" "}
              <Link
                to="/docs/inbox"
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium underline break-words"
              >
                WoltFlow inbox
              </Link>{" "}
              and complete your automation setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-3 max-w-full">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link to="/inbox">
                  <span className="text-xs sm:text-sm">View Your Inbox</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 flex-shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Link to="/docs/getting-started#activation-guide">
                  <span className="text-xs sm:text-sm">Complete Setup</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
