import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { FiX, FiCheck, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { registerToastHandlers } from "@/utils/toastHelpers";

// Export this type so it can be used by other components
export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string | React.ReactNode; // Update to support ReactNode
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  autoClose?: boolean;
  autoCloseTime?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "bottom-right",
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Register toast handlers for use outside of React components
  useEffect(() => {
    registerToastHandlers({ addToast, removeToast });
  }, [addToast, removeToast]);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  }[position];

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className={`fixed z-50 flex flex-col gap-2 ${positionClasses}`}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            autoClose={autoClose}
            autoCloseTime={toast.duration || autoCloseTime}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
  autoClose: boolean;
  autoCloseTime: number;
}

const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  onClose,
  autoClose,
  autoCloseTime,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoClose) {
      timer = setTimeout(onClose, autoCloseTime);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, onClose]);

  const icons = {
    success: <FiCheck className="w-5 h-5" />,
    error: <FiX className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
  };

  const alertClasses = {
    success: "alert-success",
    error: "alert-error",
    info: "alert-info",
    warning: "alert-warning",
  };

  return (
    <div className={`alert ${alertClasses[toast.type]} shadow-lg w-80`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <div className="ml-2">{toast.message}</div>
      </div>
      <button
        onClick={onClose}
        className="btn btn-circle btn-xs btn-ghost"
        aria-label="Close"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

// Example usage component
export const ExampleToastUsage: React.FC = () => {
  const { addToast } = useToast();

  const showSuccessToast = () => {
    addToast({
      type: "success",
      message: "Operation completed successfully!",
    });
  };

  const showErrorToast = () => {
    addToast({
      type: "error",
      message: "An error occurred. Please try again.",
      duration: 8000, // Custom duration
    });
  };

  return (
    <div>
      <button onClick={showSuccessToast} className="btn btn-success mr-2">
        Show Success Toast
      </button>
      <button onClick={showErrorToast} className="btn btn-error">
        Show Error Toast
      </button>
    </div>
  );
};

export default ToastProvider;
