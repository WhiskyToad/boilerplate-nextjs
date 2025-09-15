"use client";

import { Header } from "@/components/shared/Header";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { BenefitsFeaturesSection } from "./BenefitsFeaturesSection";
import { SimplePricing } from "./SimplePricing";
import { Footer } from "./Footer";
import { FAQSection } from "./FAQSection";

export interface LandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function LandingPage({ onSignIn, onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-base-100">
      <Header
        variant="landing"
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
      />

      <main>
        {/* 1. Hero Section - Problem + Solution + CTA */}
        <HeroSection onSignIn={onSignIn} onGetStarted={onGetStarted} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Benefits Comparison */}
        <BenefitsFeaturesSection />

        {/* Pricing */}
        <section id="pricing">
          <SimplePricing onGetStarted={onGetStarted} />
        </section>

        {/* FAQ */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
