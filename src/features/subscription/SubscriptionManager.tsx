'use client'

import { useSubscription, useUsage, useCreateSubscription } from '@/hooks/useSubscription'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { TIER_PRICING } from '@/lib/stripe-config'
import { useToast } from '@/hooks/useToast'

export function SubscriptionManager() {
  const { data: subscription, isLoading: subLoading } = useSubscription()
  const { data: usage, isLoading: usageLoading } = useUsage()
  const { mutate: createSubscription, isPending } = useCreateSubscription()
  const { toast } = useToast()

  const handleUpgrade = (tier: 'pro' | 'teams', billingInterval: 'monthly' | 'annual') => {
    createSubscription({ tier, billingInterval }, {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url
        }
      },
      onError: (error) => {
        toast.error(`Error creating subscription: ${error.message}`)
      },
    })
  }

  if (subLoading || usageLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentTier = subscription?.tier || 'free'
  const tierInfo = TIER_PRICING[currentTier as keyof typeof TIER_PRICING]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Current Plan</h2>
            <Badge variant="default">{tierInfo.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Plan Details</h3>
              <ul className="space-y-1 text-sm text-base-content/70">
                {tierInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {subscription?.status && subscription.status !== 'active' && (
              <div className="alert alert-warning">
                <span>Subscription Status: {subscription.status}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Usage</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">API Calls</div>
              <div className="stat-value text-2xl">
                {usage?.api_calls_count || 0}
              </div>
              <div className="stat-desc">
                of {tierInfo.apiCalls.toLocaleString()}
              </div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Teams</div>
              <div className="stat-value text-2xl">
                {usage?.teams_count || 0}
              </div>
              <div className="stat-desc">
                of {tierInfo.projects === -1 ? 'unlimited' : tierInfo.projects}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {currentTier === 'free' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Upgrade Your Plan</h2>
            <p className="text-base-content/70">
              Get more features and higher limits with a paid plan.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pro Plan */}
              <div className="border border-base-300 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold">${TIER_PRICING.pro.priceMonthly}</span>
                  <span className="text-base-content/60">/month</span>
                </div>
                <ul className="space-y-1 text-sm mb-4">
                  {TIER_PRICING.pro.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleUpgrade('pro', 'monthly')}
                    loading={isPending}
                    size="sm"
                  >
                    Upgrade Monthly
                  </Button>
                  <Button
                    onClick={() => handleUpgrade('pro', 'annual')}
                    loading={isPending}
                    variant="outline"
                    size="sm"
                  >
                    Annual (Save ${TIER_PRICING.pro.saveAnnual})
                  </Button>
                </div>
              </div>

              {/* Teams Plan */}
              <div className="border border-base-300 rounded-lg p-4 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default">Popular</Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">Teams</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold">${TIER_PRICING.teams.priceMonthly}</span>
                  <span className="text-base-content/60">/month</span>
                </div>
                <ul className="space-y-1 text-sm mb-4">
                  {TIER_PRICING.teams.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-success">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleUpgrade('teams', 'monthly')}
                    loading={isPending}
                    size="sm"
                  >
                    Upgrade Monthly
                  </Button>
                  <Button
                    onClick={() => handleUpgrade('teams', 'annual')}
                    loading={isPending}
                    variant="outline"
                    size="sm"
                  >
                    Annual (Save ${TIER_PRICING.teams.saveAnnual})
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}