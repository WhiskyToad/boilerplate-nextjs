import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card/Card'
import { Badge } from '@/components/ui/badge/Badge'
import { GradientText } from '@/components/ui/gradient-text/GradientText'
import { siteConfig } from '@/config/site-config'
import { ROUTES } from '@/config/routes'

interface AuthPageShellProps {
  mode: 'signin' | 'signup'
  children: React.ReactNode
}

const authSellingPoints = [
  'Production-ready auth with Supabase',
  'Stripe billing foundation included',
  'Type-safe stack with Next.js and TypeScript',
]

export function AuthPageShell({ mode, children }: AuthPageShellProps) {
  const title = mode === 'signin' ? 'Welcome back' : 'Create your account'

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <section className="order-2 lg:order-1">
          <Card variant="elevated" className="border border-base-300/60 bg-base-100/90">
            <CardContent className="space-y-6 p-8 md:p-10">
              <Badge variant="secondary" size="lg">SaaS Starter</Badge>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-base-content">
                  <GradientText>{siteConfig.name}</GradientText>
                </h1>
                <p className="text-xl font-semibold text-base-content">{title}</p>
                <p className="text-base text-base-content/70">
                  Start from a clean authenticated app surface and ship your MVP faster.
                </p>
              </div>

              <ul className="space-y-3">
                {authSellingPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-base-content/80">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-base-content/60">
                New here? Read our <Link href={ROUTES.terms} className="link">Terms</Link> and{' '}
                <Link href={ROUTES.privacy} className="link">Privacy Policy</Link>.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="order-1 lg:order-2">{children}</section>
      </div>
    </div>
  )
}
