"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { PricingCard } from "@/components/ui/pricing-card/PricingCard";
import { TierName } from "@/lib/stripe-config";

export interface SimplePricingProps {
  onGetStarted: (tier: TierName, interval?: 'monthly' | 'annual') => void;
}

export function SimplePricing({ onGetStarted }: SimplePricingProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');

  const handlePlanSelect = (tier: TierName) => {
    if (tier === 'free') {
      onGetStarted('free');
    } else {
      onGetStarted(tier, billingInterval);
    }
  };

  return (
    <section className="py-20 bg-base-200/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Simple, transparent pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 mb-8">
            <div className="flex items-center gap-4 bg-base-200 p-2 rounded-full">
              <span className={`text-sm font-medium px-3 py-1 rounded-full transition-all ${
                billingInterval === 'monthly' 
                  ? 'text-base-content bg-base-100 shadow-sm font-semibold' 
                  : 'text-base-content/60 hover:text-base-content/80'
              }`}>
                Monthly
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingInterval === 'annual'}
                  onChange={(e) => setBillingInterval(e.target.checked ? 'annual' : 'monthly')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-base-300 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className={`text-sm font-medium px-3 py-1 rounded-full transition-all ${
                billingInterval === 'annual' 
                  ? 'text-base-content bg-base-100 shadow-sm font-semibold' 
                  : 'text-base-content/60 hover:text-base-content/80'
              }`}>
                Annual
              </span>
              <span className="bg-success text-success-content px-3 py-1 rounded-full text-xs font-medium">
                Save 17%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            tier="free"
            onSelect={handlePlanSelect}
            ctaText="Start Free"
            variant="landing"
          />
          <PricingCard
            tier="pro"
            billingInterval={billingInterval}
            onSelect={handlePlanSelect}
            isPopular={true}
            ctaText={billingInterval === 'annual' ? 'Start Pro Annual' : 'Start Pro Monthly'}
            variant="landing"
          />
          <PricingCard
            tier="teams"
            billingInterval={billingInterval}
            onSelect={handlePlanSelect}
            ctaText={billingInterval === 'annual' ? 'Start Teams Annual' : 'Start Teams Monthly'}
            variant="landing"
          />
        </div>

        {/* Usage & Limits Explanation */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-base-300/50 mt-8">
          <h3 className="text-lg font-semibold text-base-content mb-4 text-center">
            What happens when I exceed my limits?
          </h3>
          <div className="text-center text-base-content/70 text-sm mb-6">
            <p className="mb-2">
              <strong>Soft limits:</strong> Your feedback is hidden but preserved when you exceed monthly limits.
            </p>
            <p>
              Upgrade anytime to unlock hidden feedback instantly. <strong>No data is ever deleted.</strong>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-base-content mb-1">Projects</div>
              <div className="text-base-content/60">Individual websites/apps you want to collect feedback from</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-base-content mb-1">Submissions</div>
              <div className="text-base-content/60">Bug reports, feedback, reviews, and feature requests combined</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-base-content mb-1">Team Members</div>
              <div className="text-base-content/60">People who can access your dashboard and collaborate</div>
            </div>
          </div>
        </div>

        {/* Bottom reassurance */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-base-content/60 text-sm">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-success" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-success" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-success" />
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-success" />
              <span>Data export anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
