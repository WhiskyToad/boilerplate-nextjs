import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  className = "",
  titleClassName = "",
  contentClassName = "",
}) => {
  return (
    <div className={`border-b border-base-200 ${className}`}>
      <button
        className={`flex justify-between w-full px-4 py-3 text-left focus:outline-none ${titleClassName}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="font-medium">{title}</div>
        <div className="ml-4">
          {isOpen ? (
            <FiChevronUp className="h-5 w-5" />
          ) : (
            <FiChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className={`px-4 pb-4 ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
};

interface AccordionProps {
  items: {
    id: string | number;
    title: React.ReactNode;
    content: React.ReactNode;
  }[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = -1,
  allowMultiple = false,
  className = "",
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpenIndex >= 0 ? [defaultOpenIndex] : []
  );

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`rounded-lg border border-base-200 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          isOpen={openIndexes.includes(index)}
          onToggle={() => handleToggle(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
