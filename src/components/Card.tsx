import { ReactNode } from "react";

type CardVariant = "default" | "metric" | "list";

interface CardProps {
  title: string;
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
}

const Card = ({
  title,
  children,
  variant = "default",
  className = "",
}: CardProps) => {
  const renderContent = () => {
    switch (variant) {
      case "metric":
        return (
          <div className="text-2xl font-bold text-primary">{children}</div>
        );
      case "list":
        return (
          <ul className="list-disc pl-4 text-base">
            {Array.isArray(children) &&
              children.map((item, index) => (
                <li key={index} className="break-words">
                  {item}
                </li>
              ))}
          </ul>
        );
      default:
        return <div className="text-base break-words">{children}</div>;
    }
  };

  return (
    <div className={`card bg-base-200 ${className}`}>
      <div className="card-body p-4">
        <h4 className="card-title text-sm">{title}</h4>
        {renderContent()}
      </div>
    </div>
  );
};

export default Card;
