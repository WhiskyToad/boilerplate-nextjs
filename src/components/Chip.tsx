type ChipVariant = "outline" | "filled" | "success" | "warning" | "error";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({
  children,
  variant = "outline",
  onDelete,
  onClick,
  className = "",
}) => {
  const getVariantClasses = (variant: ChipVariant): string => {
    switch (variant) {
      case "filled":
        return "badge-primary text-white";
      case "success":
        return "badge-success text-white";
      case "warning":
        return "badge-warning text-white";
      case "error":
        return "badge-error text-white";
      default:
        return "badge-outline";
    }
  };

  return (
    <div
      className={`badge truncate ${getVariantClasses(variant)} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-2 hover:opacity-70 cursor-pointer"
          aria-label="remove"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Chip;
