import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  className?: string;
  overlayClassName?: string;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  preventScroll?: boolean;
  footer?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  placement = "right",
  size = "md",
  className = "",
  overlayClassName = "",
  closeOnClickOutside = true,
  closeOnEsc = true,
  hideCloseButton = false,
  preventScroll = true,
  footer,
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
}) => {
  const [mounted, setMounted] = useState(false);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, closeOnEsc]);

  // Handle body scroll lock
  useEffect(() => {
    if (preventScroll && isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, preventScroll]);

  // Size classes and animations based on placement
  const sizeStyles = React.useMemo(() => {
    if (placement === "left" || placement === "right") {
      switch (size) {
        case "xs":
          return { width: "16rem" };
        case "sm":
          return { width: "24rem" };
        case "md":
          return { width: "32rem" };
        case "lg":
          return { width: "40rem" };
        case "xl":
          return { width: "48rem" };
        case "full":
          return { width: "100%" };
        default:
          return { width: "32rem" };
      }
    } else {
      switch (size) {
        case "xs":
          return { height: "16rem" };
        case "sm":
          return { height: "24rem" };
        case "md":
          return { height: "32rem" };
        case "lg":
          return { height: "40rem" };
        case "xl":
          return { height: "48rem" };
        case "full":
          return { height: "100%" };
        default:
          return { height: "32rem" };
      }
    }
  }, [placement, size]);

  // Animation variants based on placement
  const drawerVariants = React.useMemo(() => {
    switch (placement) {
      case "left":
        return {
          hidden: { x: "-100%" },
          visible: { x: 0 },
        };
      case "right":
        return {
          hidden: { x: "100%" },
          visible: { x: 0 },
        };
      case "top":
        return {
          hidden: { y: "-100%" },
          visible: { y: 0 },
        };
      case "bottom":
        return {
          hidden: { y: "100%" },
          visible: { y: 0 },
        };
      default:
        return {
          hidden: { x: "100%" },
          visible: { x: 0 },
        };
    }
  }, [placement]);

  // Positioning classes based on placement
  const positioningClasses = React.useMemo(() => {
    switch (placement) {
      case "left":
        return "top-0 left-0 h-full";
      case "right":
        return "top-0 right-0 h-full";
      case "top":
        return "top-0 left-0 w-full";
      case "bottom":
        return "bottom-0 left-0 w-full";
      default:
        return "top-0 right-0 h-full";
    }
  }, [placement]);

  // Don't render on server or if not mounted
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop/Overlay */}
          <motion.div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${overlayClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnClickOutside ? onClose : undefined}
          />

          {/* Drawer */}
          <motion.div
            className={`absolute ${positioningClasses} bg-base-100 shadow-xl flex flex-col z-10 ${className}`}
            style={sizeStyles}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div
                className={`p-4 border-b border-base-200 flex items-center justify-between ${headerClassName}`}
              >
                {title && <h3 className="text-lg font-medium">{title}</h3>}
                {!hideCloseButton && (
                  <button
                    type="button"
                    aria-label="Close drawer"
                    className={`btn btn-sm btn-ghost btn-circle ${
                      title ? "" : "ml-auto"
                    }`}
                    onClick={onClose}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className={`flex-1 overflow-y-auto p-4 ${bodyClassName}`}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className={`border-t border-base-200 p-4 ${footerClassName}`}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Drawer;
