"use client";

import { FiX, FiCheck } from "react-icons/fi";
import Image from "next/image";
import { siteConfig } from "@/config/site-config";

export function BenefitsFeaturesSection() {
  const problems = [
    "Building authentication and user management from scratch",
    "Setting up payment processing and subscription billing",
    "Creating responsive dashboards and data visualization", 
    "Implementing proper database schema and migrations",
    "Configuring email systems and user onboarding flows",
    "Writing boilerplate code for basic CRUD operations",
  ];

  const solutions = [
    "Complete auth system with social logins and email verification",
    "Stripe integration with subscription management and billing portal",
    "Pre-built responsive dashboards with charts and analytics",
    "Supabase setup with RLS, migrations, and TypeScript types", 
    "Email templates and automated onboarding workflows",
    "Full-stack components with forms, tables, and data management",
  ];

  return (
    <section className="py-20 bg-base-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
            Why This Boilerplate Saves You Months of Development
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Building SaaS from scratch has recurring pain points. We've solved them all.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left side - Problems */}
          <div className="bg-gradient-to-br from-base-200 to-error/10 p-8 rounded-xl border border-error/30">
            <h3 className="text-2xl font-bold text-base-content mb-6">
              Building From Scratch
            </h3>
            <div className="space-y-3">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className={`bg-base-100/80 border border-error/30 p-4 rounded-lg flex items-start gap-3 transform transition-transform hover:scale-105 ${
                    index % 3 === 0
                      ? "-rotate-1"
                      : index % 3 === 1
                      ? "rotate-1"
                      : "-rotate-0.5"
                  } ${index % 2 === 0 ? "translate-x-1" : "-translate-x-1"}`}
                >
                  <FiX className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                  <p className="text-base-content/80 font-medium">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Solutions */}
          <div className="bg-gradient-to-br from-primary/10 via-success/5 to-secondary/10 p-8 rounded-xl border border-primary/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Image
                  src="/logo/icon.svg"
                  alt={`${siteConfig.name} logo`}
                  width={40}
                  height={40}
                  className="rounded-xl shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-base-content">
                  This Boilerplate
                </span>
                <span className="text-sm text-primary font-medium -mt-1">
                  Production Ready
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-base-100/90 backdrop-blur-sm p-3 rounded-lg border border-primary/20 shadow-sm"
                >
                  <FiCheck className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-base-content/90 font-medium">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
