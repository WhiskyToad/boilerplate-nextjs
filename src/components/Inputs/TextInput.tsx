import React from "react";

interface TextInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  label?: string;
  errorMessage?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  helperText?: string;
  pattern?: string;
  readOnly?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  label,
  errorMessage = "",
  multiline = false,
  rows = 3,
  required = false,
  disabled = false,
  id,
  name,
  maxLength,
  minLength,
  autoComplete,
  helperText,
  pattern,
  readOnly = false,
}) => {
  const uniqueId =
    id || `text-input-${Math.random().toString(36).substring(2, 11)}`;
  const hasError = Boolean(errorMessage);

  const commonProps = {
    id: uniqueId,
    name: name || uniqueId,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    maxLength,
    minLength,
    readOnly,
    "aria-invalid": hasError,
    "aria-describedby": hasError
      ? `${uniqueId}-error`
      : helperText
      ? `${uniqueId}-helper`
      : undefined,
  };

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={uniqueId} className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}

      {multiline ? (
        <textarea
          {...commonProps}
          rows={rows}
          className={`textarea textarea-bordered w-full ${className} ${
            hasError ? "textarea-error" : ""
          } ${disabled ? "textarea-disabled" : ""}`}
        />
      ) : (
        <input
          type={type}
          {...commonProps}
          pattern={pattern}
          autoComplete={autoComplete}
          className={`input input-bordered w-full ${className} ${
            hasError ? "input-error" : ""
          } ${disabled ? "input-disabled" : ""}`}
        />
      )}

      <div className="label">
        {helperText && !hasError && (
          <span id={`${uniqueId}-helper`} className="label-text-alt">
            {helperText}
          </span>
        )}
        {hasError && (
          <span id={`${uniqueId}-error`} className="label-text-alt text-error">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
};
