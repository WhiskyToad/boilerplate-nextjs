import React from "react";
import { FiZap, FiTool } from "react-icons/fi"; // Example icons
import { BsKanban } from "react-icons/bs"; // Import a Kanban-related icon

const ValueProposition: React.FC = () => {
  const features = [
    {
      icon: <FiZap className="w-10 h-10 text-primary" />,
      title: "AI-Powered Blueprints",
      description:
        "Use Lean Canvas to generate your MVP business plan in 60 seconds.",
    },
    {
      icon: <FiTool className="w-10 h-10 text-primary" />,
      title: "MVP Feature Planner",
      description:
        "Quickly define user stories and prioritize features using complexity scoring for your MVP.",
    },
    {
      icon: <BsKanban className="w-10 h-10 text-primary" />, // Changed icon
      title: "Kanban Board",
      description:
        "Use our Kanban board to track your progress, and do the right things at the right time.",
    },
  ];

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
