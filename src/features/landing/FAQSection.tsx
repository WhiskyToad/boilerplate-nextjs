"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What's included in this boilerplate?",
    answer:
      "Complete authentication system, Stripe payments, responsive dashboards, database setup with Supabase, email templates, TypeScript configuration, and production-ready deployment setup.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "You can have a working SaaS application deployed in under 30 minutes. Just clone the repo, configure your environment variables, and deploy to Vercel.",
  },
  {
    question: "What tech stack does this use?",
    answer:
      "Next.js 15, TypeScript, Tailwind CSS, Supabase (auth & database), Stripe (payments), React Query (state management), and Storybook for component development.",
  },
  {
    question: "Is this production ready?",
    answer:
      "Yes! This boilerplate is built with production best practices including proper error handling, security measures, performance optimization, and scalable architecture patterns.",
  },
  {
    question: "Can I customize the design?",
    answer:
      "Absolutely! The entire UI is built with Tailwind CSS and includes a complete design system. All components are customizable and well-documented.",
  },
  {
    question: "What kind of support is available?",
    answer:
      "The boilerplate includes comprehensive documentation, code comments, and example implementations. Community support is available through GitHub issues.",
  },
  {
    question: "How do I handle payments and subscriptions?",
    answer:
      "Stripe integration is fully configured with subscription management, billing portal, webhooks, and usage tracking. Just add your Stripe keys and you're ready to accept payments.",
  },
  {
    question: "Is the code well documented?",
    answer:
      "Yes! Every component, hook, and utility function is documented. The codebase follows TypeScript best practices and includes inline comments explaining complex logic.",
  },
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about this boilerplate
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <FiChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openItems.has(index) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openItems.has(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <p className="text-gray-600 mb-4">
            Check out the documentation or create an issue on GitHub for support.
          </p>
        </div>
      </div>
    </section>
  );
}
