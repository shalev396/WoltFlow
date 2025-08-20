import {
  BookOpen,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function IntroductionContent() {
  return (
    <section id="introduction" className="space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold">Welcome to WoltFlow</h1>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          WoltFlow is an automation solution that helps you maximize your meal
          benefits by automatically claiming your Cibus credits and converting
          them to Wolt gift cards every day.
        </p>
      </div>

      <div id="what-is-woltflow" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">What is WoltFlow?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-300">
                <Zap className="h-5 w-5" />
                Automated Solution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A comprehensive automation system that handles your entire meal
                benefit workflow, from claiming to redemption, without any
                manual intervention required.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                Daily Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically claims your daily Cibus meal allowance and
                converts it to Wolt credits, ensuring you never miss out on your
                benefits.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border">
          <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">
            Transform Your Meal Benefits Workflow
          </h3>
          <p className="text-muted-foreground mb-4">
            Instead of manually logging into Cibus daily, purchasing gift cards,
            waiting for emails, and then redeeming codes on Wolt, WoltFlow
            handles this entire process automatically.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Clock className="h-4 w-4" />
            <span>Save 5-10 minutes daily with automated processing</span>
          </div>
        </div>
      </div>

      <div id="how-it-works" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">How It Works</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Daily Automation Trigger
              </h3>
              <p className="text-muted-foreground">
                Every day at 12:00 PM Israel time (noon), our secure automation
                system initiates your personalized meal benefit process.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Secure Account Access
              </h3>
              <p className="text-muted-foreground">
                Using your encrypted credentials, the system securely logs into
                both your Cibus and Wolt accounts to begin the transfer process.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Gift Card Purchase</h3>
              <p className="text-muted-foreground">
                The automation purchases a Wolt gift card using your available
                Cibus balance, with the amount you've configured in your
                settings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Email Processing</h3>
              <p className="text-muted-foreground">
                The gift card code is forwarded to{" "}
                <Link
                  to="/docs/inbox"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  your personalized WoltFlow email address
                </Link>
                , where our system automatically extracts the redemption code.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              5
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Automatic Redemption
              </h3>
              <p className="text-muted-foreground">
                The extracted gift card code is automatically applied to your
                Wolt account, instantly adding the credit balance for your next
                order.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                Perfect Timing, Every Day
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                We run the automation at 12:00 PM Israel time, ensuring maximum
                success rates for your daily claims.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="security-privacy" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Security & Privacy</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-orange-100 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-orange-700 dark:text-orange-300">
                <Shield className="h-5 w-5" />
                Bank-Level Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  All credentials encrypted with AES-256
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Secure AWS infrastructure hosting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  TLS 1.3 for all data transmission
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-purple-700 dark:text-purple-300">
                <Shield className="h-5 w-5" />
                Individual Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Unique email address per user
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Complete data isolation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  No cross-user data mixing
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Your Data, Your Control
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                Each user receives a completely isolated email address and data
                environment. We only access the minimum information required for
                the automation to function, and all data is encrypted both in
                transit and at rest. You can delete your account and all
                associated data at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button asChild size="lg" className="group">
          <Link to="/docs/getting-started">
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/docs/woltflow-extension">Download Extension</Link>
        </Button>
      </div>
    </section>
  );
}
