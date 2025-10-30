"use client";

import { useRouter } from "next/navigation";
import { Header } from '@/components/shared/Header';
import { useAuth } from '@/hooks/useAuth';

export interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleSignIn = () => {
    router.push('/')
  }

  const handleGetStarted = () => {
    router.push('/')
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Header
        variant="landing"
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
      />

      <main className="bg-gradient-to-br from-base-100 via-base-50 to-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {children}
        </div>
      </main>

      <footer className="bg-base-200 border-t border-base-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base-content/70">
            Ready to get started? <button onClick={handleGetStarted} className="text-primary hover:underline">Start building today</button>
          </p>
        </div>
      </footer>
    </div>
  );
}
