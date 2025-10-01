'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage if available
    const signupEmail = localStorage.getItem('signup-email');
    if (signupEmail) {
      setEmail(signupEmail);
      // Clean up the stored email
      localStorage.removeItem('signup-email');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="text-primary text-6xl mb-4">📧</div>
          <h2 className="card-title justify-center">Check your email</h2>
          
          <div className="space-y-4">
            <p className="text-base-content/70">
              We&apos;ve sent a confirmation link to:
            </p>
            {email && (
              <div className="bg-base-200 p-3 rounded-lg">
                <code className="text-sm font-mono">{email}</code>
              </div>
            )}
            <p className="text-sm text-base-content/60">
              Click the link in the email to confirm your account and complete signup.
            </p>
          </div>

          <div className="divider">Having trouble?</div>

          <div className="space-y-2">
            <p className="text-xs text-base-content/50">
              • Check your spam/junk folder
              • Make sure the email address is correct
              • The link expires in 24 hours
            </p>
          </div>

          <div className="card-actions justify-center mt-6">
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => router.push('/signup')}
            >
              Try Different Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}