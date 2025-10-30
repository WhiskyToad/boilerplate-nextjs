"use client";

import { Header } from "@/components/shared/Header";
import { HeroSection } from "./HeroSection";
import { PainPointsSection } from "./PainPointsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FeaturesSection } from "./FeaturesSection";
import { BenefitsFeaturesSection } from "./BenefitsFeaturesSection";
import { SocialProofSection } from "./SocialProofSection";
import { SimplePricing } from "./SimplePricing";
import { FAQSection } from "./FAQSection";
import { FinalCTASection } from "./FinalCTASection";
import { Footer } from "./Footer";
import { siteConfig } from "@/config/site-config";

export interface LandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export function LandingPage({ onSignIn, onGetStarted }: LandingPageProps) {
  const sections = siteConfig.landingPage.sections;

  const sectionComponents = {
    'hero': <HeroSection key="hero" onSignIn={onSignIn} onGetStarted={onGetStarted} />,
    'pain-points': <PainPointsSection key="pain-points" />,
    'how-it-works': <HowItWorksSection key="how-it-works" />,
    'features': <FeaturesSection key="features" />,
    'benefits': <BenefitsFeaturesSection key="benefits" />,
    'social-proof': <SocialProofSection key="social-proof" />,
    'pricing': (
      <section key="pricing" id="pricing">
        <SimplePricing onGetStarted={onGetStarted} />
      </section>
    ),
    'faq': <FAQSection key="faq" />,
    'final-cta': <FinalCTASection key="final-cta" onGetStarted={onGetStarted} />,
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Header
        variant="landing"
        onSignIn={onSignIn}
        onGetStarted={onGetStarted}
      />

      <main>
        {sections.map((sectionKey) => sectionComponents[sectionKey])}
      </main>

      <Footer />
    </div>
  );
}
