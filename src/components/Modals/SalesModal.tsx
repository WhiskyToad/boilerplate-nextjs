import React, { useState } from "react";
import { FiX, FiArrowRight, FiZap, FiSave, FiFileText } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const SalesModal: React.FC<SalesModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [videoPlaying, setVideoPlaying] = useState(true);

  const handleSignUpClick = () => {
    posthog.capture("signup_clicked", {
      cta_text: "Sign Up Now",
      location: "sales_modal",
    });
    onUpgrade();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h3 className="text-xl font-bold">
                Save Your Project & Get Started
              </h3>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={onClose}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Video Player */}
              <p className="text-sm text-base-content/80 mb-4">
                We can&apos;t save your project if you dont have an account.
                Sign up now to save your project and get started, for free.
              </p>
              <div
                className="border bg-base-300 shadow-lg rounded-lg overflow-hidden mb-6 cursor-pointer"
                onClick={() => setVideoPlaying(!videoPlaying)}
              >
                <div className="aspect-video relative">
                  <video
                    className="w-full h-full"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="/videos/sales_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {!videoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-primary/10 p-5 rounded-lg mb-6">
                <h5 className="font-semibold mb-3">
                  With a Free Account You&apos;ll Get All This:
                </h5>
                <p className="text-sm text-base-content/80 mb-4">
                  It takes just <strong>30 seconds to register</strong>, and you
                  can generate everything below in <strong>minutes</strong>!
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiFileText className="mt-1 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">Project Blueprint</span>
                      <p className="text-sm text-base-content/80">
                        Get a detailed plan and structure for your idea.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiZap className="mt-1 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">User Path Generation</span>
                      <p className="text-sm text-base-content/80">
                        Visualize key user journeys and interactions.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiSave className="mt-1 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">
                        Feature Generation & Building
                      </span>
                      <p className="text-sm text-base-content/80">
                        Define and develop core features with AI assistance.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <FiArrowRight className="mt-1 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">Development Roadmap</span>
                      <p className="text-sm text-base-content/80">
                        Plan and track your project milestones effectively.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button className="btn btn-ghost" onClick={onClose}>
                  Maybe Later
                </button>
                <button
                  className="btn btn-primary group"
                  onClick={handleSignUpClick}
                >
                  Sign Up Now{" "}
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SalesModal;
