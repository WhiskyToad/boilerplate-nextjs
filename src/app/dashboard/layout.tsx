import { ProtectedRoute } from "@/features/auth/protected-route/ProtectedRoute";
import { OnboardingTrigger } from "@/components/onboarding/OnboardingTrigger";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
      <OnboardingTrigger 
        variant="floating" 
        showResetOption={true}
      />
      <OnboardingModal />
    </ProtectedRoute>
  );
}