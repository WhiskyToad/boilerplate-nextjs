"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button/Button";
import { FeaturesDropdown } from "./FeaturesDropdown/FeaturesDropdown";

export interface HeaderProps {
  variant?: "landing" | "dashboard" | "docs";
  navigation?: Array<{ name: string; href: string }>;
  actions?: React.ReactNode;
  subtitle?: string;
  onSignIn?: () => void;
  onGetStarted?: () => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  user?: any;
  loading?: boolean;
  onSignOut?: () => void;
}

export function Header({
  variant = "landing",
  navigation = [],
  actions,
  subtitle,
  onSignIn,
  onGetStarted,
  sidebarOpen,
  setSidebarOpen,
  user,
  loading,
  onSignOut,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultNavigations = {
    landing: [
      { name: "Pricing", href: "#pricing" },
    ],
    dashboard: [],
    docs: [],
  };

  const nav = navigation.length > 0 ? navigation : defaultNavigations[variant];

  const renderLogo = () => {
    const logoSize = variant === "landing" && isScrolled ? 24 : 40;
    const textSize =
      variant === "landing" && isScrolled ? "text-sm" : "text-xl";
    const gap = variant === "landing" && isScrolled ? "gap-2" : "gap-3";

    return (
      <Link href="/" className="flex items-center">
        <div className={`flex items-center ${gap} group cursor-pointer`}>
          <div className="relative">
            <Image
              src="/logo/icon.svg"
              alt="Boost Toad"
              width={logoSize}
              height={logoSize}
              className="group-hover:scale-105 transition-all duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`${textSize} font-bold group-hover:text-primary transition-all duration-300 ${
                variant === "landing" ? "text-gray-900" : "text-base-content"
              }`}
            >
              Boost Toad
            </span>
            {!(variant === "landing" && isScrolled) && (
              <span
                className={`text-xs -mt-1 transition-all duration-300 ${
                  variant === "landing"
                    ? "text-gray-600"
                    : "text-base-content/60"
                }`}
              >
                {variant === "landing"
                  ? "Feedback Made Simple"
                  : subtitle || "Dashboard"}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const renderActions = () => {
    if (actions) return actions;

    if (variant === "landing" && onSignIn && onGetStarted) {
      return (
        <div className="hidden md:flex items-center space-x-3">
          <Button
            onClick={onSignIn}
            variant="ghost"
            size="md"
            className={
              variant === "landing"
                ? "text-gray-700 hover:text-primary"
                : "text-base-content/70 hover:text-primary"
            }
          >
            Sign In
          </Button>
          <Button
            onClick={onGetStarted}
            variant="primary"
            size="md"
            className="shadow-sm"
          >
            Get Started
          </Button>
        </div>
      );
    }

    if (variant === "docs") {
      if (loading) {
        // Show loading state
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 animate-pulse bg-base-300 rounded-full"></div>
          </div>
        );
      }

      if (user) {
        // User is logged in - show dashboard link and account menu
        return (
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-base-content/70 hover:text-base-content hover:bg-base-200 rounded-lg transition-colors"
            >
              <span>Dashboard</span>
            </Link>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost hover:bg-base-200 gap-1 px-3"
              >
                <svg
                  className="w-5 h-5 text-base-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <svg
                  className="w-3 h-3 text-base-content/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300"
              >
                <li>
                  <div className="flex flex-col py-2 px-2 pointer-events-none">
                    <span className="text-sm font-medium text-base-content">
                      {user.email}
                    </span>
                  </div>
                </li>
                <li>
                  <div className="divider my-1"></div>
                </li>
                <li>
                  <Link href="/settings" className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Account Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={onSignOut}
                    className="flex items-center gap-2 text-error hover:bg-error/10"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        );
      } else {
        // User is not logged in - show sign in and get started
        return (
          <div className="hidden md:flex items-center space-x-3">
            <Button
              onClick={onSignIn}
              variant="ghost"
              size="md"
              className="text-base-content/70 hover:text-primary"
            >
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              variant="primary"
              size="md"
              className="shadow-sm"
            >
              Get Started
            </Button>
          </div>
        );
      }
    }

    return null;
  };

  const getHeaderClass = () => {
    if (variant === "landing") {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white shadow-xl border border-gray-200 mx-8 sm:mx-12 md:mx-16 lg:mx-24 xl:mx-32 mt-3 rounded-3xl"
          : "bg-white border-b border-gray-200 shadow-sm"
      }`;
    }
    return "sticky top-0 z-50 bg-base-100 border-b border-base-300";
  };

  const getContainerClass = () => {
    if (variant === "landing") {
      return `transition-all duration-300 ease-in-out ${
        isScrolled
          ? "max-w-4xl mx-auto px-4 py-1"
          : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      }`;
    }
    return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  };

  const getItemsContainerClass = () => {
    if (variant === "landing") {
      return `flex justify-between items-center transition-all duration-300 ease-in-out ${
        isScrolled ? "h-12" : "h-16"
      }`;
    }
    return "flex justify-between items-center h-16";
  };

  return (
    <>
      {/* Add body padding for fixed positioning on landing pages */}
      {variant === "landing" && (
        <div
          className={`transition-all duration-300 ease-in-out ${
            isScrolled ? "h-16" : "h-16"
          }`}
        />
      )}
      <header className={getHeaderClass()}>
        <div className={getContainerClass()}>
          <div className={getItemsContainerClass()}>
            {/* Mobile menu button - left side for docs */}
            {variant === "docs" && setSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-base-content/70 hover:text-base-content hover:bg-base-200 lg:hidden"
              >
                {sidebarOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            )}

            {/* Logo */}
            <div
              className={`flex items-center ${
                variant === "docs" ? "ml-4 lg:ml-0" : ""
              }`}
            >
              {renderLogo()}
            </div>

            {/* Desktop Navigation */}
            {variant === "landing" && (
              <nav className="hidden md:flex items-center space-x-1">
                <FeaturesDropdown />
                {nav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/5 ${
                      variant === "landing"
                        ? "text-gray-700 hover:text-primary"
                        : "text-base-content/70 hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            )}
            {variant !== "landing" && nav.length > 0 && (
              <nav className="hidden md:flex items-center space-x-1">
                {nav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/5 text-base-content/70 hover:text-primary`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            )}

            {/* Spacer for docs variant when no navigation */}
            {variant === "docs" && nav.length === 0 && (
              <div className="flex-1"></div>
            )}

            {/* Actions */}
            <div className="flex items-center">{renderActions()}</div>

            {/* Mobile menu button - right side for landing */}
            {variant === "landing" && (
              <div className="md:hidden">
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  {isMenuOpen ? (
                    <FiX className="w-5 h-5" />
                  ) : (
                    <FiMenu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && variant === "landing" && (
            <div className="md:hidden border-t border-base-300/30 py-6 bg-base-50/50 backdrop-blur-sm">
              <div className="space-y-1">
                <a
                  href="/#features"
                  className="block px-4 py-3 text-base-content/70 hover:text-primary hover:bg-primary/5 text-sm font-medium transition-all duration-200 rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                {nav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-base-content/70 hover:text-primary hover:bg-primary/5 text-sm font-medium transition-all duration-200 rounded-lg mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 mt-4 border-t border-base-300/30 space-y-3 mx-2">
                  <Button
                    onClick={() => {
                      onSignIn?.();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    size="md"
                    className="w-full justify-start text-base-content/70 hover:text-primary"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      onGetStarted?.();
                      setIsMenuOpen(false);
                    }}
                    variant="primary"
                    size="md"
                    className="w-full shadow-sm"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
