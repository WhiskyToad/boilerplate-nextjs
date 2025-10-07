"use client";

import { useEffect, useState } from "react";
import type { BubbleConfig } from "../utils/step-helpers";

interface BubbleTextProps {
  config: BubbleConfig;
  highlightPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  imageScale: number;
}

export function BubbleText({
  config,
  highlightPosition,
  imageScale,
}: BubbleTextProps) {
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    placement: string;
  }>({
    x: 0,
    y: 0,
    placement: "top",
  });

  useEffect(() => {
    // Calculate bubble position relative to highlighted element
    const elementCenterX = highlightPosition.x + highlightPosition.width / 2;
    const elementCenterY = highlightPosition.y + highlightPosition.height / 2;

    let placement = config.position || "auto";
    let bubbleX = elementCenterX;
    let bubbleY = highlightPosition.y;

    // Auto-position: choose best position based on element location
    if (placement === "auto") {
      // If element is in top half, show bubble below
      if (elementCenterY < window.innerHeight / 2) {
        placement = "bottom";
        bubbleY = highlightPosition.y + highlightPosition.height;
      } else {
        placement = "top";
        bubbleY = highlightPosition.y;
      }
    } else {
      // Manual position
      switch (placement) {
        case "top":
          bubbleY = highlightPosition.y;
          break;
        case "bottom":
          bubbleY = highlightPosition.y + highlightPosition.height;
          break;
        case "left":
          bubbleX = highlightPosition.x;
          bubbleY = elementCenterY;
          break;
        case "right":
          bubbleX = highlightPosition.x + highlightPosition.width;
          bubbleY = elementCenterY;
          break;
      }
    }

    setPosition({ x: bubbleX, y: bubbleY, placement });
  }, [highlightPosition, config.position, imageScale]);

  const bubbleStyle = config.style || "callout";

  // Base classes for all bubble styles
  const baseClasses =
    "absolute z-40 px-4 py-2 rounded-lg shadow-xl font-medium text-sm pointer-events-none";

  // Style-specific classes
  const styleClasses = {
    tooltip: "bg-gray-900 text-white",
    callout: "bg-blue-500 text-white",
    speech: "bg-white text-gray-900 border-2 border-blue-500",
  };

  // Position-specific transform
  const getTransform = () => {
    switch (position.placement) {
      case "top":
        return "translate(-50%, -100%) translateY(-12px)";
      case "bottom":
        return "translate(-50%, 0%) translateY(12px)";
      case "left":
        return "translate(-100%, -50%) translateX(-12px)";
      case "right":
        return "translate(0%, -50%) translateX(12px)";
      default:
        return "translate(-50%, -100%) translateY(-12px)";
    }
  };

  // Arrow/pointer for the bubble
  const getArrowClasses = () => {
    const arrowBase = "absolute w-0 h-0 border-8 border-transparent";

    switch (position.placement) {
      case "top":
        return `${arrowBase} border-t-${bubbleStyle === "speech" ? "blue-500" : bubbleStyle === "callout" ? "blue-500" : "gray-900"} left-1/2 -translate-x-1/2 -bottom-4`;
      case "bottom":
        return `${arrowBase} border-b-${bubbleStyle === "speech" ? "blue-500" : bubbleStyle === "callout" ? "blue-500" : "gray-900"} left-1/2 -translate-x-1/2 -top-4`;
      case "left":
        return `${arrowBase} border-l-${bubbleStyle === "speech" ? "blue-500" : bubbleStyle === "callout" ? "blue-500" : "gray-900"} top-1/2 -translate-y-1/2 -right-4`;
      case "right":
        return `${arrowBase} border-r-${bubbleStyle === "speech" ? "blue-500" : bubbleStyle === "callout" ? "blue-500" : "gray-900"} top-1/2 -translate-y-1/2 -left-4`;
      default:
        return `${arrowBase} border-t-gray-900 left-1/2 -translate-x-1/2 -bottom-4`;
    }
  };

  return (
    <div
      className={`${baseClasses} ${styleClasses[bubbleStyle]} animate-in fade-in zoom-in-95 duration-300`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: getTransform(),
        maxWidth: "300px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {config.text}
      {/* Arrow/pointer */}
      <div
        className="absolute"
        style={{
          left:
            position.placement === "left" || position.placement === "right"
              ? undefined
              : "50%",
          top:
            position.placement === "left" || position.placement === "right"
              ? "50%"
              : undefined,
          transform:
            position.placement === "left" || position.placement === "right"
              ? "translateY(-50%)"
              : "translateX(-50%)",
          [position.placement === "top"
            ? "bottom"
            : position.placement === "bottom"
              ? "top"
              : position.placement === "left"
                ? "right"
                : "left"]: "-8px",
        }}
      >
        <div
          className={`w-0 h-0 border-8 border-transparent ${
            position.placement === "top"
              ? `border-t-${bubbleStyle === "speech" ? "white" : bubbleStyle === "callout" ? "blue-500" : "gray-900"}`
              : position.placement === "bottom"
                ? `border-b-${bubbleStyle === "speech" ? "white" : bubbleStyle === "callout" ? "blue-500" : "gray-900"}`
                : position.placement === "left"
                  ? `border-l-${bubbleStyle === "speech" ? "white" : bubbleStyle === "callout" ? "blue-500" : "gray-900"}`
                  : `border-r-${bubbleStyle === "speech" ? "white" : bubbleStyle === "callout" ? "blue-500" : "gray-900"}`
          }`}
        />
        {bubbleStyle === "speech" && (
          <div
            className={`absolute w-0 h-0 border-8 border-transparent ${
              position.placement === "top"
                ? "border-t-blue-500 -top-[18px] left-1/2 -translate-x-1/2"
                : position.placement === "bottom"
                  ? "border-b-blue-500 -bottom-[18px] left-1/2 -translate-x-1/2"
                  : position.placement === "left"
                    ? "border-l-blue-500 -left-[18px] top-1/2 -translate-y-1/2"
                    : "border-r-blue-500 -right-[18px] top-1/2 -translate-y-1/2"
            }`}
          />
        )}
      </div>
    </div>
  );
}
