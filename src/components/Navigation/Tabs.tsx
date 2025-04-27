import React from "react";

interface TabProps {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  value: string;
  onChange: (value: string) => void;
  variant?: "bordered" | "lifted" | "boxed";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  tabsClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  children,
  value,
  onChange,
  variant = "bordered",
  size = "md",
  className = "",
  tabsClassName = "",
}) => {
  const tabsArray = React.Children.toArray(
    children
  ) as React.ReactElement<TabProps>[];

  const variantClass = {
    bordered: "tabs-bordered",
    lifted: "tabs-lifted",
    boxed: "tabs-boxed",
  }[variant];

  const sizeClass = {
    xs: "tabs-xs",
    sm: "tabs-sm",
    md: "",
    lg: "tabs-lg",
  }[size];

  return (
    <div className={className}>
      <div className={`tabs ${variantClass} ${sizeClass} ${tabsClassName}`}>
        {tabsArray.map((tab) => {
          const isActive = tab.props.value === value;
          return (
            <button
              key={tab.props.value}
              className={`tab ${isActive ? "tab-active" : ""} ${
                tab.props.className || ""
              }`}
              disabled={tab.props.disabled}
              onClick={() => !tab.props.disabled && onChange(tab.props.value)}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
            >
              {tab.props.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
