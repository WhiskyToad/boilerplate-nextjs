"use client";

import { FiArrowRight } from "react-icons/fi";
import { GradientButton } from "@/components/ui/gradient-button/GradientButton";
import { siteConfig } from "@/config/site-config";

export interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            {siteConfig.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 font-medium max-w-3xl mx-auto mb-12">
            {siteConfig.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <GradientButton
              onClick={onGetStarted}
              icon={<FiArrowRight />}
              size="xl"
            >
              Get Started Free
            </GradientButton>
          </div>

          {/* Tagline */}
          <p className="text-gray-500 text-lg">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
