import { useState, useEffect, useCallback } from "react";
import { DEFAULT_ZOOM, getZoomConfig, type StepData } from "../utils/step-helpers";

interface ZoomState {
  scale: number;
  focusX: number;
  focusY: number;
}

interface UseZoomEditingOptions {
  steps: StepData[];
  currentStepIndex: number;
  demoId: string;
  onZoomChange?: (scale: number, focusX: number, focusY: number) => void;
  onZoomConfigSaved?: () => void;
}

/**
 * Hook to manage zoom editing state and auto-save
 */
export function useZoomEditing({
  steps,
  currentStepIndex,
  demoId,
  onZoomChange,
  onZoomConfigSaved,
}: UseZoomEditingOptions) {
  const [editingZoom, setEditingZoom] = useState<Record<number, ZoomState>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [modifiedSteps, setModifiedSteps] = useState<Set<number>>(new Set());

  // Initialize zoom values when current step changes
  useEffect(() => {
    const step = steps[currentStepIndex];
    if (!step || editingZoom[currentStepIndex]) return;

    const zoomConfig = getZoomConfig(step);

    setEditingZoom((prev) => ({
      ...prev,
      [currentStepIndex]: {
        scale: zoomConfig.scale,
        focusX: zoomConfig.focusX,
        focusY: zoomConfig.focusY,
      },
    }));
  }, [currentStepIndex, steps, editingZoom]);

  // Handle zoom value change
  const handleZoomChange = useCallback(
    (index: number, field: keyof ZoomState, value: number) => {
      setEditingZoom((prev) => {
        const currentValues = prev[index] || DEFAULT_ZOOM;
        const newValues = {
          ...currentValues,
          [field]: value,
        };

        // Immediately update preview if this is the current step
        if (index === currentStepIndex && onZoomChange) {
          onZoomChange(newValues.scale, newValues.focusX, newValues.focusY);
        }

        return {
          ...prev,
          [index]: newValues,
        };
      });
      setModifiedSteps((prev) => new Set(prev).add(index));
    },
    [currentStepIndex, onZoomChange]
  );

  // Auto-save zoom settings with debounce
  useEffect(() => {
    const zoomData = editingZoom[currentStepIndex];
    if (!zoomData || !modifiedSteps.has(currentStepIndex)) return;

    const timeoutId = setTimeout(async () => {
      const step = steps[currentStepIndex];
      if (!step?.id) return;

      setIsSaving(true);
      try {
        const config = {
          zoom: {
            enabled: true,
            scale: zoomData.scale,
            focusX: zoomData.focusX,
            focusY: zoomData.focusY,
          },
        };

        const response = await fetch(
          `/api/demos/${demoId}/steps/${step.id}/playback`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
          }
        );

        if (response.ok) {
          // Optimistically update the local step's annotations
          if (!step.annotations) {
            step.annotations = {};
          }
          step.annotations.playback = config;

          // Notify parent component to trigger re-render
          if (onZoomConfigSaved) {
            onZoomConfigSaved();
          }
        }

        // Clear modified flag after save attempt
        setModifiedSteps((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentStepIndex);
          return newSet;
        });
      } catch (error) {
        // Silently handle errors - could add toast notification here
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [editingZoom, currentStepIndex, demoId, steps, modifiedSteps, onZoomConfigSaved]);

  return {
    editingZoom,
    isSaving,
    modifiedSteps,
    handleZoomChange,
  };
}
