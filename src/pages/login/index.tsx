import { LoginForm } from "@/features/auth/LoginForm";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primary-500 to-primary-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <LoginForm onLoginComplete={() => router.push("/projects")} />
      </div>
    </div>
  );
}
