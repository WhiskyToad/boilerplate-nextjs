import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FiArrowRight, FiClock } from "react-icons/fi";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { useFeatureFlagVariantKey } from "posthog-js/react";

const FinalCTA: React.FC = () => {
  const router = useRouter();
  const ctaVariant =
    useFeatureFlagVariantKey("final-cta-messaging") || "control";

  let headline = "Ready to Launch Your Idea in Just 7 Days?";
  let subtext =
    "Join hundreds of founders who've accelerated their startup journey with our AI-powered blueprint system. Get your personalized roadmap in just 60 seconds.";
  let buttonText = "Start My Free Blueprint";

  if (ctaVariant === "social-proof") {
    headline = "Join 500+ Founders Building Smarter";
    subtext =
      "Our most successful users go from idea to launch in just 7 days. Get your AI-powered roadmap and join them.";
    buttonText = "Generate My Blueprint Now";
  } else if (ctaVariant === "fomo") {
    headline = "Don't Wait to Build Your Dream Product";
    subtext =
      "Every day without a clear plan is a day behind your competition. Get your AI blueprint today and start building with confidence.";
    buttonText = "Start Building Today";
  }

  const handlePrimaryCtaClick = () => {
    posthog.capture("cta_clicked", {
      cta_text: buttonText,
      location: "final_cta_primary",
      variant: ctaVariant,
    });
    router.push("/create-project");
  };

  return (
    <div
      className={`min-h-[60vh] flex items-center justify-center ${
        ctaVariant === "fomo"
          ? "bg-gradient-to-r from-error/90 to-error text-error-content"
          : "bg-gradient-to-r from-primary to-secondary text-primary-content"
      }`}
    >
      <motion.div
        className="flex flex-col items-center gap-6 text-center max-w-3xl px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Image
          src="/logo/icon.png"
          alt="Boost Toad"
          width={100}
          height={100}
          className="object-contain mb-2"
        />

        <h1 className="text-4xl md:text-5xl font-bold">{headline}</h1>

        {ctaVariant === "social-proof" && (
          <div className="flex gap-2 items-center bg-white/20 rounded-full px-4 py-2 text-lg">
            <span className="font-bold">500+</span> projects created with Boost
            Toad
          </div>
        )}

        {ctaVariant === "fomo" && (
          <div className="flex gap-2 items-center bg-white/20 rounded-full px-4 py-2">
            <FiClock /> Limited time free blueprint offer
          </div>
        )}

        <p className="text-lg md:text-xl leading-relaxed max-w-2xl">
          {subtext}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mt-4">
          <motion.button
            className={`btn btn-lg flex-1 group min-h-[60px] text-lg ${
              ctaVariant === "fomo" ? "btn-warning" : "btn-secondary"
            }`}
            onClick={handlePrimaryCtaClick}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {buttonText}
            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>

        <p className="text-primary-content/70 mt-2">
          No credit card required. Your blueprint is ready in 60 seconds.
        </p>
      </motion.div>
    </div>
  );
};

export default FinalCTA;
