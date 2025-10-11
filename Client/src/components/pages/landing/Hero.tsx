import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/shared/LoginButton";

interface HeroProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
}

export default function Hero({ isAuthenticated, onGetStarted }: HeroProps) {
  const { t } = useTranslation("landing");

  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
          {t("hero.title")}
        </h1>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-normal">
          {t("hero.subtitle")}
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t("hero.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <Button
              size="lg"
              onClick={onGetStarted}
              className="group w-full sm:w-auto"
            >
              {t("hero.gotoDashboard")}
              <ArrowRight className="ms-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </Button>
          ) : (
            <LoginButton
              variant="default"
              size="lg"
              className="group w-full sm:w-auto"
            >
              {t("hero.getStarted")}
              <ArrowRight className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </LoginButton>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("hero.howItWorks")}
          </Button>
        </div>

        {/* Optional background pattern for visual appeal */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -end-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -start-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
