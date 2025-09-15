"use client";

import { FiCode, FiCreditCard, FiShield, FiCheck, FiZap } from "react-icons/fi";

export function FeaturesSection() {
  const features = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Production-Ready Components",
      description: "Pre-built UI components, forms, tables, and dashboards. All responsive, accessible, and customizable with Tailwind CSS.",
      benefit: "Ship features 5x faster"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Enterprise-Grade Authentication", 
      description: "Complete auth system with Supabase integration, social logins, email verification, password reset, and role-based permissions.",
      benefit: "Secure and scalable from day one"
    },
    {
      icon: <FiCreditCard className="w-8 h-8" />,
      title: "Stripe Payments & Subscriptions",
      description: "Full payment processing with subscription management, billing portal, webhooks, and usage tracking. Ready for revenue.",
      benefit: "Start monetizing immediately"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Performance & SEO Optimized",
      description: "Next.js 15 with App Router, TypeScript, and best practices. Built for speed, SEO, and developer experience.",
      benefit: "Better UX and search rankings"
    }
  ];

  return (
    <section id="features" className="py-20 bg-base-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
            Everything You Need to Build SaaS
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Stop rebuilding the same features. Focus on what makes your product unique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-left bg-white rounded-xl p-6 shadow-sm border border-base-300/50">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-base-content mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 mb-3">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                    <FiCheck className="w-4 h-4" />
                    {feature.benefit}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}