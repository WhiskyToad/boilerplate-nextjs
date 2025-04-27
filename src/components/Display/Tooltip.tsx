import React, { useState, useRef, useEffect } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipColor =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  color?: TooltipColor;
  delay?: number;
  className?: string;
  maxWidth?: string;
  openOnClick?: boolean;
  hideArrow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  color = "default",
  delay = 300,
  className = "",
  maxWidth = "250px",
  openOnClick = false,
  hideArrow = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Color classes
  const colorClasses = {
    default: "",
    primary: "tooltip-primary",
    secondary: "tooltip-secondary",
    accent: "tooltip-accent",
    info: "tooltip-info",
    success: "tooltip-success",
    warning: "tooltip-warning",
    error: "tooltip-error",
  };

  // Position classes
  const positionClasses = {
    top: "tooltip-top",
    bottom: "tooltip-bottom",
    left: "tooltip-left",
    right: "tooltip-right",
  };

  const handleMouseEnter = () => {
    if (!openOnClick) {
      clearTimeout(timeoutRef.current!);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current!);
    if (!openOnClick) {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (openOnClick) {
      setIsVisible(!isVisible);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openOnClick &&
        isVisible &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, openOnClick]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`tooltip ${positionClasses[position]} ${colorClasses[color]} ${
        hideArrow ? "tooltip-open no-animation" : ""
      } ${className}`}
      data-tip={typeof content === "string" ? content : undefined}
      ref={tooltipRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}

      {/* Custom tooltip content for non-string content */}
      {typeof content !== "string" && isVisible && (
        <div
          className={`absolute p-2 bg-base-300 text-base-content shadow-lg rounded-lg z-50 ${
            position === "top"
              ? "bottom-full mb-2"
              : position === "bottom"
              ? "top-full mt-2"
              : position === "left"
              ? "right-full mr-2"
              : "left-full ml-2"
          }`}
          style={{ maxWidth }}
        >
          {content}
          {!hideArrow && (
            <div
              className={`absolute w-2 h-2 bg-base-300 transform rotate-45 ${
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

export default Tooltip;
