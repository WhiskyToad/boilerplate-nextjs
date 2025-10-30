"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const highlightBadgeVariants = cva(
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        primary:
          "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",
        secondary:
          "bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20",
        success:
          "bg-success/10 text-success border border-success/20 hover:bg-success/20",
        warning:
          "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20",
        neutral:
          "bg-base-200 text-base-content border border-base-300 hover:bg-base-300",
        "primary-solid": "bg-primary text-primary-content hover:bg-primary/90",
        "secondary-solid":
          "bg-secondary text-secondary-content hover:bg-secondary/90",
        "success-solid": "bg-success text-success-content hover:bg-success/90",
        "warning-solid": "bg-warning text-warning-content hover:bg-warning/90",
        blue: "bg-blue-500/10 text-white hover:bg-blue-600",
        green: "bg-green-500 text-white hover:bg-green-600",
        purple: "bg-purple-500 text-white hover:bg-purple-600",
        orange: "bg-orange-500 text-white hover:bg-orange-600",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface HighlightBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof highlightBadgeVariants> {
  icon?: ReactNode;
  dotColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "white"
    | "current";
}

export function HighlightBadge({
  className,
  variant,
  size,
  icon,
  dotColor = "current",
  children,
  ...props
}: HighlightBadgeProps) {
  const dotColorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    white: "bg-white",
    current: "bg-current",
  };

  return (
    <div
      className={cn(highlightBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && (
        <span
          className={`w-2 h-2 rounded-full ${dotColorClasses[dotColor]}`}
        ></span>
      )}
      {children}
    </div>
  );
}
