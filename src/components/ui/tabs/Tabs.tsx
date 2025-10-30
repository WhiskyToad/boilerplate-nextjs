import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  description?: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "enhanced";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Tabs({
  items,
  activeTab,
  onChange,
  variant = "default",
  size = "md",
  className = "",
}: TabsProps) {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "enhanced") {
    return (
      <div
        className={`bg-base-100 rounded-xl border border-base-300 shadow-sm ${className}`}
      >
        <div className="flex p-2 gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && onChange(item.id)}
              disabled={item.disabled}
              className={`flex-1 flex items-center justify-center gap-3 ${
                sizeClasses[size]
              } rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? "bg-primary text-primary-content shadow-md transform scale-[1.02]"
                  : item.disabled
                  ? "text-base-content/30 cursor-not-allowed"
                  : "text-base-content/60 hover:text-base-content hover:bg-base-200/50 hover:shadow-sm cursor-pointer"
              }`}
            >
              {item.icon && (
                <span className={`${iconSizes[size]} pointer-events-none`}>
                  {item.icon}
                </span>
              )}
              <span className="pointer-events-none">{item.label}</span>
              {item.badge && (
                <span
                  className={`badge badge-sm pointer-events-none ${
                    activeTab === item.id
                      ? "bg-primary-content text-primary border-primary-content/20"
                      : "bg-base-200 text-base-content border-base-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-base-100 rounded-lg border border-base-300 ${className}`}
    >
      <div className="flex p-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onChange(item.id)}
            disabled={item.disabled}
            className={`flex-1 flex items-center justify-center gap-2 ${
              sizeClasses[size]
            } rounded-md font-medium transition-all cursor-pointer ${
              activeTab === item.id
                ? "bg-primary text-primary-content shadow-sm"
                : item.disabled
                ? "text-base-content/30 cursor-not-allowed"
                : "text-base-content/70 hover:text-base-content hover:bg-base-200 cursor-pointer"
            }`}
          >
            {item.icon && (
              <span className={`${iconSizes[size]} pointer-events-none`}>
                {item.icon}
              </span>
            )}
            <span className="pointer-events-none">{item.label}</span>
            {item.badge && (
              <span
                className={`badge badge-sm pointer-events-none ${
                  activeTab === item.id
                    ? "bg-primary-content text-primary border-primary-content/20"
                    : "bg-base-200 text-base-content border-base-300"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
