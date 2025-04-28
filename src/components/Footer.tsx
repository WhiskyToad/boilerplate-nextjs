import React, { ReactNode } from "react";
import Link from "next/link";

export interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

export interface SocialLink {
  icon: ReactNode;
  href: string;
  ariaLabel: string;
}

export interface FooterProps {
  logo?: ReactNode;
  logoText?: string;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  copyrightName?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Reusable footer component with customizable sections, social links, and branding
 */
const Footer: React.FC<FooterProps> = ({
  logo,
  logoText = "Company Name",
  description = "Your company description here",
  sections = [],
  socialLinks = [],
  copyrightText,
  copyrightName = "Company Name",
  className = "bg-base-200 text-base-content border-t",
  containerClassName = "container mx-auto",
}) => {
  const year = new Date().getFullYear();
  const defaultCopyrightText = `© ${year} ${copyrightName}. All rights reserved.`;

  return (
    <footer className={`footer relative z-30 px-6 py-10 ${className}`}>
      <div className={containerClassName}>
        <div
          className={`grid grid-cols-1 md:grid-cols-${
            sections.length + 1
          } gap-8 justify-items-center text-center md:text-left`}
        >
          {/* Branding */}
          <div className="flex flex-col items-center md:items-start">
            {logo && (
              <div className="flex items-center mb-4">
                {logo}
                {logoText && (
                  <h2 className="text-xl font-bold ml-2">{logoText}</h2>
                )}
              </div>
            )}
            {description && (
              <p className="text-sm text-base-content/70 text-center md:text-left">
                {description}
              </p>
            )}
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col items-center md:items-start"
            >
              <h3 className="text-lg font-bold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="link link-hover">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright and social */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-base-300">
          <p className="text-sm text-base-content/70 mb-4 md:mb-0">
            {copyrightText || defaultCopyrightText}
          </p>

          {socialLinks.length > 0 && (
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                  aria-label={link.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
