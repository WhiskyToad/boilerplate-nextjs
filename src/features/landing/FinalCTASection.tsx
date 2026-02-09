"use client";

import { FiArrowRight } from "react-icons/fi";
import { ROUTES } from '@/config/routes';

export interface FinalCTASectionProps {
  onGetStarted: () => void;
}

export function FinalCTASection({ onGetStarted }: FinalCTASectionProps) {
  return (
    <section className="py-20 sm:py-28 lg:py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 lg:p-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content mb-6">
            Ready to Get Started?
          </h2>

          <p className="text-lg sm:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already discovered a better way. Start free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={onGetStarted}
              className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <FiArrowRight className="w-5 h-5" />
            </button>
            <a
              href={ROUTES.pricing}
              className="btn btn-outline btn-lg"
            >
              View Pricing
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-base-content/60">
            <div className="flex items-center gap-1">
              <span>✓</span> Free forever plan
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span> No credit card required
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span> 5-minute setup
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span> Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
