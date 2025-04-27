import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";
import posthog from "posthog-js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Hero: React.FC = () => {
  const router = useRouter();
  // Add state for experiment variant
  const [variant, setVariant] = useState<"control" | "benefit" | "urgency">(
    "control"
  );

  const featureFlag = posthog.getFeatureFlag("home-page-hero-cta");

  // Set up experiment on component mount
  useEffect(() => {
    // Use PostHog feature flag instead of random selection
    if (featureFlag === "benefit-focused") {
      setVariant("benefit");
    } else if (featureFlag === "urgency-focused") {
      setVariant("urgency");
    } else {
      // It's a good idea to let control variant always be the default behaviour,
      // so if something goes wrong with flag evaluation, you don't break your app.
      setVariant("control");
    }

    // For PostHog experiment tracking
    posthog.capture("experiment_viewed", {
      experiment: "hero_messaging",
      variant: variant,
    });
  }, [variant, featureFlag]);

  const handlePrimaryCtaClick = () => {
    posthog.capture("cta_clicked", {
      cta_text: "hero_primary_cta",
      cta_variant: variant,
      experiment: "hero_messaging",
      location: "hero",
    });
    router.push("/create-project");
  };

  // Content for each variant
  const variantContent = {
    control: {
      headline: (
        <>
          Plan in <strong>minutes</strong>,
          <br className="hidden md:block" />
          Build with{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            confidence
          </span>
        </>
      ),
      subheadline: (
        <>
          Meet Boost Toad, your AI startup co-pilot.
          <br />
          Use our validated framework to go from idea to MVP feature plan,{" "}
          <strong>in minutes.</strong>
        </>
      ),
    },
    benefit: {
      headline: (
        <>
          From <strong>idea chaos</strong> to <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            structured MVP
          </span>
        </>
      ),
      subheadline: (
        <>
          Problem: Scattered startup ideas without direction.
          <br />
          Solution: Our AI framework transforms concepts into prioritized
          feature plans
          <strong> that actually launch.</strong>
        </>
      ),
    },
    urgency: {
      headline: (
        <>
          Don&apos;t waste <strong>months</strong> on the
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            wrong features
          </span>
        </>
      ),
      subheadline: (
        <>
          Problem: 83% of startups fail from poor prioritization.
          <br />
          Solution: Get your MVP roadmap today before competitors do,
          <strong> in just minutes.</strong>
        </>
      ),
    },
  };

  return (
    <div className="hero min-h-[85vh] bg-gradient-to-br from-primary/10 to-transparent text-base-content">
      <div className="hero-content text-center">
        <div className="max-w-4xl flex flex-col gap-6 items-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {variantContent[variant].headline}
          </motion.h1>

          <motion.p
            className="py-2 text-xl md:text-2xl max-w-3xl text-base-content/80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {variantContent[variant].subheadline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              className={`btn btn-lg flex-1 group relative min-h-[60px] btn-primary`}
              onClick={handlePrimaryCtaClick}
            >
              Get started for free
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.p
            className="text-sm text-base-content/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Free & No Credit Card Required. Takes ~1 minute.
          </motion.p>

          <motion.div
            className="mt-10 bg-base-200/50 p-6 rounded-xl max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">✓</span>
                <span>Get your business plan in 60 seconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">✓</span>
                <span>Experiment with validated frameworks</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">✓</span>
                <span>Go from idea to MVP feature plan</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">✓</span>
                <span>Kanban to keep you on track</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 justify-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="badge badge-outline">Rapid Planning</div>
            <div className="badge badge-outline">Validated Frameworks</div>
            <div className="badge badge-outline">MVP Feature Mapping</div>
            <div className="badge badge-outline">Startup Experiments</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
