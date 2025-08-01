import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { useRef } from "react";
import { ArrowRight, Bot, Gift, Shield } from "lucide-react";

import Navbar from "@/components/Navbar";
import LoginButton from "@/components/LoginButton";

export default function Landing() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const automationRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-18">
        <section
          ref={heroRef}
          className="container mx-auto px-4 py-12 md:py-20"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Automate Your Wolt Gift Card Purchases
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Never miss out on your meal benefits again. WoltFlow automatically
              purchases Wolt gift cards from Cibus daily, saving you time and
              ensuring maximum benefits.
            </p>
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="group"
              >
                View Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <LoginButton variant="default" size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </LoginButton>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div
              ref={featuresRef}
              className="grid md:grid-cols-3 gap-6 lg:gap-8"
            >
              <div className="bg-background p-6 rounded-xl shadow-lg border">
                <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Bot className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Automated Purchases
                </h3>
                <p className="text-muted-foreground">
                  Set up once and let WoltFlow handle your daily gift card
                  purchases automatically. No more manual interventions needed.
                </p>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-lg border">
                <div className="size-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <Gift className="size-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Benefits</h3>
                <p className="text-muted-foreground">
                  Maximize your meal benefits with intelligent purchase timing
                  and amount optimization. Never leave money on the table.
                </p>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-lg border">
                <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <Shield className="size-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Secure & Reliable
                </h3>
                <p className="text-muted-foreground">
                  Built with security in mind. Your credentials are encrypted
                  and safely stored. Monitor all transactions in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Automation Section */}
        <section
          ref={automationRef}
          className="container mx-auto px-4 py-12 md:py-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
              Powered by Selenium Automation
            </h2>
            <div className="bg-muted/50 rounded-xl p-6 md:p-8">
              <p className="text-lg mb-4">
                WoltFlow utilizes Selenium WebDriver technology to automate the
                gift card purchase process:
              </p>
              <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                <li>Automated browser control for seamless purchases</li>
                <li>Smart error handling and retry mechanisms</li>
                <li>Screenshot capture for transaction verification</li>
                <li>Real-time status monitoring and notifications</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Credits Section */}
        <section ref={creditsRef} className="bg-muted/50 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Created by Shalev Ben Moshe
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              WoltFlow is developed and maintained by Shalev Ben Moshe, a
              software developer passionate about automation and user
              experience. Feel free to reach out for any questions or
              suggestions.
            </p>
            <a
              href="https://www.shalev396.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="outline" className="group">
                Visit My Website
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 WoltFlow. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm">
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  <a href="/privacy">Privacy Policy</a>
                </Button>
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  <a href="/terms">Terms of Service</a>
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
