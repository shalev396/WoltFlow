import { Bot, Shield, Key, Smartphone, Bell, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featureKeys = [
  "automated",
  "security",
  "twoFactor",
  "mobile",
  "notifications",
  "tracking",
] as const;

const featureIcons = {
  automated: Bot,
  security: Shield,
  twoFactor: Key,
  mobile: Smartphone,
  notifications: Bell,
  tracking: BarChart3,
};

export default function Features() {
  const { t } = useTranslation("landing");

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
          {t("features.title")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("features.subtitle")}
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {featureKeys.map((featureKey) => {
          const IconComponent = featureIcons[featureKey];
          const benefits = t(`features.list.${featureKey}.benefits`, {
            returnObjects: true,
          }) as string[];

          return (
            <Card
              key={featureKey}
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
                      {t(`features.list.${featureKey}.title`)}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">
                  {t(`features.list.${featureKey}.description`)}
                </p>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
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
    </section>
  );
}
