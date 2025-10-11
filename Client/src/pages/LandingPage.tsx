import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/store/store";
import { useLanguage } from "@/hooks/useLanguage";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { SEOHead } from "@/components/shared/SEOHead";
import Hero from "@/components/pages/landing/Hero";
import HowItWorks from "@/components/pages/landing/HowItWorks";
import SavingsHighlight from "@/components/pages/landing/SavingsHighlight";
import Features from "@/components/pages/landing/Features";
import Faq from "@/components/pages/landing/Faq";
import Cta from "@/components/pages/landing/Cta";

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation("landing");
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title={t("hero.title")} description={t("hero.description")} />
      <Navbar />

      <main className="pt-18 flex-1">
        <Hero
          isAuthenticated={isAuthenticated}
          onGetStarted={() => navigate(`/${language}/dashboard`)}
        />
        <HowItWorks />
        <SavingsHighlight />
        <Features />
        <Faq />
        <Cta
          isAuthenticated={isAuthenticated}
          onGetStarted={() => navigate(`/${language}/dashboard`)}
        />
      </main>

      <Footer />
    </div>
  );
}
