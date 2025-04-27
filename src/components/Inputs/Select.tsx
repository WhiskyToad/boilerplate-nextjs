interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
  subtext?: string;
  isLoading?: boolean; // Add loading prop
}

export const Select = ({
  value,
  onChange,
  children,
  className = "",
  label,
  subtext,
  isLoading = false,
}: SelectProps) => {
  return (
    <fieldset className="fieldset p-0">
      <legend className="fieldset-legend">{label}</legend>
      <select
        defaultValue="Pick a browser"
        className={`select select-bordered ${className} ${
          isLoading ? "select-disabled animate-pulse" : ""
        }`}
        value={value}
        onChange={onChange}
        disabled={isLoading}
      >
        {isLoading ? <option>Loading...</option> : children}
      </select>
      {subtext && <span className="fieldset-label">{subtext}</span>}
    </fieldset>
  );
};
