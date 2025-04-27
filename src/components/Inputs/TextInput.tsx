interface TextInputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  errorMessage?: string;
  multiline?: boolean; // New prop to toggle between input and textarea
  rows?: number; // Optional prop for textarea rows
}

export const TextInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  errorMessage = "",
  multiline = false,
  rows = 3,
}: TextInputProps) => {
  return (
    <div className="text-input-wrapper w-full flex flex-col gap-1 text-left">
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`textarea textarea-bordered ${className} ${
            Boolean(errorMessage) ? "textarea-error" : ""
          }`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input input-bordered ${className} ${
            Boolean(errorMessage) ? "input-error" : ""
          }`}
        />
      )}
      {Boolean(errorMessage) && (
        <span className="error-message text-sm pl-4">{errorMessage}</span>
      )}
    </div>
  );
};
