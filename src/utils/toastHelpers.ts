// Helper to handle toast outside of React components
let toastHandler: {
  addToast?: (toast: any) => void;
  removeToast?: (id: string) => void;
} = {};

export const registerToastHandlers = (handlers: {
  addToast: (toast: any) => void;
  removeToast: (id: string) => void;
}) => {
  toastHandler = handlers;
};

export const showToast = (toast: {
  type: "success" | "error" | "info" | "warning";
  message: string | React.ReactNode;
  duration?: number;
}) => {
  if (toastHandler.addToast) {
    toastHandler.addToast(toast);
  } else {
    console.warn("Toast handler not registered. Call registerToastHandlers first.");
  }
};
