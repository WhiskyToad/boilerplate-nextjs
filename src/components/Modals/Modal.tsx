import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  preventScroll?: boolean;
  className?: string;
  contentClassName?: string;
  centered?: boolean;
  id?: string;
  closeButtonLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
  closeOnEsc = true,
  hideCloseButton = false,
  preventScroll = true,
  className = "",
  contentClassName = "",
  centered = false,
  id,
  closeButtonLabel = "Close",
}) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalId = id || `modal-${Math.random().toString(36).substring(2, 11)}`;

  // Handle component mount/unmount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle press escape to close
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
    if (preventScroll) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "var(--scrollbar-width)";
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    }

    return () => {
      if (preventScroll) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };
  }, [isOpen, preventScroll]);

  // Size classes
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full h-full",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnClickOutside) return;

    // Only close if clicked on backdrop, not modal content
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  // Don't render on server or if not mounted
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={`modal-backdrop-${modalId}`}
          className={`fixed inset-0 z-50 flex ${
            centered ? "items-center" : "items-start pt-16"
          } justify-center overflow-y-auto bg-black/50 backdrop-blur-sm ${className}`}
          onClick={handleBackdropClick}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.2 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby={title ? `modal-title-${modalId}` : undefined}
        >
          <motion.div
            className={`modal-container relative m-4 ${sizeClasses[size]} w-full bg-base-100 shadow-lg rounded-lg overflow-hidden ${contentClassName}`}
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div className="modal-header flex items-center justify-between p-4 border-b border-base-200">
                {title && (
                  <h3
                    className="text-lg font-medium"
                    id={`modal-title-${modalId}`}
                  >
                    {title}
                  </h3>
                )}
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className={`btn btn-sm btn-ghost btn-circle ${
                      title ? "" : "ml-auto"
                    }`}
                    aria-label={closeButtonLabel}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="modal-body p-4 overflow-y-auto max-h-[calc(100vh-15rem)]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="modal-footer flex justify-end p-4 border-t border-base-200 bg-base-100">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
