import { ProtectedRoute } from '@/features/auth/protected-route/ProtectedRoute'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
