interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: (SelectOption | SelectGroup)[];
  children?: React.ReactNode;
  className?: string;
  label?: string;
  subtext?: string;
  placeholder?: string;
  isLoading?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

export const Select = ({
  value,
  onChange,
  options,
  children,
  className = "",
  label,
  subtext,
  placeholder = "Select an option",
  isLoading = false,
  required = false,
  error,
  id,
  name,
  disabled = false,
}: SelectProps) => {
  // Helper function to check if an item is a group
  const isGroup = (item: any): item is SelectGroup =>
    item && typeof item === "object" && "options" in item;

  // Generate options from props if provided
  const renderOptions = () => {
    if (isLoading) return <option disabled>Loading...</option>;

    if (options) {
      return (
        <>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((item, index) => {
            if (isGroup(item)) {
              return (
                <optgroup key={index} label={item.label}>
                  {item.options.map((option, optIndex) => (
                    <option
                      key={`${index}-${optIndex}`}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              );
            } else {
              return (
                <option key={index} value={item.value} disabled={item.disabled}>
                  {item.label}
                </option>
              );
            }
          })}
        </>
      );
    }

    // If no options provided, use children
    return children;
  };

  return (
    <div className="form-control w-full">
      <fieldset className={`fieldset p-0 ${error ? "border-error" : ""}`}>
        {label && (
          <legend className={`fieldset-legend ${required ? "required" : ""}`}>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isLoading || disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`select select-bordered w-full ${className} ${
            isLoading ? "select-disabled animate-pulse" : ""
          } ${error ? "select-error" : ""} ${
            disabled ? "select-disabled" : ""
          }`}
        >
          {renderOptions()}
        </select>
        {subtext && !error && (
          <span className="fieldset-label text-xs">{subtext}</span>
        )}
        {error && (
          <span
            id={`${id}-error`}
            className="fieldset-label text-xs text-error"
          >
            {error}
          </span>
        )}
      </fieldset>
    </div>
  );
};
