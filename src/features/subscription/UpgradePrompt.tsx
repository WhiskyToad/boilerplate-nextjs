import React from "react";
import { FiStar, FiLock } from "react-icons/fi";
import { useRouter } from "next/router";
import { useSubscription } from "@/features/hooks/useSubscription";

interface UpgradePromptProps {
  feature: string;
  message?: string;
  showButton?: boolean;
  variant?: "inline" | "banner" | "overlay";
}

export default function UpgradePrompt({
  feature,
  message,
  showButton = true,
  variant = "banner",
}: UpgradePromptProps) {
  const router = useRouter();
  const { isPaid } = useSubscription();

  // Don't show for paid users
  if (isPaid) return null;

  // Update the default messages to be more compelling
  const defaultMessages: Record<string, string> = {
    core: "Unlock unlimited custom core features to tailor your app exactly to your needs and deliver your unique value proposition.",
    features:
      "Generate unlimited features across all user journey phases to create a comprehensive product roadmap.",
    prioritization:
      "Get AI-powered prioritization to identify the most impactful features for your MVP and maximize your chance of success.",
    roadmap:
      "Visualize your entire product roadmap with advanced timeline planning to keep development on track.",
    tasks:
      "Break down features into actionable development tasks with AI-generated user stories and acceptance criteria.",
    multiple_projects:
      "Create and manage unlimited projects to build your entire product portfolio.",
  };

  const displayMessage =
    message || defaultMessages[feature] || "Upgrade to access premium features";

  const handleUpgradeClick = () => {
    router.push("/pricing");
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center text-primary-focus space-x-2">
        <FiLock size={14} />
        <span className="text-sm">{displayMessage}</span>
        {showButton && (
          <button
            onClick={handleUpgradeClick}
            className="text-sm font-medium hover:underline"
          >
            Upgrade
          </button>
        )}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 bg-base-300 bg-opacity-70 flex items-center justify-center rounded-lg backdrop-blur-sm">
        <div className="text-center p-6">
          <FiLock className="mx-auto mb-3 text-primary" size={32} />
          <h3 className="font-bold mb-2">Premium Feature</h3>
          <p className="mb-4 max-w-xs">{displayMessage}</p>
          {showButton && (
            <button
              onClick={handleUpgradeClick}
              className="btn btn-primary btn-sm"
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default banner
  return (
    <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg flex items-center justify-between mb-6">
      <div className="flex items-center">
        <FiStar className="text-primary mr-3" size={20} />
        <span>{displayMessage}</span>
      </div>
      {showButton && (
        <button onClick={handleUpgradeClick} className="btn btn-primary btn-sm">
          Upgrade Now
        </button>
      )}
    </div>
  );
}
