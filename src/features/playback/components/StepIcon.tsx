import {
  FaMousePointer,
  FaKeyboard,
  FaCompass,
  FaPaperPlane,
  FaScroll,
  FaLightbulb,
  FaQuestion,
} from "react-icons/fa";
import { getStepType } from "../utils/step-helpers";
import type { StepData } from "../utils/step-helpers";

/**
 * Get appropriate icon for step type
 */
export function StepIcon({ step }: { step: StepData }) {
  const type = getStepType(step);

  if (!type) {
    return <FaQuestion className="text-gray-400" />;
  }

  switch (type) {
    case "click":
      return <FaMousePointer className="text-blue-500" />;
    case "input":
    case "change":
      return <FaKeyboard className="text-green-500" />;
    case "navigation":
      return <FaCompass className="text-purple-500" />;
    case "scroll":
      return <FaScroll className="text-orange-500" />;
    case "submit":
      return <FaPaperPlane className="text-indigo-500" />;
    case "annotation":
      return <FaLightbulb className="text-yellow-500" />;
    default:
      return <FaLightbulb className="text-gray-400" />;
  }
}
