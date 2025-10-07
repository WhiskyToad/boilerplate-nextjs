"use client";

import { useState } from "react";
import { StepIcon } from "./StepIcon";
import { ZoomSlider } from "./ZoomSlider";
import { useZoomEditing } from "../hooks/useZoomEditing";
import {
  generateStepTitle,
  getStepType,
  type StepData,
} from "../utils/step-helpers";

interface StepsSidebarProps {
  steps: StepData[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  completedSteps?: number[];
  imageSize?: { width: number; height: number } | null;
  demoId: string;
  onZoomConfigSaved?: () => void;
  onZoomChange?: (scale: number, focusX: number, focusY: number) => void;
}

export function StepsSidebar({
  steps,
  currentStepIndex,
  onStepClick,
  completedSteps = [],
  imageSize,
  demoId,
  onZoomConfigSaved,
  onZoomChange,
}: StepsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Use custom hook for zoom editing logic
  const { editingZoom, isSaving, modifiedSteps, handleZoomChange } =
    useZoomEditing({
      steps,
      currentStepIndex,
      demoId,
      onZoomChange,
      onZoomConfigSaved,
    });

  const getStepStatus = (index: number) => {
    if (index === currentStepIndex) return "current";
    if (completedSteps.includes(index)) return "completed";
    if (index < currentStepIndex) return "completed";
    return "pending";
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-[99999] w-12 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          title="Expand sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div className="mt-4 text-xs text-gray-500 writing-mode-vertical-rl">
          {steps.length} steps
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-[99999] w-80 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Steps</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentStepIndex + 1} of {steps.length}
          </p>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          title="Collapse sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id || index} className="space-y-0">
                <button
                  onClick={() => onStepClick(index)}
                  className={`
                  w-full text-left p-3 transition-all
                  ${
                    isCurrent
                      ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-md rounded-t-lg"
                      : "bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 rounded-lg"
                  }
                  ${status === "completed" ? "opacity-60" : ""}
                `}
                >
                  <div className="flex items-start gap-3">
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div
                        className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : status === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }
                    `}
                      >
                        {status === "completed" ? "✓" : index + 1}
                      </div>
                      <div className="mt-1 text-lg">
                        <StepIcon step={step} />
                      </div>
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`
                      text-sm font-medium line-clamp-2
                      ${isCurrent ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}
                    `}
                      >
                        {generateStepTitle(step, index)}
                      </div>

                      {/* Action type badge */}
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const stepType =
                            (step as any).step_type ||
                            step.type ||
                            (step as any).action_type ||
                            (step as any).event_type;
                          return stepType ? (
                            <span
                              className={`
                            text-xs px-2 py-0.5 rounded-full font-medium
                            ${stepType === "click" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : ""}
                            ${stepType === "input" || stepType === "change" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : ""}
                            ${stepType === "navigation" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : ""}
                            ${stepType === "submit" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" : ""}
                            ${!["click", "input", "change", "navigation", "submit"].includes(stepType) ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400" : ""}
                          `}
                            >
                              {stepType}
                            </span>
                          ) : null;
                        })()}

                        {/* Show input value preview for input steps */}
                        {(step.type === "input" || step.type === "change") &&
                          (step as any).value && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                              "
                              {((step as any).value as string).substring(0, 20)}
                              "
                            </span>
                          )}
                      </div>

                      {/* Thumbnail if available */}
                      {step.screenshot_url && (
                        <div className="mt-2 rounded overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                          <img
                            src={step.screenshot_url}
                            alt={`Step ${index + 1}`}
                            className="w-full h-20 object-cover object-top"
                          />
                          {isCurrent && (
                            <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Current indicator */}
                    {isCurrent && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Expandable Zoom Settings Panel - Only for current step */}
                {isCurrent && (
                  <div
                    className={`
                  px-3 pt-2 pb-3 space-y-3 border-2 border-t-0 rounded-b-lg
                  bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md
                `}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-800">
                      <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                        Zoom Settings
                      </h4>
                      <div className="flex items-center gap-2">
                        {modifiedSteps.has(index) && !isSaving && (
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            Unsaved
                          </span>
                        )}
                        {isSaving && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Saving...
                          </span>
                        )}
                        {!modifiedSteps.has(index) &&
                          !isSaving &&
                          editingZoom[index] && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Saved
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Zoom Controls */}
                    <ZoomSlider
                      label="Zoom"
                      value={editingZoom[index]?.scale || 1.5}
                      min={1}
                      max={3}
                      step={0.1}
                      unit="x"
                      onChange={(value) =>
                        handleZoomChange(index, "scale", value)
                      }
                    />

                    <ZoomSlider
                      label="Focus X"
                      value={editingZoom[index]?.focusX || 50}
                      min={0}
                      max={100}
                      step={1}
                      unit="%"
                      decimals={0}
                      onChange={(value) =>
                        handleZoomChange(index, "focusX", value)
                      }
                    />

                    <ZoomSlider
                      label="Focus Y"
                      value={editingZoom[index]?.focusY || 50}
                      min={0}
                      max={100}
                      step={1}
                      unit="%"
                      decimals={0}
                      onChange={(value) =>
                        handleZoomChange(index, "focusY", value)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer - Quick Stats */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Completed</div>
            <div className="font-bold text-green-600 dark:text-green-400">
              {currentStepIndex}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Current</div>
            <div className="font-bold text-blue-600 dark:text-blue-400">
              {currentStepIndex + 1}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Remaining</div>
            <div className="font-bold text-gray-600 dark:text-gray-400">
              {steps.length - currentStepIndex - 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
