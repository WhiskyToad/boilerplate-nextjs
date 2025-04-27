import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  indeterminate?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  colorScheme?: "primary" | "secondary" | "accent";
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  name,
  disabled = false,
  className = "",
  required = false,
  error,
  indeterminate = false,
  size = "md",
  colorScheme = "primary",
}) => {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substring(2, 11)}`;
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const sizeClass = {
    xs: "checkbox-xs",
    sm: "checkbox-sm",
    md: "",
    lg: "checkbox-lg",
  }[size];

  const colorClass = {
    primary: "checkbox-primary",
    secondary: "checkbox-secondary",
    accent: "checkbox-accent",
  }[colorScheme];

  return (
    <div className={`form-control ${className}`}>
      <label className="label cursor-pointer justify-start gap-2">
        <input
          ref={checkboxRef}
          type="checkbox"
          id={checkboxId}
          name={name || checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`checkbox ${sizeClass} ${colorClass} ${
            error ? "checkbox-error" : ""
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
        />
        {label && (
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        )}
      </label>
      {error && (
        <div className="label pt-0">
          <span
            id={`${checkboxId}-error`}
            className="label-text-alt text-error"
          >
            {error}
          </span>
        </div>
      )}
    </div>
  );
};
