import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/shared/LoginButton";

interface HeroProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
}

export default function Hero({ isAuthenticated, onGetStarted }: HeroProps) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-normal">
          WoltFlow
        </h1>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-normal">
          Automate Your Wolt Gift Card Purchases
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Streamline your meal benefits with automation. WoltFlow automatically
          purchases Wolt gift cards from Cibus daily, saving you time and
          maximizing your benefits utilization.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <Button
              size="lg"
              onClick={onGetStarted}
              className="group w-full sm:w-auto"
            >
              Go to Dashboard
              <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <LoginButton
              variant="default"
              size="lg"
              className="group w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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
            How It Works
          </Button>
        </div>

        {/* Optional background pattern for visual appeal */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
