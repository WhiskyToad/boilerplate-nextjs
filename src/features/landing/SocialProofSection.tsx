"use client";

import { FiShield, FiZap, FiUsers, FiStar } from "react-icons/fi";

export function SocialProofSection() {
  const trustIndicators = [
    {
      icon: <FiZap className="w-6 h-6" />,
      question: "Is it fast and reliable?",
      answer: "Built for speed and performance. 99.9% uptime guarantee with enterprise-grade infrastructure.",
      highlight: "99.9% uptime"
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      question: "Is my data secure?",
      answer: "Enterprise-grade security with encryption, regular backups, and compliance with industry standards.",
      highlight: "Bank-level security"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      question: "Do people actually use this?",
      answer: "Trusted by thousands of users worldwide. Join a growing community of satisfied customers.",
      highlight: "1000+ active users"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      question: "Is support available when I need it?",
      answer: "Dedicated support team ready to help. Fast response times and comprehensive documentation.",
      highlight: "24/7 support"
    }
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
            Built for Trust & Performance
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            We know you have concerns. Here's how we address them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {trustIndicators.map((indicator, index) => (
            <div key={index} className="bg-base-50 rounded-xl p-6 border border-base-300/30 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl flex-shrink-0">
                  {indicator.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-base-content mb-2">
                    {indicator.question}
                  </h3>
                  <p className="text-base-content/70 mb-3 text-sm leading-relaxed">
                    {indicator.answer}
                  </p>
                  <div className="inline-flex items-center bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium">
                    ✓ {indicator.highlight}
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
