import React, { ReactNode } from "react";
import Link from "next/link";

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface NavDropdownItem {
  label: string;
  items: {
    label: string;
    href?: string;
    onClick?: () => void;
    highlight?: boolean;
  }[];
}

export interface HeaderProps {
  logo: ReactNode;
  navItems?: NavItem[];
  dropdowns?: NavDropdownItem[];
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  };
  rightContent?: ReactNode;
  isLoggedIn?: boolean;
  userDropdown?: {
    userAvatar: ReactNode;
    items: {
      label: string;
      href?: string;
      onClick?: () => void;
      icon?: ReactNode;
    }[];
  };
  mobileBreakpoint?: string;
  sticky?: boolean;
  className?: string;
}

/**
 * Reusable Header component with customizable navigation, user menu, CTA button
 */
const Header = ({
  logo,
  navItems = [],
  dropdowns = [],
  cta,
  rightContent,
  isLoggedIn = false,
  userDropdown,
  mobileBreakpoint = "md",
  sticky = true,
  className = "",
}: HeaderProps) => {
  const stickyClass = sticky ? "sticky top-0 z-30" : "";

  return (
    <header
      className={`bg-base-100/90 text-base-content ${stickyClass} flex h-16 w-full [transform:translate3d(0,0,0)] 
      justify-center backdrop-blur transition-shadow duration-100 print:hidden ${className}`}
    >
      <nav className="navbar w-full">
        {/* Logo section */}
        {logo && (
          <div className="flex-1 flex-row flex items-center pl-4 cursor-pointer">
            {logo}
          </div>
        )}

        <div className="flex-none flex items-center pr-4 gap-2">
          {/* Navigation Items */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`btn btn-ghost mr-2 hidden ${mobileBreakpoint}:flex items-center gap-1`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Mobile Navigation Items */}
          {navItems.map(
            (item) =>
              item.icon && (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className={`btn btn-ghost btn-sm mr-1 ${mobileBreakpoint}:hidden`}
                >
                  {item.icon}
                </Link>
              )
          )}

          {/* Dropdowns */}
          {dropdowns.map((dropdown, index) => (
            <div key={index} className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost">
                <span className={`hidden ${mobileBreakpoint}:inline mr-2`}>
                  {dropdown.label}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 9l6 6 6-6"
                  ></path>
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
              >
                {dropdown.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={
                          item.highlight ? "font-medium text-primary" : ""
                        }
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className={
                          item.highlight ? "font-medium text-primary" : ""
                        }
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA Button */}
          {cta && (
            <div className="ml-2">
              {cta.href ? (
                <Link
                  href={cta.href}
                  className="btn btn-primary btn-md flex items-center gap-1 group"
                >
                  <span>{cta.label}</span>
                  {cta.icon}
                </Link>
              ) : (
                <button
                  onClick={cta.onClick}
                  className="btn btn-primary btn-md flex items-center gap-1 group"
                >
                  <span>{cta.label}</span>
                  {cta.icon}
                </button>
              )}
            </div>
          )}

          {/* Custom Right Content */}
          {rightContent}

          {/* User Avatar Dropdown */}
          {isLoggedIn && userDropdown && (
            <div className="dropdown dropdown-end ml-2">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                {userDropdown.userAvatar}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
              >
                {userDropdown.items.map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className="flex items-center gap-2"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
