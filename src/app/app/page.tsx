'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { ROUTES } from '@/config/routes'

export default function AppHomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-base-100">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary">Authenticated App</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content">Build your MVP</h1>
            <p className="mt-2 text-base-content/70">
              Signed in as <span className="font-medium text-base-content">{user?.email}</span>
            </p>
          </div>
          <Link href={ROUTES.settings}>
            <Button variant="outline">Account Settings</Button>
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="default" className="border-base-300">
            <CardHeader title="Start Here" description="Use this page as your post-auth shell." />
            <CardContent className="space-y-3 text-sm text-base-content/80">
              <p>Replace this with your primary feature view.</p>
              <p>Keep `ProtectedRoute` in `src/app/app/layout.tsx` and expand from there.</p>
            </CardContent>
          </Card>

          <Card variant="default" className="border-base-300">
            <CardHeader title="Included Building Blocks" description="Core pieces already wired." />
            <CardContent className="space-y-2 text-sm text-base-content/80">
              <p>Authentication and session handling</p>
              <p>Stripe billing portal endpoint</p>
              <p>Supabase and typed utilities</p>
              <p>Reusable UI component library</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Link href={ROUTES.dev}>
            <Button>Open Developer Guide</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
