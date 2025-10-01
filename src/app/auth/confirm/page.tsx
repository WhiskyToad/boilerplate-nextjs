'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmUser = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (!token_hash || !type) {
        setStatus('error');
        setMessage('Invalid confirmation link.');
        return;
      }

      const supabase = createClient();

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          setStatus('error');
          setMessage(error.message);
        } else if (data.user) {
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred.');
      }
    };

    confirmUser();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          {status === 'loading' && (
            <>
              <div className="loading loading-spinner loading-lg text-primary mx-auto"></div>
              <h2 className="card-title justify-center">Confirming your email...</h2>
              <p className="text-base-content/70">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-success text-6xl mb-4">✓</div>
              <h2 className="card-title justify-center text-success">Email Confirmed!</h2>
              <p className="text-base-content/70">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-error text-6xl mb-4">✗</div>
              <h2 className="card-title justify-center text-error">Confirmation Failed</h2>
              <p className="text-base-content/70">{message}</p>
              <div className="card-actions justify-center mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/login')}
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}