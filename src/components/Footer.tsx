import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="footer relative z-30 bg-base-200 text-base-content border-t px-6 py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center text-center md:text-left">
          {/* Legal */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="link link-hover">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="link link-hover">
                  Privacy Policy
                </Link>
              </li>
              {/* <li>
                <Link href="/cookies" className="link link-hover">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="link link-hover">
                  Security
                </Link>
              </li> */}
            </ul>
          </div>
          {/* Branding */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 relative mr-2">
                <Image
                  src="/logo/icon.png"
                  alt="Boost Toad"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold">Boost Toad</h2>
            </div>
            <p className="text-sm text-base-content/70 text-center md:text-left">
              Transform your ideas into products with AI-powered blueprints and
              roadmaps.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create-project" className="link link-hover">
                  Create Project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and social */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-base-300">
          <p className="text-sm text-base-content/70 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Boost Toad. All rights reserved.
          </p>

          <div className="flex space-x-4 ml-4">
            <a
              href="https://twitter.com/whiskytoad"
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <FiTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com/company/whiskytoad"
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a
              href="https://github.com/whiskytoad"
              className="hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
