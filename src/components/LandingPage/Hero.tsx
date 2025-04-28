import React from "react";
import { useRouter } from "next/router";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

interface HeroProps {
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
  features?: string[];
  badges?: string[];
  onButtonClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  headline = (
    <>
      Your Product <strong>Tagline</strong>
      <br className="hidden md:block" />
      With{" "}
      <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Impact
      </span>
    </>
  ),
  subheadline = (
    <>
      Describe your product's main benefit.
      <br />
      Focus on the problems you solve for your users.
    </>
  ),
  buttonText = "Get Started Free",
  buttonLink = "/signup",
  features = [
    "Key Benefit One",
    "Key Benefit Two",
    "Key Benefit Three",
    "Key Benefit Four",
  ],
  badges = ["Feature One", "Feature Two", "Feature Three", "Feature Four"],
  onButtonClick,
}) => {
  const router = useRouter();

  const handlePrimaryCtaClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    router.push(buttonLink);
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
            {headline}
          </motion.h1>

          <motion.p
            className="py-2 text-xl md:text-2xl max-w-3xl text-base-content/80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subheadline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              className="btn btn-lg flex-1 group relative min-h-[60px] btn-primary"
              onClick={handlePrimaryCtaClick}
            >
              {buttonText}
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.p
            className="text-sm text-base-content/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Free & No Credit Card Required. Takes only minutes.
          </motion.p>

          <motion.div
            className="mt-10 bg-base-200/50 p-6 rounded-xl max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary font-bold mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 justify-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {badges.map((badge, index) => (
              <div key={index} className="badge badge-outline">
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
