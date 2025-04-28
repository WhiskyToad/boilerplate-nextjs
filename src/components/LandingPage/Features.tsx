import React from "react";
import {
  FaSearchDollar,
  FaLightbulb,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";

interface FeaturesProps {
  title?: string;
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const Features: React.FC<FeaturesProps> = ({
  title = "Powerful Features",
  features: propFeatures,
}) => {
  const defaultFeatures = [
    {
      icon: <FaSearchDollar className="w-8 h-8 text-primary" />,
      title: "Feature One",
      description:
        "Describe your first feature in detail. Explain the benefits and how it helps solve your customers' problems.",
    },
    {
      icon: <FaLightbulb className="w-8 h-8 text-primary" />,
      title: "Feature Two",
      description:
        "Describe your second feature in detail. Explain the benefits and how it helps solve your customers' problems.",
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-primary" />,
      title: "Feature Three",
      description:
        "Describe your third feature in detail. Explain the benefits and how it helps solve your customers' problems.",
    },
    {
      icon: <FaRocket className="w-8 h-8 text-primary" />,
      title: "Feature Four",
      description:
        "Describe your fourth feature in detail. Explain the benefits and how it helps solve your customers' problems.",
    },
  ];

  const features = propFeatures || defaultFeatures;

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="border-b-4 border-primary pb-2">{title}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="card-title mb-2">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
