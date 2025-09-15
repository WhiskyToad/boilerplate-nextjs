import { ReactNode, CSSProperties } from "react";

export interface GradientTextProps {
  children: ReactNode;
  gradient?: string;
  className?: string;
  style?: CSSProperties;
  animationDelay?: string;
}

export function GradientText({
  children,
  gradient = "var(--gradient-primary)",
  className = "",
  style = {},
  animationDelay = "0s",
}: GradientTextProps) {
  const gradientStyle: CSSProperties = {
    background: gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animationDelay,
    ...style,
  };

  return (
    <span className={className} style={gradientStyle}>
      {children}
    </span>
  );
}