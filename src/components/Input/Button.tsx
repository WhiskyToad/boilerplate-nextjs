import React from "react";
import Link from "next/link";
import { FiLoader } from "react-icons/fi";
import EnhancedTooltip from "../Display/EnhancedTooltip";

export interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "ghost"
    | "link"
    | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  tooltip?: string | React.ReactNode;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = "button",
  href,
  className = "",
  icon,
  iconPosition = "left",
  tooltip,
  tooltipPosition = "top",
}) => {
  const sizeClasses = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    info: "btn-info",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    ghost: "btn-ghost",
    link: "btn-link",
    outline: "btn-outline",
  };

  const buttonClasses = `btn ${variantClasses[variant]} ${sizeClasses[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const buttonContent = (
    <>
      {loading ? (
        <FiLoader className="animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </>
  );

  const button = href ? (
    <Link href={href} className={buttonClasses} onClick={onClick}>
      {buttonContent}
    </Link>
  ) : (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {buttonContent}
    </button>
  );

  if (tooltip) {
    return (
      <EnhancedTooltip content={tooltip} position={tooltipPosition}>
        {button}
      </EnhancedTooltip>
    );
  }

  return button;
};

export default Button;
