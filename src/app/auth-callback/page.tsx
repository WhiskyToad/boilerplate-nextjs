'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackPage() {
  const { user, session, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && session) {
      // This is the callback page for extension authentication
      const authData = {
        token: session.access_token,
        user: {
          id: user.id,
          email: user.email
        }
      };

      // Post message to extension
      const message = {
        type: 'DEMOFLOW_AUTH_SUCCESS',
        data: authData
      };

      // Send auth data to extension via window messaging and localStorage
      try {
        // Method 1: Store in localStorage as fallback
        localStorage.setItem('demoflow_auth_result', JSON.stringify(authData));
        
        // Method 2: Send window message for content script to pick up
        window.postMessage({
          type: 'DEMOFLOW_AUTH_SUCCESS',
          data: authData
        }, window.location.origin);
        
        console.log('Extension authentication completed for:', authData.user.email);
        
        // Close the window after extension has time to pick up the data
        setTimeout(() => {
          window.close();
        }, 3000);

      } catch (error) {
        console.error('Error sending auth data:', error);
      }
    } else if (!loading && !user) {
      // Not authenticated, redirect to login
      window.location.href = '/login?extension=true';
    }
  }, [user, session, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-base-content/70">
            Checking your authentication status.
          </p>
        </div>
      </div>
    );
  }

  if (user && session) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-success text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold mb-2">Authentication Complete!</h2>
          <p className="text-base-content/70">
            Connecting your account to the DemoFlow extension...
          </p>
          <p className="text-sm text-base-content/50 mt-4">
            This window will close automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-base-content/70">
          Taking you to the login page.
        </p>
      </div>
    </div>
  );
}