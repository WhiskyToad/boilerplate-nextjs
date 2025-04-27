import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border-b border-base-300 last:border-b-0">
      <button
        className="flex justify-between items-center w-full p-4 text-left font-medium text-lg focus:outline-none"
        onClick={onClick}
      >
        {question}
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <FiMinus className="h-5 w-5 text-primary" />
          ) : (
            <FiPlus className="h-5 w-5 text-primary" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 prose max-w-none text-base-content/80">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      question: "Do I need to be technical to use Boost Toad?",
      answer: (
        <p>
          Absolutely not! Boost Toad is designed for founders, product managers,
          and entrepreneurs, regardless of coding ability. Our AI handles the
          technical suggestions, presenting them in clear, actionable steps. You
          focus on the strategy, we help with the structure.
        </p>
      ),
    },
    {
      question: "How is this different from standard project management tools?",
      answer: (
        <p>
          While tools like Jira or Trello help manage tasks, Boost Toad helps
          you *define* the right tasks in the first place. We start with your
          core idea and use AI to generate the strategic blueprint (Lean Canvas,
          features, roadmap) *before* you get to task management, ensuring you
          build what matters.
        </p>
      ),
    },
    {
      question: "What if I already have an MVP or existing product?",
      answer: (
        <p>
          Boost Toad is still valuable! You can use our platform to refine your
          existing strategy, plan your next feature releases using the
          prioritization matrix, or utilize the Launch Pack resources
          (checklists, templates) to optimize your go-to-market approach and
          monetization.
        </p>
      ),
    },
    {
      question: "Is my startup idea safe and confidential?",
      answer: (
        <p>
          Yes. Your data privacy is paramount. We do not share your project
          details or personal information with third parties. Our infrastructure
          is secure, and we are committed to GDPR compliance. Think of us as
          your confidential AI co-founder.
        </p>
      ),
    },
    {
      question: "What kind of 'Launch Pack' resources are included?",
      answer: (
        <p>
          Our Launch Pack includes step-by-step checklists for pre-launch,
          launch day, and post-launch activities. It also provides access to
          curated templates for things like pitch decks, press releases, and
          essential legal boilerplate documents (e.g., Privacy Policy, Terms of
          Service starting points).
        </p>
      ),
    },
    {
      question: "Can I export my blueprint and roadmap?",
      answer: (
        <p>
          Yes, you can export key elements like your Lean Canvas and feature
          list. We are continuously working on adding more export options for
          seamless integration with other tools or for sharing with
          stakeholders.
        </p>
      ),
    },
  ];

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="bg-base-100 rounded-lg shadow-lg border border-base-200">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
