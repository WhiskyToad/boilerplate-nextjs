import { redirect } from 'next/navigation';
import { DevDashboard } from './DevDashboard';

/**
 * Developer Tools - Interactive setup dashboard
 *
 * Access: http://localhost:3000/dev
 */
export default function DevPage() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return <DevDashboard />;
}
