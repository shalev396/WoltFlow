import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/pages/landing/Hero";
import HowItWorks from "@/components/pages/landing/HowItWorks";
import SavingsHighlight from "@/components/pages/landing/SavingsHighlight";
import Features from "@/components/pages/landing/Features";
import Faq from "@/components/pages/landing/Faq";
import Cta from "@/components/pages/landing/Cta";

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="pt-18 flex-1">
        <Hero
          isAuthenticated={isAuthenticated}
          onGetStarted={() => navigate("/dashboard")}
        />
        <HowItWorks />
        <SavingsHighlight />
        <Features />
        <Faq />
        <Cta
          isAuthenticated={isAuthenticated}
          onGetStarted={() => navigate("/dashboard")}
        />
      </main>

      <Footer />
    </div>
  );
}
