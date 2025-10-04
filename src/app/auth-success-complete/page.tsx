'use client';

import { useEffect } from 'react';

export default function AuthSuccessCompletePage() {
  useEffect(() => {
    // This page is captured by the Chrome extension
    // The extension will extract the token and user data from the URL
    // and then close this tab automatically
    
    // Show a brief success message before the tab closes
    setTimeout(() => {
      // If the extension hasn't closed this tab after 3 seconds,
      // redirect to dashboard as fallback
      window.location.href = '/dashboard';
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-success rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-success mb-2">Authentication Successful!</h2>
        <p className="text-base-content/70 mb-4">
          Your DemoFlow extension is now connected to your account.
        </p>
        <p className="text-sm text-base-content/50">
          This tab will close automatically...
        </p>
      </div>
    </div>
  );
}