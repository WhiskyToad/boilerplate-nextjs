import React from "react";
import { FiEdit, FiList, FiSend } from "react-icons/fi";

interface HowItWorksProps {
  title?: string;
  steps?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const HowItWorks: React.FC<HowItWorksProps> = ({
  title = "How It Works",
  steps: propSteps,
}) => {
  const defaultSteps = [
    {
      icon: <FiEdit className="text-4xl text-primary" />,
      title: "1. First Step",
      description:
        "Describe the first step of your process. Explain what users need to do to get started with your product.",
    },
    {
      icon: <FiList className="text-4xl text-primary" />,
      title: "2. Second Step",
      description:
        "Describe the second step of your process. Explain how users can get the most out of your product features.",
    },
    {
      icon: <FiSend className="text-4xl text-primary" />,
      title: "3. Final Step",
      description:
        "Describe the final step of your process. Explain how users can achieve their goals with your product.",
    },
  ];

  const steps = propSteps || defaultSteps;

  return (
    <section
      id="how-it-works"
      className="py-16 bg-gradient-to-b from-base-200 to-base-100"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="border-b-4 border-primary pb-2">{title}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-base-100 rounded-lg shadow-md border border-base-300"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-base-content/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
