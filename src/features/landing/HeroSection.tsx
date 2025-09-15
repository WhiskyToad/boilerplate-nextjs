"use client";

import { FiArrowRight, FiAlertCircle, FiStar, FiZap } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button/Button";
import { HighlightBadge } from "@/components/ui/badge/HighlightBadge";
import { GradientText } from "@/components/ui/gradient-text/GradientText";
import { GradientButton } from "@/components/ui/gradient-button/GradientButton";

export interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn?: () => void;
}

export function HeroSection({ onGetStarted, onSignIn }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 min-h-screen">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero_image.jpg"
          alt="Hero background - Product dashboard and analytics"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
            Build Your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Next SaaS
              </span>
            </span>
            {" "}Faster
          </h1>

          <p className="text-2xl sm:text-3xl text-white/90 font-medium leading-relaxed max-w-5xl mx-auto mb-12 drop-shadow-md">
            Production-ready Next.js boilerplate with authentication, payments, dashboards, and more. <br />
            <span className="text-yellow-300 font-semibold">Ship your MVP in days, not months.</span>
          </p>

          {/* CTA Section */}
          <div className="flex flex-col gap-4 justify-center items-center mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <GradientButton
                onClick={onGetStarted}
                icon={<FiArrowRight />}
                size="xl"
                className="shadow-2xl"
              >
                Get Started
              </GradientButton>
              
              <Button
                variant="outline"
                size="xl"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => {
                  const dashboardSection = document.getElementById('dashboard-preview');
                  if (dashboardSection) {
                    dashboardSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                See Live Demo
              </Button>
            </div>

            {/* Simple text instead of badge */}
            <p className="text-white/80 text-lg drop-shadow">
              MIT Licensed • Production Ready • Full Documentation
            </p>
          </div>

          {/* Trust Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm mb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/32?img=1" alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/32?img=2" alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/32?img=3" alt="User avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                <div className="w-8 h-8 bg-gradient-to-br from-primary/80 to-primary rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">+</div>
              </div>
              <span className="font-medium">Used by 50+ developers</span>
            </div>
            <div className="w-px h-4 bg-white/30 hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">5.0 rating</span>
            </div>
            <div className="w-px h-4 bg-white/30 hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <FiZap className="w-4 h-4 text-green-400" />
              <span className="font-medium">Production tested</span>
            </div>
          </div>
        </div>

        {/* Product Screenshot with Better Positioning */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Dashboard */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-base-300 overflow-hidden">
            {/* Browser Bar */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded px-3 py-1 text-xs text-gray-600">
                  yourapp.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Image */}
            <Image
              src="/images/dashboard.jpg"
              alt="Feedback Dashboard Analytics"
              width={1200}
              height={700}
              className="w-full h-auto"
              quality={95}
            />
          </div>

          {/* Floating Widget */}
          <div className="absolute -bottom-6 -right-6 sm:-right-8 lg:-right-12 z-10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-primary/20 p-4 max-w-xs">
              <div className="absolute -top-2 -right-2 bg-primary text-primary-content text-xs px-2 py-1 rounded-full font-semibold">
                Your Widget
              </div>
              <Image
                src="/images/widget.jpg"
                alt="Live Feedback Widget"
                width={280}
                height={350}
                className="w-full rounded-xl"
                quality={95}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
