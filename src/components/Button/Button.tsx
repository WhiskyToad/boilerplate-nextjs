import React from "react";
import Link from "next/link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
  circle?: boolean;
  square?: boolean;
  glass?: boolean;
  type?: "button" | "submit" | "reset";
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as?: "button";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  as: "link";
  href: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  outline = false,
  circle = false,
  square = false,
  glass = false,
  type = "button",
  as = "button",
  onClick,
  href,
  ...rest
}) => {
  const baseClasses = [
    "btn",
    variant && `btn-${variant}`,
    size && `btn-${size}`,
    outline ? "btn-outline" : "",
    glass ? "glass" : "",
    circle ? "btn-circle" : "",
    square ? "btn-square" : "",
    fullWidth ? "w-full" : "",
    loading ? "loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </>
  );

  if (as === "link" && href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        onClick={onClick as any}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      type={type}
      onClick={onClick as any}
      {...rest}
    >
      {content}
    </button>
  );
};
