import { redirect } from 'next/navigation';
import { SetupGuide } from './SetupGuide';

/**
 * Setup Guide Page - Interactive step-by-step setup
 *
 * Access: http://localhost:3000/dev/setup
 */
export default function SetupPage() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return <SetupGuide />;
}

export const metadata = {
  title: 'Setup Guide - Developer Tools',
  description: 'Step-by-step setup guide with progress tracking',
};
