import React from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { FiCheckCircle } from "react-icons/fi";

const PricingTeaser: React.FC = () => {
  const router = useRouter();

  const handleCtaClick = () => {
    posthog.capture("cta_clicked", {
      cta_text: "View Pricing Plans",
      location: "pricing_teaser",
    });
    router.push("/pricing"); // Link to your full pricing page
  };

  return (
    // Add id="pricing" to the section tag if not already added in index.tsx wrapper div
    <section className="py-16 bg-gradient-to-b from-base-100 to-base-200">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6">Simple, Transparent Pricing</h2>
        <p className="text-lg text-base-content/80 mb-8">
          We offer a free plan to get you started. No credit card required.
          <br />
          <span className="text-primary font-semibold">
            Upgrade to unlock more features and projects.
          </span>
        </p>

        {/* Optional: Highlight a key plan or feature */}
        <div className="bg-base-100 p-6 rounded-lg shadow-md border border-base-300 inline-block mb-8">
          <h3 className="text-xl font-semibold mb-3">Try it free:</h3>
          <ul className="list-none space-y-2 text-left">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-success" /> 1 Project
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-success" /> AI Lean Canvas
            </li>
            {/* Added planned features */}
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-success" /> 2 Planned Features
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-success" /> User Paths
            </li>
          </ul>
        </div>

        <div>
          <button
            className="btn btn-primary btn-lg mb-4"
            onClick={handleCtaClick}
          >
            View Full Pricing Plans
          </button>
          <p className="text-sm text-base-content/60">
            Cancel anytime. No long-term contracts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;
