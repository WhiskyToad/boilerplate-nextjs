import React from "react";

interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="mx-auto max-w-3xl p-8 space-y-8 bg-base-200 shadow-md rounded-lg w-full">
      {(title || description) && (
        <header className="text-center space-y-2 --font-mono">
          {title && <h2 className="text-4xl font-extra bold ">{title}</h2>}
          {description && <p className="">{description}</p>}
        </header>
      )}
      {children}
    </div>
  );
};

export default ContentCard;
