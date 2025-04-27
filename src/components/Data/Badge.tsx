import React from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  outline = false,
  className = "",
  icon,
  onClick,
}) => {
  const variantClass = `badge-${variant}`;

  const sizeClass = {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "",
    lg: "badge-lg",
  }[size];

  return (
    <div
      className={`badge ${variantClass} ${sizeClass} ${
        outline ? "badge-outline" : ""
      } ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;
