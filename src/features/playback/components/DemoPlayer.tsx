"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaybackState } from "@/hooks/usePlaybackState";
import { StepsSidebar } from "./StepsSidebar";
import { PlaybackTopBar } from "./PlaybackTopBar";
import { BubbleText } from "./BubbleText";
import {
  generateActionDescription,
  getElementData,
  getBubbleConfig,
  type StepData,
} from "../utils/step-helpers";
import type { PlaybackConfig } from "../types/playback-config";

interface DemoPlayerProps {
  steps: StepData[];
  demoId: string;
  demoTitle?: string;
}

export function DemoPlayer({ steps, demoId, demoTitle }: DemoPlayerProps) {
  const router = useRouter();
  const { state, nextStep, prevStep, jumpToStep } = usePlaybackState(steps);
  const [highlightPosition, setHighlightPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  // Force re-render when zoom config is saved
  const [zoomConfigVersion, setZoomConfigVersion] = useState(0);
  // Track if user is actively editing zoom (to prevent useEffect from overriding)
  const [isEditingZoom, setIsEditingZoom] = useState(false);

  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node) {
      const updateSize = () => {
        setImageSize({
          width: node.naturalWidth,
          height: node.naturalHeight,
        });
      };
      if (node.complete) {
        updateSize();
      } else {
        node.addEventListener("load", updateSize);
      }
    }
  }, []);

  // Update highlight position when step changes
  useEffect(() => {
    const currentStep = steps[state.currentStepIndex];
    if (!currentStep || !imageSize) {
      setHighlightPosition(null);
      return;
    }

    // Get element data
    const elementData = getElementData(currentStep);
    if (!elementData) {
      setHighlightPosition(null);
      return;
    }

    // Get bounding rect from captured data
    const boundingRect = elementData.boundingRect || elementData.bounding_rect;
    const viewport = elementData.viewport;

    if (!boundingRect || !viewport) {
      setHighlightPosition(null);
      return;
    }

    // Normalize bounding rect - handle both x/y and left/top formats
    const normalizedRect = {
      x: boundingRect.x ?? boundingRect.left ?? 0,
      y: boundingRect.y ?? boundingRect.top ?? 0,
      width: boundingRect.width ?? 0,
      height: boundingRect.height ?? 0,
    };

    // Calculate scale factor between captured viewport and displayed image
    // The screenshot was taken at viewport.width x viewport.height
    // But now it's displayed at imageSize.width x imageSize.height
    const scaleX = imageSize.width / viewport.width;
    const scaleY = imageSize.height / viewport.height;

    // Calculate highlight position accounting for scale
    const scaledPosition = {
      x: normalizedRect.x * scaleX,
      y: normalizedRect.y * scaleY,
      width: normalizedRect.width * scaleX,
      height: normalizedRect.height * scaleY,
    };

    setHighlightPosition(scaledPosition);
  }, [state.currentStepIndex, steps, imageSize]);

  // Reset editing flag when step changes
  useEffect(() => {
    setIsEditingZoom(false);
  }, [state.currentStepIndex]);

  // Apply zoom from saved playback config or use defaults
  useEffect(() => {
    // Don't override zoom if user is actively editing
    if (isEditingZoom) {
      return;
    }

    const currentStep = steps[state.currentStepIndex];
    if (!currentStep || !imageSize) {
      setImageScale(1);
      setTransformOrigin("center center");
      return;
    }

    // Check if step has saved playback configuration
    const playbackConfig: PlaybackConfig | undefined =
      currentStep.annotations?.playback;

    if (playbackConfig?.zoom?.enabled) {
      // Use saved zoom configuration
      setImageScale(playbackConfig.zoom.scale);
      setTransformOrigin(
        `${playbackConfig.zoom.focusX}% ${playbackConfig.zoom.focusY}%`
      );
    } else {
      // Use default zoom (no auto-calculation)
      setImageScale(1.5);
      setTransformOrigin("50% 50%");
    }
  }, [
    state.currentStepIndex,
    steps,
    imageSize,
    zoomConfigVersion,
    isEditingZoom,
  ]);

  const handleResetZoom = useCallback(() => {
    setImageScale(1);
    setTransformOrigin("center center");
  }, []);

  // Keyboard shortcuts
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default for navigation keys
      if (["ArrowRight", "ArrowLeft", "Escape"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowRight":
          nextStep();
          break;
        case "ArrowLeft":
          prevStep();
          break;
        case "Escape":
          router.push(`/demos/${demoId}`);
          break;
        case "Home":
          jumpToStep(0);
          break;
        case "End":
          jumpToStep(steps.length - 1);
          break;
        case "0":
          handleResetZoom();
          break;
      }
    },
    [
      nextStep,
      prevStep,
      jumpToStep,
      router,
      demoId,
      steps.length,
      handleResetZoom,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleClose = useCallback(() => {
    router.push(`/demos/${demoId}`);
  }, [router, demoId]);

  const currentStep = steps[state.currentStepIndex];
  const screenshotUrl = currentStep?.screenshot_url;

  // Callback when zoom config is saved to force re-render
  const handleZoomConfigSaved = useCallback(() => {
    setIsEditingZoom(false);
    setZoomConfigVersion((v) => v + 1);
  }, []);

  // Callback for immediate zoom preview while editing
  const handleZoomChange = useCallback(
    (scale: number, focusX: number, focusY: number) => {
      setIsEditingZoom(true);
      setImageScale(scale);
      setTransformOrigin(`${focusX}% ${focusY}%`);
    },
    []
  );

  return (
    <>
      {/* Steps Sidebar */}
      <StepsSidebar
        steps={steps}
        currentStepIndex={state.currentStepIndex}
        onStepClick={jumpToStep}
        demoId={demoId}
        imageSize={imageSize}
        onZoomConfigSaved={handleZoomConfigSaved}
        onZoomChange={handleZoomChange}
      />

      {/* Top Navigation Bar */}
      <PlaybackTopBar
        demoTitle={demoTitle}
        currentStep={state.currentStepIndex}
        totalSteps={state.totalSteps}
        stepDescription={
          currentStep?.annotations?.text ||
          (currentStep ? generateActionDescription(currentStep) : "Loading...")
        }
        onNext={nextStep}
        onPrev={prevStep}
        onClose={handleClose}
      />

      {/* Main Content Area - Screenshot with enhanced highlight overlay */}
      <div className="fixed top-14 left-80 right-0 bottom-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-[99998] overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center p-8">
          {/* Screenshot */}
          {screenshotUrl ? (
            <div
              className="relative flex flex-col"
              style={{ maxWidth: "90%", maxHeight: "90%" }}
            >
              {/* Browser-like window header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-t-4 border-blue-500 rounded-t-xl border-x border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-400 max-w-md truncate">
                    Step {state.currentStepIndex + 1} of {state.totalSteps}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  {imageScale.toFixed(1)}x
                </div>
              </div>

              {/* Screenshot viewport */}
              {/* Screenshot viewport - wraps image at natural size */}
              <div className="relative overflow-hidden bg-white border-x border-b border-gray-700 rounded-b-xl shadow-2xl">
                <img
                  ref={imageRef}
                  src={screenshotUrl}
                  alt={`Step ${state.currentStepIndex + 1}`}
                  className="block max-w-full max-h-full object-contain"
                  style={{
                    transform: `scale(${imageScale})`,
                    transformOrigin: transformOrigin,
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />

                {/* Element Highlight Overlay - Clean and Accurate */}
                {highlightPosition && (
                  <>
                    {/* Clean highlight box */}
                    <div
                      className="absolute pointer-events-none z-30"
                      style={{
                        left: `${highlightPosition.x}px`,
                        top: `${highlightPosition.y}px`,
                        width: `${highlightPosition.width}px`,
                        height: `${highlightPosition.height}px`,
                        border: "3px solid #3B82F6",
                        borderRadius: "4px",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        boxShadow:
                          "0 0 0 4px rgba(59, 130, 246, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />

                    {/* Bubble text annotation */}
                    {getBubbleConfig(currentStep) && (
                      <BubbleText
                        config={getBubbleConfig(currentStep)!}
                        highlightPosition={highlightPosition}
                        imageScale={imageScale}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg">No screenshot available for this step</p>
              <p className="text-sm mt-2">
                {currentStep?.type || "Unknown action"} on{" "}
                {currentStep?.element?.tagName || "element"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
