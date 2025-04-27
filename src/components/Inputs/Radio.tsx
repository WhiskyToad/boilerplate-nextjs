import React from "react";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  error?: string;
  required?: boolean;
  inline?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  colorScheme?: "primary" | "secondary" | "accent";
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  className = "",
  error,
  required = false,
  inline = false,
  size = "md",
  colorScheme = "primary",
}) => {
  const groupId = `radio-group-${
    name || Math.random().toString(36).substring(2, 11)
  }`;

  const sizeClass = {
    xs: "radio-xs",
    sm: "radio-sm",
    md: "",
    lg: "radio-lg",
  }[size];

  const colorClass = {
    primary: "radio-primary",
    secondary: "radio-secondary",
    accent: "radio-accent",
  }[colorScheme];

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}

      <div
        className={`${inline ? "flex flex-wrap gap-x-6 gap-y-2" : "space-y-2"}`}
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
      >
        {options.map((option, index) => {
          const optionId = `${groupId}-${index}`;
          return (
            <label
              key={optionId}
              className="label cursor-pointer justify-start gap-2"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={option.disabled}
                className={`radio ${sizeClass} ${colorClass} ${
                  error ? "radio-error" : ""
                }`}
                id={optionId}
              />
              <span className="label-text">{option.label}</span>
            </label>
          );
        })}
      </div>

      {error && (
        <div className="label pt-0">
          <span id={`${groupId}-error`} className="label-text-alt text-error">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};
