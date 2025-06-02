import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { useRef } from "react";
import { ArrowRight, Bot, Gift, Shield } from "lucide-react";

export default function Landing() {
  const { user } = useSelector((state: RootState) => state.user);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const automationRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b bg-background/80"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            WoltFlow
          </h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <section
          ref={heroRef}
          className="container mx-auto px-4 py-16 md:py-24"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Automate Your Wolt Gift Card Purchases
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Never miss out on your meal benefits again. WoltFlow automatically
              purchases Wolt gift cards from Cibus daily, saving you time and
              ensuring maximum benefits.
            </p>
            <Button size="lg" asChild className="group">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div ref={featuresRef} className="grid md:grid-cols-3 gap-8">
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
          className="container mx-auto px-4 py-16 md:py-24"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
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
        <section ref={creditsRef} className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">
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
      </main>
    </div>
  );
}
