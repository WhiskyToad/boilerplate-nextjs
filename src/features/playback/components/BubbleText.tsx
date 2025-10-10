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
  transformOrigin: string;
}

export function BubbleText({
  config,
  highlightPosition,
  imageScale,
  transformOrigin,
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
    // Calculate element center in image coordinates
    const elementCenterX = highlightPosition.x + highlightPosition.width / 2;
    const elementCenterY = highlightPosition.y + highlightPosition.height / 2;

    let placement = config.position || "auto";
    let bubbleX = elementCenterX;
    let bubbleY = highlightPosition.y;

    // Auto-position: choose best position based on element location
    // Use image coordinates to determine placement
    if (placement === "auto") {
      // Simple rule: if element is in top 60% of image, show bubble below
      // Otherwise show above
      if (elementCenterY < highlightPosition.height * 3) {
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

    // Position is in image coordinates - browser will scale with transform
    setPosition({ x: bubbleX, y: bubbleY, placement });
  }, [highlightPosition, config.position]);

  // Message bubble style - white background with subtle shadow
  const baseClasses =
    "absolute z-40 px-4 py-3 rounded-2xl shadow-lg font-medium text-sm pointer-events-none bg-white text-gray-900 border border-gray-200";

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

  return (
    <div
      className={`${baseClasses} animate-in fade-in zoom-in-95 duration-300`}
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
      {/* Arrow/pointer - message bubble style */}
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
                : "left"]: "-6px",
        }}
      >
        <div
          className={`w-0 h-0 border-[6px] border-transparent ${
            position.placement === "top"
              ? "border-t-white"
              : position.placement === "bottom"
                ? "border-b-white"
                : position.placement === "left"
                  ? "border-l-white"
                  : "border-r-white"
          }`}
          style={{
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
          }}
        />
      </div>
    </div>
  );
}
