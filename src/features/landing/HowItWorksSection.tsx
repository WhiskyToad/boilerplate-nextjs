"use client";

import { FiCopy, FiCode, FiCheckCircle, FiClock } from "react-icons/fi";
import { siteConfig } from '@/config/site-config';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <FiCode className="w-10 h-10" />,
      title: "Step 1: Sign Up",
      description: "Create your account in seconds. No credit card required to start.",
      visual: "signup",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500"
    },
    {
      icon: <FiCopy className="w-10 h-10" />,
      title: "Step 2: Configure",
      description: "Set up your workspace and customize to fit your needs.",
      visual: "configure",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500"
    },
    {
      icon: <FiCheckCircle className="w-10 h-10" />,
      title: "Step 3: Launch",
      description: "Start using {siteConfig.name} and see results immediately.",
      visual: "launch",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FiClock className="w-4 h-4" />
            Quick & Easy Setup
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-6">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            No complicated setup, no lengthy onboarding. Just sign up and start building.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-1 z-0 transform translate-x-6">
                  <div className="w-full h-full bg-gradient-to-r from-primary/30 via-primary/20 to-transparent rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/30 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                  </div>
                </div>
              )}

              <div className={`bg-gradient-to-br ${step.bgGradient} rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm relative z-10 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group-hover:-translate-y-2 h-full min-h-[300px]`}>
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-black text-gray-800 shadow-lg z-30 border-4 border-white">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${step.iconBg} rounded-2xl text-white shadow-lg transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
