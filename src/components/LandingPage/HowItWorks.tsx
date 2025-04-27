import React from "react";
import { FiEdit, FiList, FiSend } from "react-icons/fi";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FiEdit className="text-4xl text-primary" />,
      title: "1. Capture Your Idea",
      description:
        "Fill out a short form about your startup concept. Our AI instantly generates a tailored blueprint preview, including Lean Canvas and potential features.",
    },
    {
      icon: <FiList className="text-4xl text-primary" />,
      title: "2. Plan Your MVP",
      description:
        "Review AI-suggested features, prioritize using our value vs. complexity matrix, and select the core elements for your Minimum Viable Product. See effort estimates update in real-time.",
    },
    {
      icon: <FiSend className="text-4xl text-primary" />,
      title: "3. Launch with Confidence",
      description:
        "Utilize our step-by-step launch checklists, access helpful templates (like pitch decks), and follow guided marketing steps to get your product to market.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 bg-gradient-to-b from-base-200 to-base-100"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="border-b-4 border-primary pb-2">
            How Boost Toad Works (in 3 Steps)
          </span>
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
