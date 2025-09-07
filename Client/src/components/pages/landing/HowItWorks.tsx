import { LogIn, CreditCard, Mail, Gift, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: LogIn,
    title: "Connect Your Accounts",
    description:
      "Link your Wolt and Cibus accounts using the secure credentials you provide.",
    detail: "One-time setup with AES 256 encryption security",
  },
  {
    icon: CreditCard,
    title: "Automatic Purchase",
    description:
      "WoltFlow purchases Wolt gift cards using your available Cibus meal benefits.",
    detail: "Runs daily at optimal times to maximize savings",
  },
  {
    icon: Mail,
    title: "Email Forwarding Setup",
    description:
      "Set up email forwarding from your email to WoltFlow so we can automatically retrieve gift card codes.",
    detail: "Simple Gmail forwarding configuration required",
  },
  {
    icon: Gift,
    title: "Apply to Wolt",
    description:
      "Gift card credits are automatically applied to your Wolt account balance.",
    detail: "Ready to use for your next food order",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to automate your meal benefits and never lose
            money again
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.title} className="relative">
                <Card className="bg-background border-2 hover:border-primary/20 transition-colors h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="size-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <IconComponent
                          className="size-8 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {step.detail}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow connector - mathematically centered in gap */}
                {/* Gap: lg:gap-8 (32px) | Arrow: size-6 (24px) | Center: (32÷2)-(24÷2) = 4px */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-[4px] z-10">
                    <ArrowRight
                      className="size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Fully automated • Secure • Works 24/7
          </p>
        </div>
      </div>
    </section>
  );
}
