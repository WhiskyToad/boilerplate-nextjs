import React from "react";
import { FiZap, FiTool } from "react-icons/fi"; // Example icons
import { BsKanban } from "react-icons/bs"; // Import a Kanban-related icon

interface ValuePropositionProps {
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const ValueProposition: React.FC<ValuePropositionProps> = ({
  features: propFeatures,
}) => {
  const defaultFeatures = [
    {
      icon: <FiZap className="w-10 h-10 text-primary" />,
      title: "Feature One",
      description: "Describe your first key feature or value proposition here.",
    },
    {
      icon: <FiTool className="w-10 h-10 text-primary" />,
      title: "Feature Two",
      description:
        "Describe your second key feature or value proposition here.",
    },
    {
      icon: <BsKanban className="w-10 h-10 text-primary" />,
      title: "Feature Three",
      description: "Describe your third key feature or value proposition here.",
    },
  ];

  const features = propFeatures || defaultFeatures;

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-base-100 rounded-lg shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-base-content/70 mb-4">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
