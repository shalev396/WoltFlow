import { Bot, Shield, Key, Smartphone, Bell, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Fully Automated",
    description:
      "Set it and forget it. WoltFlow runs automatically every weekday at optimal times.",
    benefits: [
      "No manual intervention needed",
      "Smart scheduling",
      "Handles errors gracefully",
    ],
  },
  {
    icon: Shield,
    title: "AES 256 Algorithm Security",
    description:
      "Your credentials are encrypted and stored using industry-standard AES 256 encryption.",
    benefits: [
      "End-to-end encryption",
      "Secure AWS infrastructure",
      "Regular security audits",
    ],
  },
  {
    icon: Key,
    title: "Two-Factor Authentication Support",
    description:
      "Seamlessly handles Cibus 2FA by automatically forwarding SMS codes to our system for verification.",
    benefits: [
      "Automatic SMS code processing",
      "No manual intervention needed",
      "Works with all major carriers",
    ],
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
      "Monitor and control your automation from any device, anywhere.",
    benefits: [
      "Responsive design",
      "Mobile optimized",
      "Cross-platform support",
    ],
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get notified about successful runs and any issues that occur.",
    benefits: [
      "SMS and email alerts",
      "Customizable preferences",
      "Error summaries",
    ],
  },
  {
    icon: BarChart3,
    title: "Savings Tracking",
    description:
      "See exactly how much you're saving with detailed reports and trends.",
    benefits: ["Monthly summaries", "Historical data", "Interactive Dashboard"],
  },
];

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
          Everything You Need
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Designed for reliability, security, and ease of use
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={feature.title}
              className="bg-background border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <IconComponent
                      className="size-5 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className="size-1.5 rounded-full bg-green-500 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border">
          <div
            className="size-2 rounded-full bg-green-500 animate-pulse"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">
            System Status: All Systems Operational
          </span>
        </div>
      </div>
      */}
    </section>
  );
}
