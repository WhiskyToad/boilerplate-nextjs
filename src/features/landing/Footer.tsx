"use client";

import { siteConfig } from "@/config/site-config";

export function Footer() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/#pricing" },
    ],
    Developers: [
      { name: "Documentation", href: "/docs" },
      { name: "Configuration", href: "/docs/configuration" },
      { name: "Bug Tracking", href: "/docs/bugs" },
      { name: "Feedback Collection", href: "/docs/feedback" },
      { name: "Reviews", href: "/docs/reviews" },
    ],
    Support: [{ name: "Help Center", href: "/docs/support" }],
  };

  return (
    <footer className="bg-base-200/50 border-t border-base-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo/icon.svg"
                alt={`${siteConfig.name} logo`}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-base-content">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-base-content/70 text-sm leading-relaxed mb-6 max-w-sm">
              {siteConfig.description}
            </p>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-base-content mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-base-content/60 hover:text-base-content transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-base-300/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-base-content/50">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="/privacy"
              className="text-sm text-base-content/50 hover:text-base-content transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-base-content/50 hover:text-base-content transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
