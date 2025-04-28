import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { useRouter } from "next/router";

export interface PricingTierProps {
  name: string;
  price: string;
  originalPrice?: string;
  billingPeriod?: string;
  description: string;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  primaryAction: string;
  primaryActionLink?: string;
  highlight?: boolean;
  badge?: string;
  onPrimaryAction?: (tierName: string) => void;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  originalPrice,
  billingPeriod,
  description,
  features,
  primaryAction,
  primaryActionLink = "/signup",
  highlight = false,
  badge,
  onPrimaryAction,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      onPrimaryAction?.(name);
      router.push(primaryActionLink);
    } catch (error) {
      console.error("Error handling pricing tier action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-base-100 rounded-lg border ${
        highlight ? "border-primary shadow-lg relative" : "border-base-300"
      } overflow-hidden flex flex-col h-full`}
    >
      {highlight && badge && (
        <div className="absolute top-0 inset-x-0">
          <div className="bg-primary text-primary-content text-center py-1 text-sm font-medium uppercase">
            {badge}
          </div>
        </div>
      )}

      <div className={`p-6 ${highlight && badge ? "pt-10" : ""}`}>
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <div className="mt-2 flex items-baseline flex-wrap">
          <span className="text-3xl font-bold">{price}</span>
          {billingPeriod && (
            <span className="ml-1 text-sm opacity-80">{billingPeriod}</span>
          )}
          {originalPrice && (
            <span className="ml-2 text-sm text-base-content/60 line-through">
              {originalPrice}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-base-content/70">{description}</p>
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              {feature.included ? (
                <FiCheck className="flex-shrink-0 h-5 w-5 text-success mt-0.5" />
              ) : (
                <FiX className="flex-shrink-0 h-5 w-5 text-error/50 mt-0.5" />
              )}
              <span
                className={`text-base-content ${
                  !feature.included ? "text-base-content/50" : ""
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 mt-auto border-t border-base-300">
        <button
          className={`btn w-full ${
            name === "Free"
              ? "btn-outline btn-primary"
              : highlight
              ? "btn-primary"
              : "btn-outline btn-primary"
          } ${isLoading ? "loading" : ""}`}
          onClick={handleClick}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "Processing..." : primaryAction}
        </button>
      </div>
    </div>
  );
};

export default PricingTier;
