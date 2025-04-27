import React from "react";
import Image from "next/image";
import { FiUser } from "react-icons/fi";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square" | "rounded";
export type AvatarStatus =
  | "online"
  | "offline"
  | "away"
  | "busy"
  | "invisible"
  | null;

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  statusPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  onError?: () => void;
  bordered?: boolean;
  borderColor?: string;
  bg?: string;
  textColor?: string;
  ring?: boolean;
  ringColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  name,
  size = "md",
  shape = "circle",
  status = null,
  statusPosition = "bottom-right",
  className = "",
  icon,
  badge,
  onClick,
  onError,
  bordered = false,
  borderColor = "border-base-300",
  bg = "bg-base-300",
  textColor = "text-base-content",
  ring = false,
  ringColor = "ring-primary",
}) => {
  // Generate initials from name
  const initials = React.useMemo(() => {
    if (!name) return "";

    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  }, [name]);

  // Size classes
  const sizeClasses = React.useMemo(() => {
    const sizes = {
      xs: "w-8 h-8 text-xs",
      sm: "w-10 h-10 text-sm",
      md: "w-12 h-12 text-base",
      lg: "w-16 h-16 text-lg",
      xl: "w-24 h-24 text-xl",
    };
    return sizes[size];
  }, [size]);

  // Shape classes
  const shapeClasses = React.useMemo(() => {
    const shapes = {
      circle: "rounded-full",
      square: "rounded-none",
      rounded: "rounded-lg",
    };
    return shapes[shape];
  }, [shape]);

  // Status indicator classes
  const statusClasses = React.useMemo(() => {
    if (!status) return null;

    const statusColors = {
      online: "bg-success",
      offline: "bg-base-300",
      away: "bg-warning",
      busy: "bg-error",
      invisible: "bg-base-300 opacity-50",
    };

    const positions = {
      "bottom-right": "bottom-0 right-0",
      "bottom-left": "bottom-0 left-0",
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
    };

    return `absolute block rounded-full ${statusColors[status]} ${positions[statusPosition]}`;
  }, [status, statusPosition]);

  // Status indicator size based on avatar size
  const statusSize = React.useMemo(() => {
    const sizes = {
      xs: "w-2 h-2",
      sm: "w-3 h-3",
      md: "w-3 h-3",
      lg: "w-4 h-4",
      xl: "w-5 h-5",
    };
    return sizes[size];
  }, [size]);

  // Handle errors (e.g., image failed to load)
  const [hasError, setHasError] = React.useState(false);
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      className={`relative inline-flex shrink-0 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={`
          avatar 
          ${
            ring
              ? "ring ring-2 ring-offset-base-100 ring-offset-2 " + ringColor
              : ""
          } 
          ${bordered ? "border-2 " + borderColor : ""}
        `}
      >
        <div className={`${sizeClasses} ${shapeClasses} overflow-hidden`}>
          {src && !hasError ? (
            <Image
              src={src}
              alt={alt}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              onError={handleError}
            />
          ) : initials ? (
            <div
              className={`flex items-center justify-center w-full h-full font-medium ${bg} ${textColor}`}
            >
              {initials}
            </div>
          ) : (
            <div
              className={`flex items-center justify-center w-full h-full ${bg} ${textColor}`}
            >
              {icon || <FiUser className="w-1/2 h-1/2" />}
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`${statusClasses} ${statusSize} border-2 border-base-100`}
        ></span>
      )}

      {/* Badge (optional) */}
      {badge && <div className="absolute -top-2 -right-2 z-10">{badge}</div>}
    </div>
  );
};

export default Avatar;
