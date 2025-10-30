import { useState, ReactNode } from "react";
import { FiChevronRight } from "react-icons/fi";

export interface AccordionItem {
  id: string;
  title: string | ReactNode;
  content: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenItems?: string[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  default: "bg-base-100 border border-base-300",
  bordered: "border border-base-300",
  minimal: "border-b border-base-300 last:border-b-0"
};

const sizeStyles = {
  sm: {
    header: "px-3 py-2 text-sm",
    content: "px-3 pb-3",
    icon: "w-4 h-4"
  },
  md: {
    header: "px-4 py-3 text-base",
    content: "px-4 pb-4",
    icon: "w-4 h-4"
  },
  lg: {
    header: "px-5 py-4 text-lg",
    content: "px-5 pb-5",
    icon: "w-5 h-5"
  }
};

export function Accordion({
  items,
  defaultOpenItems = [],
  allowMultiple = false,
  variant = "default",
  size = "md",
  className = ""
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpenItems));

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(itemId);
    }
    
    setOpenItems(newOpenItems);
  };

  const isOpen = (itemId: string) => openItems.has(itemId);

  return (
    <div className={`divide-y divide-base-300 ${className}`}>
      {items.map((item) => {
        const isItemOpen = isOpen(item.id);
        const styles = sizeStyles[size];
        
        return (
          <div
            key={item.id}
            className={`${variantStyles[variant]} ${
              variant === "default" ? "rounded-lg mb-2" : ""
            } ${item.disabled ? "opacity-50" : ""}`}
          >
            {/* Header */}
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                w-full flex items-center justify-between ${styles.header}
                ${!item.disabled ? "hover:bg-base-200/50 cursor-pointer" : "cursor-not-allowed"}
                ${variant === "default" ? "rounded-t-lg" : ""}
                ${isItemOpen && variant === "default" ? "" : "rounded-b-lg"}
                transition-colors duration-200
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {typeof item.title === "string" ? (
                    <span className="font-medium text-base-content">{item.title}</span>
                  ) : (
                    item.title
                  )}
                  {item.badge && (
                    <span className="badge badge-neutral badge-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              
              <div className={`transition-transform duration-200 ${isItemOpen ? "rotate-90" : ""}`}>
                <FiChevronRight className={`${styles.icon} text-base-content/60`} />
              </div>
            </button>

            {/* Content */}
            {isItemOpen && (
              <div
                className={`
                  ${styles.content}
                  ${variant === "default" ? "rounded-b-lg" : ""}
                  animate-in slide-in-from-top-2 duration-200
                `}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Single accordion item component for simple use cases
export interface SingleAccordionProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  badge?: string | number;
  variant?: "default" | "bordered" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SingleAccordion({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  badge,
  variant = "default",
  size = "md",
  className = ""
}: SingleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const styles = sizeStyles[size];

  return (
    <div className={`${variantStyles[variant]} ${
      variant === "default" ? "rounded-lg" : ""
    } ${disabled ? "opacity-50" : ""} ${className}`}>
      {/* Header */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between ${styles.header}
          ${!disabled ? "hover:bg-base-200/50 cursor-pointer" : "cursor-not-allowed"}
          ${variant === "default" ? "rounded-t-lg" : ""}
          ${isOpen && variant === "default" ? "" : "rounded-b-lg"}
          transition-colors duration-200
        `}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {typeof title === "string" ? (
              <span className="font-medium text-base-content">{title}</span>
            ) : (
              title
            )}
            {badge && (
              <span className="badge badge-neutral badge-sm">
                {badge}
              </span>
            )}
          </div>
        </div>
        
        <div className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>
          <FiChevronRight className={`${styles.icon} text-base-content/60`} />
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div
          className={`
            ${styles.content}
            ${variant === "default" ? "rounded-b-lg" : ""}
            animate-in slide-in-from-top-2 duration-200
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}