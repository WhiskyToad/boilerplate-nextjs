/**
 * Utility functions for working with demo steps
 */

export interface StepData {
  id?: string;
  type?: string;
  step_type?: string;
  action_type?: string;
  event_type?: string;
  element?: any;
  element_data?: any;
  annotations?: {
    text?: string;
    playback?: {
      zoom?: {
        enabled: boolean;
        scale: number;
        focusX: number;
        focusY: number;
      };
    };
  };
  screenshot_url?: string;
  value?: string;
  url?: string;
}

/**
 * Default zoom configuration
 */
export const DEFAULT_ZOOM = {
  scale: 1.5,
  focusX: 50,
  focusY: 50,
} as const;

/**
 * Extract step type from various possible field names
 */
export function getStepType(step: StepData): string | null {
  return step.step_type || step.type || step.action_type || step.event_type || null;
}

/**
 * Extract element data from step (handles different field names)
 */
export function getElementData(step: StepData) {
  return step.element || step.element_data || null;
}

/**
 * Extract playback configuration from step
 */
export function getPlaybackConfig(step: StepData) {
  return step.annotations?.playback || null;
}

/**
 * Get zoom configuration from step (saved or defaults)
 */
export function getZoomConfig(step: StepData) {
  const playbackConfig = getPlaybackConfig(step);
  
  if (playbackConfig?.zoom?.enabled) {
    return {
      ...playbackConfig.zoom,
      isCustom: true,
    };
  }

  return {
    ...DEFAULT_ZOOM,
    enabled: false,
    isCustom: false,
  };
}

/**
 * Generate a descriptive title for a step
 */
export function generateStepTitle(step: StepData, index: number): string {
  // Use annotation text if available
  if (step.annotations?.text) {
    return step.annotations.text;
  }

  const elementData = getElementData(step);
  const type = getStepType(step);

  if (!type) {
    return `Step ${index + 1}`;
  }

  // Get element identifier
  const elementName = getElementIdentifier(elementData);

  // Build human-readable description
  switch (type) {
    case "click":
      return `Click ${elementName}`;
      
    case "input":
    case "change":
      const value = step.value || elementData?.value;
      if (value) {
        const displayValue = value.length > 25 ? `${value.substring(0, 25)}...` : value;
        return `Type "${displayValue}"`;
      }
      return `Enter text in ${elementName}`;
      
    case "submit":
      return "Submit form";
      
    case "navigation":
      const url = elementData?.url || step.url;
      if (url) {
        try {
          const urlObj = new URL(url);
          const path = urlObj.pathname === "/" ? urlObj.hostname : urlObj.pathname;
          return `Go to ${path}`;
        } catch {
          return "Navigate to page";
        }
      }
      return "Navigate to page";
      
    case "scroll":
      return "Scroll page";
      
    default:
      return `${type.charAt(0).toUpperCase() + type.slice(1)} ${elementName}`;
  }
}

/**
 * Get element identifier for display
 */
function getElementIdentifier(elementData: any): string {
  if (!elementData) return "element";

  if (elementData.textContent) {
    const text = elementData.textContent.trim();
    return text.length > 30 ? `"${text.substring(0, 30)}..."` : `"${text}"`;
  }
  
  if (elementData.placeholder) {
    return `"${elementData.placeholder}"`;
  }
  
  if (elementData.id) {
    return `#${elementData.id}`;
  }
  
  if (elementData.tagName) {
    return `<${elementData.tagName.toLowerCase()}>`;
  }

  return "element";
}

/**
 * Generate action description for display
 */
export function generateActionDescription(step: StepData): string {
  const elementData = getElementData(step);
  const type = getStepType(step);

  let action = "";
  let target = "";

  // Determine action verb
  switch (type) {
    case "click":
      action = "Click";
      break;
    case "input":
    case "change":
      action = "Type in";
      break;
    case "submit":
      action = "Submit";
      break;
    case "navigation":
      action = "Navigate to";
      break;
    case "scroll":
      action = "Scroll";
      break;
    default:
      action = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Interact with";
  }

  // Determine target
  if (elementData?.textContent) {
    const text = elementData.textContent.trim();
    target = text.length > 40 ? `"${text.substring(0, 40)}..."` : `"${text}"`;
  } else if (elementData?.placeholder) {
    target = `"${elementData.placeholder}" field`;
  } else if (elementData?.tagName) {
    target = `the ${elementData.tagName.toLowerCase()}`;
  } else {
    target = "element";
  }

  return `${action} ${target}`;
}
