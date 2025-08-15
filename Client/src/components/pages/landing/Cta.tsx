import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/shared/LoginButton";

interface CtaProps {
  isAuthenticated: boolean;
  onGetStarted: () => void;
}

const benefits = [
  "Free forever",
  "5-minute setup",
  "No credit card required",
  "Cancel anytime",
];

export default function Cta({ isAuthenticated, onGetStarted }: CtaProps) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Automate Your Savings?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join users who are already saving hundreds of shekels every month
            with WoltFlow automation.
          </p>

          {/* Benefits list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm">
                <CheckCircle
                  className="size-4 text-green-600 dark:text-green-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={onGetStarted}
                className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                View Your Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <>
                <LoginButton
                  variant="default"
                  size="lg"
                  className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Saving Today
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </LoginButton>
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
                  Learn More
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            No setup fees • No monthly charges • No hidden costs
          </p>
        </div>
      </div>
    </section>
  );
}
