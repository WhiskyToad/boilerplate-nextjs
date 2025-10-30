"use client";

export type TimeRange = "week" | "month" | "year";

export interface TimeToggleUIProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
  disabled?: boolean;
}

export function TimeToggleUI({
  selectedRange,
  onChange,
  disabled = false,
}: TimeToggleUIProps) {
  const ranges: { key: TimeRange; label: string }[] = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  return (
    <div className="join" role="group" aria-label="Time range selector">
      {ranges.map((range) => (
        <button
          key={range.key}
          className={`join-item px-4 py-2 text-sm font-medium rounded-none transition-all duration-200 border cursor-pointer ${
            selectedRange === range.key
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-base-100 text-base-content border-base-300 hover:bg-base-200"
          } ${
            range.key === "week"
              ? "rounded-l-lg"
              : range.key === "year"
              ? "rounded-r-lg"
              : ""
          }`}
          onClick={() => onChange(range.key)}
          disabled={disabled}
          aria-pressed={selectedRange === range.key}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
