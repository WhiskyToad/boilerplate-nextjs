import React from "react";
import Image from "next/image";
import Link from "next/link";

export type CardVariant = "default" | "compact" | "glass" | "bordered" | "side";
export type CardSize = "xs" | "sm" | "md" | "lg";

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imagePlacement?: "top" | "bottom" | "side";
  actions?: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  bodyClassName?: string;
  imageClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
  onClick?: () => void;
  href?: string;
  badge?: React.ReactNode;
  shadow?: boolean;
  hoverEffect?: boolean;
  imageHeight?: number;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  image,
  imageAlt = "Card image",
  imagePlacement = "top",
  actions,
  variant = "default",
  size = "md",
  className = "",
  bodyClassName = "",
  imageClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  actionsClassName = "",
  onClick,
  href,
  badge,
  shadow = true,
  hoverEffect = false,
  imageHeight,
}) => {
  // Variant classes
  const variantClass = React.useMemo(() => {
    switch (variant) {
      case "compact":
        return "card-compact";
      case "glass":
        return "card glass";
      case "bordered":
        return "card-bordered";
      case "side":
        return "card-side";
      default:
        return "card-normal";
    }
  }, [variant]);

  // Size classes
  const sizeClass = React.useMemo(() => {
    switch (size) {
      case "xs":
        return "p-2 gap-1";
      case "sm":
        return "p-3 gap-2";
      case "lg":
        return "p-6 gap-4";
      default:
        return "p-4 gap-3";
    }
  }, [size]);

  // Shadow and hover classes
  const shadowClass = shadow ? "shadow-md" : "";
  const hoverClass = hoverEffect
    ? "transition-all hover:shadow-lg hover:-translate-y-1"
    : "";

  // Determine image aspect ratio class based on placement
  const imageAspectClass = React.useMemo(() => {
    if (imagePlacement === "side") return "h-full w-auto object-cover";
    return "w-full object-cover";
  }, [imagePlacement]);

  // Calculate image height based on placement and size
  const getImageHeight = () => {
    if (imageHeight) return imageHeight;

    if (imagePlacement === "side") {
      return 0; // Let it fill the container
    }

    switch (size) {
      case "xs":
        return 120;
      case "sm":
        return 160;
      case "lg":
        return 240;
      default:
        return 200;
    }
  };

  // Create the card content
  const cardContent = (
    <>
      {/* Card image */}
      {image && imagePlacement !== "bottom" && (
        <figure className={imageClassName}>
          <Image
            src={image}
            alt={imageAlt}
            width={500}
            height={getImageHeight()}
            className={imageAspectClass}
          />
        </figure>
      )}

      {/* Badge if provided */}
      {badge && <div className="absolute top-3 right-3 z-10">{badge}</div>}

      {/* Card body */}
      <div className={`card-body ${sizeClass} ${bodyClassName}`}>
        {/* Title and subtitle */}
        {(title || subtitle) && (
          <div className="card-title-group mb-2">
            {title && (
              <h3 className={`card-title ${titleClassName}`}>{title}</h3>
            )}
            {subtitle && (
              <div
                className={`card-subtitle text-sm opacity-70 ${subtitleClassName}`}
              >
                {subtitle}
              </div>
            )}
          </div>
        )}

        {/* Card content */}
        {children}

        {/* Card actions */}
        {actions && (
          <div className={`card-actions mt-auto ${actionsClassName}`}>
            {actions}
          </div>
        )}
      </div>

      {/* Image at bottom if specified */}
      {image && imagePlacement === "bottom" && (
        <figure className={imageClassName}>
          <Image
            src={image}
            alt={imageAlt}
            width={500}
            height={getImageHeight()}
            className={imageAspectClass}
          />
        </figure>
      )}
    </>
  );

  // Wrap with appropriate element based on props
  const cardClasses = `card ${variantClass} ${shadowClass} ${hoverClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div
        className={`${cardClasses} cursor-pointer`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        {cardContent}
      </div>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
};

export default Card;
