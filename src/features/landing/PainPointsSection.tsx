'use client'

import { FiAlertTriangle, FiClock, FiTrendingDown } from 'react-icons/fi'
import { siteConfig } from '@/config/site-config'

export function PainPointsSection() {
  // Make these configurable in site-config later
  const painPoints = [
    {
      icon: FiAlertTriangle,
      title: "Problem One",
      description: "Describe the first major pain point your users face without your solution.",
      stat: "67%",
      statLabel: "of users face this"
    },
    {
      icon: FiClock,
      title: "Problem Two",
      description: "Explain the second critical issue that prevents success or growth.",
      stat: "42%",
      statLabel: "struggle with this daily"
    },
    {
      icon: FiTrendingDown,
      title: "Problem Three",
      description: "Highlight the third obstacle that makes their current approach inefficient.",
      stat: "3x",
      statLabel: "waste time on this"
    }
  ]

  const objections = [
    {
      q: "\"Won't this be expensive?\"",
      a: "We offer a free tier and affordable pricing that scales with your needs. No hidden costs."
    },
    {
      q: "\"Is it hard to set up?\"",
      a: "Setup takes less than 5 minutes. No technical knowledge required."
    },
    {
      q: "\"Can I customize it for my brand?\"",
      a: "Fully customizable to match your brand colors, style, and workflow."
    },
    {
      q: "\"What about data security?\"",
      a: "Enterprise-grade security with encryption. Your data stays yours, always."
    }
  ]

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pain Points */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
            Without {siteConfig.name}, You're
            <span className="text-error"> Fighting an Uphill Battle</span>
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            These problems are costing you time, money, and opportunities.
            <span className="block mt-2 font-semibold text-error">
              Here's what's really at stake.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {painPoints.map((pain, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <pain.icon className="w-8 h-8 text-error" />
              </div>

              <div className="text-4xl font-bold text-error mb-2">{pain.stat}</div>
              <div className="text-sm text-base-content/60 mb-4 font-medium">{pain.statLabel}</div>

              <h3 className="text-xl font-bold text-base-content mb-4">
                {pain.title}
              </h3>
              <p className="text-base-content/70 leading-relaxed">
                {pain.description}
              </p>
            </div>
          ))}
        </div>

        {/* Objection Handling */}
        <div className="bg-base-200/50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              But Wait, What About...?
            </h2>
            <p className="text-lg text-base-content/60">
              We've heard every concern. Here are the real answers:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {objections.map((obj, index) => (
              <div key={index} className="bg-base-100 p-6 rounded-xl border border-base-300">
                <h4 className="font-bold text-base-content mb-3 text-lg">
                  {obj.q}
                </h4>
                <p className="text-base-content/70 leading-relaxed">
                  {obj.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-success font-medium">
              <span>✓ All concerns handled. Ready to move forward?</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
