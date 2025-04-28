import React from "react";
import Image from "next/image";

interface SingleFeatureProps {
  title: string;
  description: string | React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  reverse?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "gray";
  onCtaClick?: () => void;
  imageAlt?: string;
}

const SingleFeature: React.FC<SingleFeatureProps> = ({
  title,
  description,
  ctaText,
  ctaLink,
  imageUrl,
  imageAlt,
  reverse = false,
  variant = "tertiary",
  onCtaClick,
}) => {
  const getButtonClassNames = React.useMemo(() => {
    return (
      variant: "primary" | "secondary" | "tertiary" | "gray" = "primary"
    ) => {
      const baseClass = "btn btn-xl btn-outline";
      switch (variant) {
        case "primary":
        case "gray":
          return `${baseClass} btn-secondary`;
        case "secondary":
          return `${baseClass} btn-primary`;
        case "tertiary":
          return `${baseClass} btn-secondary`;
        default:
          return baseClass;
      }
    };
  }, []);

  const getContainerClassNames = React.useMemo(() => {
    return () =>
      `flex flex-col md:flex-row items-center gap-8 p-6 ${
        reverse ? "md:flex-row-reverse" : ""
      } ${
        variant === "primary"
          ? "bg-primary"
          : variant === "secondary"
          ? "bg-secondary"
          : variant === "tertiary"
          ? "bg-tertiary"
          : "bg-gray-100"
      } ${reverse ? "fade-in-reverse" : "fade-in"}`;
  }, [reverse, variant]);

  const textColorClass =
    variant === "gray" ? "text-black" : "text-base-content";

  return (
    <div className={getContainerClassNames()}>
      <div className="flex-1 md:w-1/2 text-center">
        <h2 className={`text-3xl font-bold mb-4 ${textColorClass}`}>{title}</h2>
        <p className={`mb-6 ${textColorClass}`}>{description}</p>
        {ctaText && ctaLink && (
          <a href={ctaLink}>
            <button
              className={getButtonClassNames(variant)}
              onClick={onCtaClick}
            >
              {ctaText}
            </button>
          </a>
        )}
      </div>
      <div className="flex-1 md:w-1/2">
        <div className="mockup-window border border-base-300 w-full">
          <div className="flex justify-center bg-base-200">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              layout="responsive"
              width={460}
              height={475}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleFeature;
