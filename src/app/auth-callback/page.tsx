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

      // Send auth data to extension
      try {
        console.log('🔐 [AUTH-CALLBACK] Sending auth data to extension:', authData.user.email);
        console.log('🔐 [AUTH-CALLBACK] Token:', authData.token.substring(0, 20) + '...');

        // Send window message for content script to pick up
        window.postMessage({
          type: 'DEMOFLOW_AUTH_SUCCESS',
          data: authData
        }, window.location.origin);

        // Wait for extension to acknowledge receipt
        let attempts = 0;
        const maxAttempts = 15; // 15 seconds max

        const checkAndClose = setInterval(() => {
          attempts++;
          console.log(`Waiting for extension acknowledgment (${attempts}/${maxAttempts})...`);

          // Check if extension acknowledged
          const ack = sessionStorage.getItem('demoflow_extension_ack');
          if (ack === 'received') {
            console.log('Extension acknowledged auth, closing tab');
            clearInterval(checkAndClose);
            sessionStorage.removeItem('demoflow_extension_ack');
            window.close();
          } else if (attempts >= maxAttempts) {
            console.log('Timeout waiting for extension, closing anyway');
            clearInterval(checkAndClose);
            window.close();
          }
        }, 1000);

      } catch (error) {
        console.error('Error sending auth data:', error);
        // Close anyway after a delay
        setTimeout(() => window.close(), 3000);
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