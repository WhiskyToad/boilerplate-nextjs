import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaLinkedin } from "react-icons/fa"; // Example social icons

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div>
        <Image
          src="/logo/logo_text_white.png" // Use a logo suitable for dark background
          alt="Boost Toad Logo"
          width={150}
          height={40}
          className="object-contain"
        />
        <p>
          Boost Toad Ltd.
          <br />
          Your AI Startup Coach
          <br />© {currentYear} All rights reserved
        </p>
      </div>
      <div>
        <span className="footer-title">Company</span>
        <Link href="/about" legacyBehavior>
          <a className="link link-hover">About Us</a>
        </Link>
        <Link href="/contact" legacyBehavior>
          <a className="link link-hover">Contact</a>
        </Link>
        <Link href="/blog" legacyBehavior>
          <a className="link link-hover">Blog</a>
        </Link>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <Link href="/terms" legacyBehavior>
          <a className="link link-hover">Terms of Service</a>
        </Link>
        <Link href="/privacy" legacyBehavior>
          <a className="link link-hover">Privacy Policy</a>
        </Link>
        {/* <Link href="/docs" legacyBehavior><a className="link link-hover">Documentation</a></Link> */}
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com/company/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
          {/* Add other relevant social links */}
          {/* <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="w-6 h-6" />
          </a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
