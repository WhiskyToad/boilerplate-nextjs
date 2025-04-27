import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSubscription } from "../hooks/useSubscription";
import UpgradeModal from "../subscription/UpgradeModal";

type SubscriptionGuardProps = {
  children: React.ReactNode;
  requiredFeatures?: Array<
    | "multiple_projects"
    | "prioritization"
    | "roadmap"
    | "tasks"
    | "validation"
    | "launch"
  >;
};

export default function SubscriptionGuard({
  children,
  requiredFeatures = [],
}: SubscriptionGuardProps) {
  const router = useRouter();
  const { isPaid, isLoading } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // If page requires subscription but user doesn't have one
    if (!isPaid && requiredFeatures.length > 0) {
      setShowUpgradeModal(true);
    }
  }, [isPaid, isLoading, requiredFeatures]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        Loading subscription status...
      </div>
    );
  }

  // Allow access if paid or if no features are required
  const showContent = isPaid || requiredFeatures.length === 0;

  // Determine if the modal should be shown
  const shouldShowModal = !isLoading && !isPaid && requiredFeatures.length > 0;

  return (
    <>
      {showContent ? children : null}

      <UpgradeModal
        isOpen={showUpgradeModal && shouldShowModal} // Only show if loading is done and conditions met
        onClose={() => {
          setShowUpgradeModal(false);
          // If on project page, redirect to blueprint (which is free)
          const projectId = router.query.id as string;
          if (projectId) {
            router.push(`/projects/${projectId}/blueprint`);
          } else {
            router.push("/projects");
          }
        }}
      />
    </>
  );
}
