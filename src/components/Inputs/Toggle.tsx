import React from "react";

export type ToggleSize = "xs" | "sm" | "md" | "lg";
export type ToggleColor =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  labelPosition?: "left" | "right";
  size?: ToggleSize;
  color?: ToggleColor;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
  srLabel?: string;
  required?: boolean;
  error?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  labelPosition = "right",
  size = "md",
  color = "primary",
  disabled = false,
  className = "",
  labelClassName = "",
  id,
  name,
  srLabel,
  required = false,
  error,
}) => {
  // Generate unique ID if not provided
  const toggleId =
    id || `toggle-${Math.random().toString(36).substring(2, 11)}`;

  // Size classes for the toggle
  const sizeClass = React.useMemo(() => {
    switch (size) {
      case "xs":
        return "toggle-xs";
      case "sm":
        return "toggle-sm";
      case "lg":
        return "toggle-lg";
      default:
        return ""; // Default (md) has no specific class in daisyUI
    }
  }, [size]);

  // Color classes for the toggle
  const colorClass = React.useMemo(() => {
    switch (color) {
      case "primary":
        return "toggle-primary";
      case "secondary":
        return "toggle-secondary";
      case "accent":
        return "toggle-accent";
      case "info":
        return "toggle-info";
      case "success":
        return "toggle-success";
      case "warning":
        return "toggle-warning";
      case "error":
        return "toggle-error";
      default:
        return "toggle-primary";
    }
  }, [color]);

  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="form-control">
      <label
        className={`label cursor-pointer justify-start gap-2 ${className}`}
      >
        {/* Show label on the left if specified */}
        {label && labelPosition === "left" && (
          <span className={`label-text ${labelClassName}`}>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}

        {/* The toggle control */}
        <input
          type="checkbox"
          id={toggleId}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`toggle ${sizeClass} ${colorClass} ${
            error ? "toggle-error" : ""
          }`}
          aria-label={
            srLabel || (typeof label === "string" ? label : undefined)
          }
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${toggleId}-error` : undefined}
        />

        {/* Show label on the right if specified */}
        {label && labelPosition === "right" && (
          <span className={`label-text ${labelClassName}`}>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
      </label>

      {/* Error message */}
      {error && (
        <div className="label pt-0">
          <span id={`${toggleId}-error`} className="label-text-alt text-error">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default Toggle;
