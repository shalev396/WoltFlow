import { LogIn, CreditCard, Gift, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stepKeys = ["connect", "purchase", "apply"] as const;
const stepIcons = {
  connect: LogIn,
  purchase: CreditCard,
  apply: Gift,
};

export default function HowItWorks() {
  const { t } = useTranslation("landing");

  return (
    <section id="how-it-works" className="bg-muted/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {stepKeys.map((stepKey, index) => {
            const IconComponent = stepIcons[stepKey];
            return (
              <div key={stepKey} className="relative">
                <Card className="bg-background border-2 hover:border-primary/20 transition-colors h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="size-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <IconComponent
                          className="size-8 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="absolute -top-2 -end-2 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {t(`howItWorks.steps.${stepKey}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-muted-foreground mb-2">
                      {t(`howItWorks.steps.${stepKey}.description`)}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {t(`howItWorks.steps.${stepKey}.detail`)}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow connector - mathematically centered in gap */}
                {/* Gap: lg:gap-8 (32px) | Arrow: size-6 (24px) | Center: (32÷2)-(24÷2) = 4px */}
                {index < stepKeys.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 start-full transform -translate-y-1/2 translate-x-[4px] rtl:-translate-x-[4px] z-10">
                    <ArrowRight
                      className="size-6 text-muted-foreground rtl:rotate-180"
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
            {t("howItWorks.footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
