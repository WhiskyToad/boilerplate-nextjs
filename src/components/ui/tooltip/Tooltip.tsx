"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  children,
  content,
  position: _position = "top", // Deprecated, auto-calculates now
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: "top" });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = 8;

      // Calculate available space on all sides
      const spaceAbove = targetRect.top;
      const spaceBelow = window.innerHeight - targetRect.bottom;
      const spaceLeft = targetRect.left;
      const spaceRight = window.innerWidth - targetRect.right;

      let top = 0;
      let left = 0;
      let placement = "top";

      // Determine best placement based on available space
      if (spaceAbove >= tooltipRect.height + padding) {
        // Top placement
        placement = "top";
        top = targetRect.top + window.scrollY - tooltipRect.height - padding;
        left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
      } else if (spaceBelow >= tooltipRect.height + padding) {
        // Bottom placement
        placement = "bottom";
        top = targetRect.bottom + window.scrollY + padding;
        left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
      } else if (spaceRight >= tooltipRect.width + padding) {
        // Right placement
        placement = "right";
        top = targetRect.top + window.scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + window.scrollX + padding;
      } else if (spaceLeft >= tooltipRect.width + padding) {
        // Left placement
        placement = "left";
        top = targetRect.top + window.scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left + window.scrollX - tooltipRect.width - padding;
      } else {
        // Fallback: bottom with horizontal adjustment
        placement = "bottom";
        top = targetRect.bottom + window.scrollY + padding;
        left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
      }

      // Keep tooltip within viewport horizontally
      if (left < padding) {
        left = padding;
      } else if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }

      setTooltipPosition({ top, left, placement });
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>

      {isVisible && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[10000] bg-base-content text-base-100 text-xs px-3 py-2 rounded shadow-lg max-w-xs pointer-events-none"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
