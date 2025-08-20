import {
  Inbox,
  Shield,
  Mail,
  Download,
  Search,
  CheckCircle,
  Info,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function InboxContent() {
  return (
    <section id="inbox" className="space-y-8">
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-purple-600" />
        <h1 className="text-4xl font-bold">Your WoltFlow Inbox</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          Every WoltFlow user receives a personalized email address for
          receiving gift card codes and automation-related emails. Your inbox is
          completely private, secure, and managed exclusively for your
          automation needs.
        </p>
      </div>

      <div className="p-3 sm:p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
        <div className="flex items-start gap-3">
          <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Your Personal Email Address
            </p>
            <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 leading-relaxed break-words mb-3">
              When you set up WoltFlow, you automatically receive a unique email
              address in this format:
            </p>
            <div className="p-2 sm:p-3 bg-purple-100/70 dark:bg-purple-900/30 rounded border overflow-x-auto">
              <code className="text-xs font-mono text-purple-800 dark:text-purple-200 break-all block">
                [your-unique-id]@users.woltflow.shalev396.com
              </code>
            </div>
            <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 leading-relaxed break-words mt-2">
              This address is exclusively yours and cannot be mixed with other
              users' emails.
            </p>
          </div>
        </div>
      </div>

      <div id="inbox-overview" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">How Your Inbox Works</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Mail className="h-5 w-5" />
                Email Reception
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your WoltFlow inbox is kept for 30 days and only saves
                  WoltFlow gift card emails based on the filter you set in your
                  email forwarding.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Email Content:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Wolt gift card emails
                    </li>
                    {/* <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Only emails with gift card codes
                    </li> */}
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Filtered based on your forwarding settings
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                Automatic Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  The system automatically processes incoming emails to extract
                  relevant information.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Auto-Processing:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Gift card code extraction
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Automatic code application
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Secure storage and processing
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Email Processing Flow</h3>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Email Arrival</p>
                <p className="text-sm text-muted-foreground">
                  Emails arrive at your personalized WoltFlow inbox address
                  through forwarding or direct sending
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Email Storage</p>
                <p className="text-sm text-muted-foreground">
                  Emails are kept securely in your inbox based on the filter
                  criteria you set up
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Code Extraction During Automation</p>
                <p className="text-sm text-muted-foreground">
                  When the automation runs, it extracts the gift card code from
                  the email received today that matches the correct subject and
                  sender
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">Display in Inbox</p>
                <p className="text-sm text-muted-foreground">
                  Processed emails appear in your WoltFlow inbox interface for
                  review and management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="managing-emails" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Managing Your Emails</h2>

        <p className="text-muted-foreground">
          Your WoltFlow inbox provides a clean, organized interface for viewing
          and managing all emails received by your automation system. Access
          your inbox anytime to review email history and download attachments.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Inbox Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>
                      Clean, organized email interface similar to Gmail
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Automatic code extraction and highlighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Full email content display with HTML rendering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Responsive design for mobile and desktop</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Search emails by sender, subject, or content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Date range filtering for historical emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Quick access to recent and important emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                    <span>Pagination for large email volumes</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Attachment Handling</h3>

          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Secure Attachment Downloads
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  Emails with attachments (PDFs, images, documents) can be
                  downloaded securely through your WoltFlow inbox. We handle
                  almost all attachment types (.pdf, .png, .jpg, .doc, etc.).
                  Downloads are secure because only authorized users can access
                  them from our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-1">
                  PDF
                </Badge>
                Gift Card PDFs
              </h4>
              <p className="text-sm text-muted-foreground">
                Download PDF gift card confirmations with embedded codes and
                terms
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-1">
                  IMG
                </Badge>
                Visual Confirmations
              </h4>
              <p className="text-sm text-muted-foreground">
                Download images containing QR codes or visual gift card
                representations
              </p>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/inbox">
            <Inbox className="h-4 w-4 mr-2" />
            Access Your Inbox Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div id="inbox-privacy" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Privacy & Security</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-100 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-red-700 dark:text-red-300">
                <Shield className="h-5 w-5" />
                Data Isolation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your inbox is completely isolated from other users' data with
                  multiple security layers.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Security Measures:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Unique email address per user
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Database-level data separation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Encrypted email storage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Access control authentication
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <Eye className="h-5 w-5" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  We maintain strict privacy standards for all email content and
                  attachments.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Privacy Commitments:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      No manual reading of emails
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Automated processing only
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      No data sharing with third parties
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      User-controlled data retention
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Data Retention Policy</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-3 sm:p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                30 Days
              </div>
              <div className="text-sm font-medium mb-2">Email Storage</div>
              <p className="text-xs text-muted-foreground">
                Full email content and attachments
              </p>
            </div>

            <div className="p-3 sm:p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                30 Days
              </div>
              <div className="text-sm font-medium mb-2">Extracted Codes</div>
              <p className="text-xs text-muted-foreground">
                Gift card codes for automation use
              </p>
            </div>

            <div className="p-3 sm:p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                90 Days
              </div>
              <div className="text-sm font-medium mb-2">Processing Logs</div>
              <p className="text-xs text-muted-foreground">
                System logs and processing history
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Your Data, Your Control
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                You have complete control over your inbox data. You can delete
                individual emails, clear your entire inbox, or delete your
                account (which removes all associated data) at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Ready to Use Your Inbox?</h3>
        <p className="text-muted-foreground">
          Your personalized WoltFlow inbox is ready to receive and process
          emails for your automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/inbox">
              View Your Inbox
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/docs/email-forwarding">Setup Email Forwarding</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
