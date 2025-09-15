"use client";

import { FiCheck, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { Button } from "@/components/ui/button/Button";
import { TIER_PRICING, TierName } from "@/lib/stripe-config";

interface PricingCardProps {
  tier: TierName;
  billingInterval?: 'monthly' | 'annual';
  onSelect: (tier: TierName) => void;
  isPopular?: boolean;
  ctaText?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'landing' | 'modal';
}

export function PricingCard({ 
  tier, 
  billingInterval = 'monthly',
  onSelect, 
  isPopular = false, 
  ctaText, 
  loading = false, 
  disabled = false,
  variant = 'landing'
}: PricingCardProps) {
  const plan = TIER_PRICING[tier];
  const isModal = variant === 'modal';
  const isAnnual = billingInterval === 'annual';

  // Calculate pricing display
  const getPriceDisplay = () => {
    if (tier === 'free') {
      return {
        price: '$0',
        period: 'forever',
        subtitle: null,
        originalPrice: null
      };
    }
    
    // Type guard to ensure we have a paid plan
    if ((tier === 'pro' || tier === 'teams') && 'priceMonthly' in plan && 'priceAnnual' in plan) {
      if (isAnnual) {
        const monthlyEquivalent = Math.round(plan.priceAnnual / 12);
        return {
          price: `$${monthlyEquivalent}`,
          period: 'month',
          subtitle: `Billed annually ($${plan.priceAnnual}/year)`,
          originalPrice: `$${plan.priceMonthly}/month`
        };
      }
      
      return {
        price: `$${plan.priceMonthly}`,
        period: 'month',
        subtitle: null,
        originalPrice: null
      };
    }
    
    // Fallback for free plan
    return {
      price: '$0',
      period: 'forever',
      subtitle: null,
      originalPrice: null
    };
  };

  // Get features based on tier
  const getFeatures = (): string[] => {
    const features: string[] = [];
    
    if (tier === 'free') {
      features.push(
        `${plan.projects} project`,
        `${plan.apiCalls} API calls/month`,
        `${plan.teamMembers} team member`
      );
    } else {
      features.push(
        `${plan.projects} projects`,
        `${plan.apiCalls.toLocaleString()} API calls/month`,
        plan.teamMembers === -1 ? 'Unlimited team members' : `${plan.teamMembers} team member`
      );
    }
    
    // Add plan-specific features
    plan.features.forEach(feature => features.push(feature));
    
    // Add annual savings indicator
    if (isAnnual && (tier === 'pro' || tier === 'teams') && 'saveAnnual' in plan) {
      features.push(`Save $${plan.saveAnnual}/year - Best value!`);
    }
    
    return features;
  };

  const { price, period, subtitle, originalPrice } = getPriceDisplay();
  const features = getFeatures();
  const defaultCta = tier === 'free' ? 'Start Free' : 
                   `Choose ${plan.name}`;

  return (
    <div className={`
      relative bg-base-100 rounded-xl p-6 border transition-all hover:shadow-lg
      ${isPopular 
        ? "border-primary shadow-md" 
        : "border-base-300"
      }
    `}>
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-primary text-primary-content px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      {/* Savings badge for annual billing */}
      {isAnnual && (tier === 'pro' || tier === 'teams') && 'saveAnnual' in plan && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-success text-success-content px-3 py-1 rounded-full text-xs font-medium">
            Save ${plan.saveAnnual}
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-base-content text-xl mb-2">
            {plan.name}
          </h3>
          
          <div className="mb-3">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-bold text-base-content text-4xl">
                {price}
              </span>
              <span className="text-base-content/60 text-lg">
                /{period}
              </span>
            </div>
            
            {originalPrice && (
              <div className="text-sm mt-1">
                <span className="text-base-content/50 line-through">
                  {originalPrice}
                </span>
              </div>
            )}
            
            {subtitle && (
              <div className="text-sm text-success mt-2">
                {subtitle}
              </div>
            )}
          </div>
          
          {!isModal && (
            <p className="text-base-content/70">
              {tier === 'free' 
                ? 'Perfect for trying it out' 
                : tier === 'pro'
                ? 'For growing products'
                : 'For teams and collaboration'
              }
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <FiCheck className="text-success flex-shrink-0 w-5 h-5" />
              <span className={`${isModal ? 'text-lg' : 'text-sm'} ${feature.includes('Best value') ? 'font-medium text-success' : ''}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          onClick={() => onSelect(tier)}
          variant={isPopular ? 'primary' : 'outline'}
          size="lg"
          className="w-full mt-auto"
          loading={loading}
          disabled={disabled}
        >
          {ctaText || defaultCta}
          {!loading && <FiArrowRight className="ml-2" />}
        </Button>
      </div>
    </div>
  );
}