import React from "react";
import {
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  className = "",
  onClose,
  icon,
}) => {
  const variantClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  const defaultIcons = {
    info: <FiInfo className="h-6 w-6" />,
    success: <FiCheckCircle className="h-6 w-6" />,
    warning: <FiAlertTriangle className="h-6 w-6" />,
    error: <FiAlertCircle className="h-6 w-6" />,
  };

  return (
    <div className={`alert ${variantClasses[variant]} shadow-lg ${className}`}>
      <div>
        {icon || defaultIcons[variant]}
        <div>
          {title && <h3 className="font-bold">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-sm btn-ghost btn-circle"
          aria-label="Close alert"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
