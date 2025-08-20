import {
  Cog,
  Info,
  Play,
  ShoppingCart,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Zap,
  ToggleLeft,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AutomationSettingsContent() {
  return (
    <section id="automation-settings" className="space-y-8">
      <div className="flex items-center gap-3">
        <Cog className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-4xl font-bold">Automation Settings</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">Configuration</Badge>
            <Badge variant="outline">Final Setup</Badge>
          </div>
        </div>
      </div>

      <div className="text-lg text-muted-foreground leading-relaxed">
        <p>
          Configure your automation preferences to control how WoltFlow
          processes your meal benefits. These settings determine whether to
          automatically redeem gift cards, set purchase amounts, and activate
          the automation system.
        </p>
      </div>

      <div id="automation-modes" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Automation Modes</h2>

        <p className="text-muted-foreground leading-relaxed">
          WoltFlow offers different automation modes to match your preferences
          and use case. Choose the mode that best fits how you want to manage
          your meal benefits and Wolt gift cards.
        </p>

        <div className="grid gap-6">
          <Card className="border-2 border-green-100 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-green-600" />
                Full Automation
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Recommended
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Complete end-to-end automation that handles everything from
                  purchase to application. This is the most convenient option
                  for daily use.
                </p>

                <div className="space-y-3">
                  <h5 className="font-medium">Automation Process:</h5>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-background rounded-lg border">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        1
                      </div>
                      <span className="text-sm">
                        Refresh Wolt authentication tokens
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-background rounded-lg border">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        2
                      </div>
                      <span className="text-sm">
                        Log into Cibus and purchase gift card
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-background rounded-lg border">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        3
                      </div>
                      <span className="text-sm">
                        Extract gift card code from inbox email
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-background rounded-lg border">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        4
                      </div>
                      <span className="text-sm">
                        Apply gift card to your Wolt account
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Best for:</strong> Users who want completely
                    hands-off automation with their meal benefits automatically
                    converted to Wolt credits daily.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                Buy Only Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Purchases gift cards from Cibus but leaves manual application
                  to you. Perfect for users who want control over when codes are
                  applied.
                </p>

                <div className="space-y-3">
                  <h5 className="font-medium">What Happens:</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      Automatically purchases gift cards from Cibus
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      Gift card codes are stored in your inbox
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      You manually apply codes to Wolt when needed
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Best for:</strong> Users who want to accumulate
                    credits or prefer manual control over when gift cards are
                    applied to Wolt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6 text-purple-600" />
                Cross Account Mode
                <Badge variant="outline">Advanced</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Advanced mode for complex setups where Cibus and Wolt accounts
                  belong to different users or require specialized handling.
                </p>

                <div className="space-y-3">
                  <h5 className="font-medium">Use Cases:</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      Different Cibus and Wolt account owners
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      Family or household account management
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      Business or team meal benefit coordination
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      Multiple benefit accounts to single Wolt account
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <strong>Note:</strong> This mode requires additional
                    configuration and may need manual intervention for some
                    operations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="gift-card-settings" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Gift Card Amount Settings</h2>

        <p className="text-muted-foreground leading-relaxed">
          Configure the default amount for gift card purchases. This should
          align with your daily Cibus allowance to maximize the benefit while
          staying within limits.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Choosing Your Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select a gift card amount that fits within your Cibus daily
                  allowance. Most users benefit from amounts between ₪50-100.
                </p>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Common Amounts:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 border rounded text-center">
                      <div className="font-semibold">₪50</div>
                      <div className="text-xs text-muted-foreground">
                        Small meals
                      </div>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="font-semibold">₪75</div>
                      <div className="text-xs text-muted-foreground">
                        Standard
                      </div>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="font-semibold">₪100</div>
                      <div className="text-xs text-muted-foreground">
                        Large orders
                      </div>
                    </div>
                    <div className="p-2 border rounded text-center">
                      <div className="font-semibold">₪150</div>
                      <div className="text-xs text-muted-foreground">
                        Premium
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
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Important Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  Choose an amount within your daily Cibus allowance
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  Consider your typical Wolt order values
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  Account for weekend/holiday allowances
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  You can change this amount anytime in settings
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="activation-settings" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Automation Activation</h2>

        <p className="text-muted-foreground leading-relaxed">
          Control when and how your automation runs. You can activate or
          deactivate the automation system at any time, and configure run
          scheduling for optimal convenience.
        </p>

        <div className="grid gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="h-6 w-6 text-green-600" />
                Enable/Disable Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use the master toggle in your settings to activate or
                  deactivate the entire automation system. When disabled, no
                  automatic runs will occur.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-900 dark:text-green-100 text-sm mb-1">
                      When Enabled
                    </p>
                    <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                      <li>• Daily automation runs at 12 PM Israel time</li>
                      <li>• Processes meal benefits automatically</li>
                      <li>• Applies gift cards to your Wolt account</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
                      When Disabled
                    </p>
                    <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                      <li>• No automatic runs will occur</li>
                      <li>• You can still trigger manual runs</li>
                      <li>• All credentials and settings are preserved</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                Automation Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  WoltFlow automatically runs daily at 12:00 PM Israel time
                  (UTC+2/UTC+3) to process your meal benefits when they're most
                  likely to be available.
                </p>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Why 12 PM Israel Time?
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        This timing ensures maximum success rate as most Cibus
                        allowances refresh in the morning and are available by
                        noon. The automation also avoids peak meal ordering
                        times.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Weekdays</div>
                    <div className="text-xs text-muted-foreground">Mon-Fri</div>
                    <div className="text-xs text-green-600 font-medium">
                      Active
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Saturdays</div>
                    <div className="text-xs text-muted-foreground">Weekend</div>
                    <div className="text-xs text-blue-600 font-medium">
                      Configurable
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Sundays</div>
                    <div className="text-xs text-muted-foreground">Weekend</div>
                    <div className="text-xs text-blue-600 font-medium">
                      Configurable
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="setup-instructions" className="space-y-6 scroll-mt-32">
        <h2 className="text-3xl font-semibold">Configuring Your Settings</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Access Automation Settings
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Navigate to your WoltFlow settings page and locate the
                "Automation Settings" section where you can configure all
                automation preferences.
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
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Choose Automation Mode
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Select your preferred automation mode based on how you want to
                handle the gift card purchase and application process.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Choose Full Automation (recommended for most users)
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Or select Buy Only if you prefer manual application
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Choose Cross Account for advanced multi-user setups
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Set Gift Card Amount
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Choose your default gift card amount that aligns with your Cibus
                daily allowance. This can be adjusted anytime based on your
                needs.
              </p>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      Stay Within Your Allowance
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Make sure the amount you choose doesn't exceed your daily
                      Cibus benefit allowance to avoid failed automation runs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-semibold break-words">
                Activate Automation
              </h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              <p className="text-muted-foreground">
                Enable the automation toggle to start automatic daily runs. You
                can disable this anytime if you need to pause the automation.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Turn on the automation toggle</span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Verify all your credentials are configured
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Save settings to begin automation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Automation Setup Complete!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              Your automation settings are now configured. WoltFlow will
              automatically process your meal benefits daily at 12 PM Israel
              time. You can monitor automation runs and adjust settings anytime
              from your dashboard.
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/runs">View Automation Runs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
