interface ZoomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number;
  onChange: (value: number) => void;
}

/**
 * Reusable slider component for zoom controls
 */
export function ZoomSlider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  decimals = 1,
  onChange,
}: ZoomSliderProps) {
  const displayValue =
    decimals > 0 ? value.toFixed(decimals) : value.toFixed(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-600 dark:text-gray-400">
          {label}
        </label>
        <span className="text-xs font-mono text-gray-900 dark:text-white">
          {displayValue}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
