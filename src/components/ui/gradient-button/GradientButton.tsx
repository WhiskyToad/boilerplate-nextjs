import { ReactNode } from "react";

export interface GradientButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "md" | "lg" | "xl";
  gradient?: string;
  disabled?: boolean;
}

export function GradientButton({
  children,
  icon,
  onClick,
  className = "",
  size = "xl",
  gradient = "linear-gradient(180deg, #1972f5 0%, #1557c7 100%)",
  disabled = false,
}: GradientButtonProps) {
  const sizeClasses = {
    md: "text-base px-6 py-3 rounded-2xl",
    lg: "text-lg px-7 py-3 rounded-2xl",
    xl: "text-xl px-8 py-3 rounded-3xl",
  };

  const iconSizeClasses = {
    md: "w-8 h-8 ml-3",
    lg: "w-9 h-9 ml-3",
    xl: "w-10 h-10 ml-4",
  };

  const iconInnerSizeClasses = {
    md: "w-4 h-4",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center group hover:shadow-glow text-white font-semibold 
        transition-all duration-300 hover:transform hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
        cursor-pointer
        ${sizeClasses[size]} ${className}
      `}
      style={{
        background: disabled ? "#9ca3af" : gradient,
        border: "none",
      }}
    >
      {children}
      {icon && (
        <div
          className={`bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 ${iconSizeClasses[size]}`}
        >
          <div className={iconInnerSizeClasses[size]}>{icon}</div>
        </div>
      )}
    </button>
  );
}
