import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import posthog from "posthog-js";

const ProductScreenshots: React.FC = () => {
  const router = useRouter();
  const [videoPlaying, setVideoPlaying] = useState(true);

  const handleCtaClick = () => {
    posthog.capture("cta_clicked", {
      cta_text: "Generate My Blueprint",
      location: "product_screenshots",
    });
    router.push("/create-project");
  };

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Build Better Products, Solo Developer Style
        </motion.h2>

        <motion.p
          className="text-xl text-center text-base-content/70 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          See how Boost Toad helps indie developers and solopreneurs organize
          their product ideas and build with confidence.
        </motion.p>

        {/* Video Section with play/pause control */}
        <motion.div
          className="border bg-base-300 shadow-xl max-w-4xl mx-auto mb-10 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div
            className="flex justify-center bg-base-200 aspect-video relative cursor-pointer"
            onClick={() => setVideoPlaying(!videoPlaying)}
          >
            <video className="w-full h-full" autoPlay muted loop playsInline>
              <source src="/videos/sales_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {!videoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Interactive Quiz Teaser */}
        <motion.div
          className="max-w-3xl mx-auto p-8 bg-primary/10 rounded-2xl shadow-lg mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4 text-center">
            Ready to streamline your development process?
          </h3>

          <p className="mb-6 text-center">
            Join other solo developers who are using Boost Toad to clarify their
            vision, organize their roadmap, and build better products.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <motion.button
              className="btn btn-primary btn-lg flex-1 group"
              type="button"
              onClick={handleCtaClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate My Blueprint{" "}
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          <p className="text-sm mt-4 text-center text-base-content/70">
            No credit card required. Takes just 60 seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductScreenshots;
