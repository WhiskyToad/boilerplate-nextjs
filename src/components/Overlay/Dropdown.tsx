import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface DropdownItemProps {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: (value: string) => void;
  className?: string;
}

export interface DropdownDividerProps {
  type: "divider";
  key?: string;
  className?: string;
}

export interface DropdownSectionProps {
  type: "section";
  title: string;
  key?: string;
  items: (DropdownItemProps | DropdownDividerProps)[];
  titleClassName?: string;
}

export type DropdownContentItem =
  | DropdownItemProps
  | DropdownDividerProps
  | DropdownSectionProps;

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownContentItem[];
  onChange?: (value: string) => void;
  value?: string;
  placement?:
    | "bottom-start"
    | "bottom-end"
    | "bottom"
    | "top-start"
    | "top-end"
    | "top"
    | "left"
    | "right";
  width?: string;
  className?: string;
  menuClassName?: string;
  closeOnSelect?: boolean;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onChange,
  value,
  placement = "bottom",
  width = "w-52",
  className = "",
  menuClassName = "",
  closeOnSelect = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle click on dropdown item
  const handleItemClick = (item: DropdownItemProps) => {
    if (item.disabled) return;

    // Handle value change
    if (onChange) {
      onChange(item.value);
    }

    // Handle item's onClick callback
    if (item.onClick) {
      item.onClick(item.value);
    }

    // Close dropdown if needed
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  // Handle toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Determine placement classes
  const placementClasses = {
    "bottom-start": "dropdown-bottom dropdown-start",
    "bottom-end": "dropdown-bottom dropdown-end",
    bottom: "dropdown-bottom",
    "top-start": "dropdown-top dropdown-start",
    "top-end": "dropdown-top dropdown-end",
    top: "dropdown-top",
    left: "dropdown-left",
    right: "dropdown-right",
  }[placement];

  // Render dropdown item
  const renderItem = (
    item: DropdownItemProps | DropdownDividerProps,
    index: number
  ) => {
    if ("type" in item && item.type === "divider") {
      return (
        <li
          key={item.key || `divider-${index}`}
          className={`divider ${item.className || ""}`}
        />
      );
    }

    const itemProps = item as DropdownItemProps;
    const isActive = value === itemProps.value;

    return (
      <li key={itemProps.value || `item-${index}`}>
        {itemProps.href ? (
          <a
            href={itemProps.href}
            className={`flex items-center ${
              itemProps.disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${isActive ? "active" : ""} ${itemProps.className || ""}`}
            onClick={(e) => {
              if (itemProps.disabled) {
                e.preventDefault();
                return;
              }
              handleItemClick(itemProps);
            }}
          >
            {itemProps.icon && <span className="mr-2">{itemProps.icon}</span>}
            {itemProps.label}
          </a>
        ) : (
          <button
            type="button"
            className={`flex items-center w-full text-left ${
              itemProps.disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${isActive ? "active" : ""} ${itemProps.className || ""}`}
            onClick={() => handleItemClick(itemProps)}
            disabled={itemProps.disabled}
          >
            {itemProps.icon && <span className="mr-2">{itemProps.icon}</span>}
            {itemProps.label}
          </button>
        )}
      </li>
    );
  };

  // Render section
  const renderSection = (section: DropdownSectionProps, index: number) => {
    return (
      <li key={section.key || `section-${index}`}>
        <h3 className={`menu-title ${section.titleClassName || ""}`}>
          {section.title}
        </h3>
        <ul>{section.items.map((item, idx) => renderItem(item, idx))}</ul>
      </li>
    );
  };

  return (
    <div
      className={`dropdown ${placementClasses} ${
        isOpen ? "dropdown-open" : ""
      } ${className}`}
      ref={dropdownRef}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={toggleDropdown}
        className={`${
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        } focus:outline-none`}
      >
        {typeof trigger === "string" ? (
          <button className="btn flex items-center gap-1" disabled={disabled}>
            {trigger} <FiChevronDown />
          </button>
        ) : (
          trigger
        )}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className={`dropdown-content menu p-2 shadow bg-base-200 rounded-box z-50 ${width} ${menuClassName}`}
        >
          {items.map((item, index) => {
            if ("type" in item) {
              if (item.type === "section") {
                return renderSection(item as DropdownSectionProps, index);
              }
              return renderItem(item, index);
            }
            return renderItem(item as DropdownItemProps, index);
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
