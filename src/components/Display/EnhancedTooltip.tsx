import React, { useState, useRef, useEffect } from "react";

export interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  maxWidth?: string;
  hideArrow?: boolean;
  openOnClick?: boolean;
  delay?: number;
  className?: string;
  closeOnClick?: boolean;
  disabled?: boolean;
}

const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  position = "top",
  color = "default",
  maxWidth = "200px",
  hideArrow = false,
  openOnClick = false,
  delay = 0,
  className = "",
  closeOnClick = false,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (delay) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!openOnClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, openOnClick]);

  const colorClasses = {
    default: "bg-base-300 text-base-content",
    primary: "bg-primary text-primary-content",
    secondary: "bg-secondary text-secondary-content",
    accent: "bg-accent text-accent-content",
    info: "bg-info text-info-content",
    success: "bg-success text-success-content",
    warning: "bg-warning text-warning-content",
    error: "bg-error text-error-content",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={tooltipRef}
      onMouseEnter={openOnClick ? undefined : showTooltip}
      onMouseLeave={openOnClick ? undefined : hideTooltip}
      onClick={openOnClick ? () => setIsVisible(!isVisible) : undefined}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 rounded text-sm whitespace-normal ${
            colorClasses[color]
          } shadow-md ${
            position === "top"
              ? "bottom-full mb-2"
              : position === "bottom"
              ? "top-full mt-2"
              : position === "left"
              ? "right-full mr-2"
              : "left-full ml-2"
          }`}
          style={{ maxWidth }}
          onClick={closeOnClick ? hideTooltip : undefined}
        >
          {content}
          {!hideArrow && (
            <div
              className={`absolute w-2 h-2 ${
                colorClasses[color]
              } transform rotate-45 ${
                position === "top"
                  ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                  : position === "bottom"
                  ? "top-[-4px] left-1/2 -translate-x-1/2"
                  : position === "left"
                  ? "right-[-4px] top-1/2 -translate-y-1/2"
                  : "left-[-4px] top-1/2 -translate-y-1/2"
              }`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedTooltip;
