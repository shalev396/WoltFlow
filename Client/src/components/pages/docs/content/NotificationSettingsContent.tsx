import { Bell, MessageCircle, Mail, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NotificationSettingsContent() {
  return (
    <section id="notifications" className="space-y-8">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8" />
        <h2 className="text-3xl font-bold">Notification Settings</h2>
      </div>

      <div id="notification-methods" className="space-y-6">
        <h3 className="text-2xl font-semibold">Notification Methods</h3>

        <p className="text-muted-foreground">
          Stay informed about your automation runs with configurable
          notifications:
        </p>

        <div className="grid gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              SMS Notifications
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get instant text messages about run status and results.
            </p>
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Setup requirements:</h5>
              <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                <li>Valid phone number in international format</li>
                <li>SMS verification required</li>
                <li>Standard SMS rates may apply</li>
              </ul>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Receive detailed email reports about automation runs.
            </p>
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Features:</h5>
              <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                <li>Detailed run logs and screenshots</li>
                <li>Error diagnostics and troubleshooting tips</li>
                <li>Success summaries with applied amounts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Notification Types</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Success notifications</span>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Error notifications</span>
              <Badge variant="secondary">Recommended</Badge>
            </div>
          </div>
        </div>
      </div>

      <div id="notification-verification" className="space-y-6">
        <h3 className="text-2xl font-semibold">Contact Verification</h3>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Verification Required
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                All contact methods must be verified before notifications can be
                enabled.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Verification Process</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Enter your phone number or email address</li>
            <li>Click "Send Verification Code"</li>
            <li>Check your SMS/email for the 6-digit code</li>
            <li>Enter the code within 10 minutes</li>
            <li>Your contact method is now verified and active</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Managing Verified Contacts</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>You can update verified contacts at any time</li>
            <li>Changing a contact requires re-verification</li>
            <li>Remove unused contacts to maintain security</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
