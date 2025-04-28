import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQProps {
  title?: string;
  faqs?: FAQItem[];
  defaultOpenIndex?: number;
}

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({
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

const FAQ: React.FC<FAQProps> = ({
  title = "Frequently Asked Questions",
  faqs: propFaqs,
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

  const defaultFaqs = [
    {
      question: "What services do you offer?",
      answer: (
        <p>
          We offer a comprehensive suite of services designed to meet your
          needs. Our core offerings include [Service 1], [Service 2], and
          [Service 3], all designed to help you achieve your goals efficiently.
        </p>
      ),
    },
    {
      question: "How much does it cost?",
      answer: (
        <p>
          We offer flexible pricing plans to meet different needs and budgets.
          Our plans start at $X per month, with options to upgrade as your needs
          grow. Check our pricing page for detailed information on each plan's
          features.
        </p>
      ),
    },
    {
      question: "Do you offer a free trial?",
      answer: (
        <p>
          Yes! We offer a X-day free trial with no credit card required. This
          gives you full access to explore our platform and see how it can
          benefit your workflow before making a commitment.
        </p>
      ),
    },
    {
      question: "How secure is your platform?",
      answer: (
        <p>
          Security is our top priority. We implement industry-standard security
          measures including encryption, secure data storage, and regular
          security audits. All user data is protected according to best
          practices and compliance requirements.
        </p>
      ),
    },
    {
      question: "What kind of support do you offer?",
      answer: (
        <p>
          We provide comprehensive support through various channels including
          email, live chat, and knowledge base articles. Premium plans include
          priority support with faster response times and dedicated support
          specialists.
        </p>
      ),
    },
    {
      question: "Can I cancel my subscription?",
      answer: (
        <p>
          Yes, you can cancel your subscription at any time. There are no
          long-term contracts or cancellation fees. Your subscription will
          remain active until the end of your current billing period.
        </p>
      ),
    },
  ];

  const faqs = propFaqs || defaultFaqs;

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="bg-base-100 rounded-lg shadow-lg border border-base-200">
          {faqs.map((faq, index) => (
            <FAQItemComponent
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
