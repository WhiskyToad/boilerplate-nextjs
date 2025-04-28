import React from "react";
import { FiLock, FiShield } from "react-icons/fi";

interface TrustSafetyProps {
  items?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const TrustSafety: React.FC<TrustSafetyProps> = ({ items: propItems }) => {
  const defaultItems = [
    {
      icon: <FiLock className="w-8 h-8 text-primary flex-shrink-0" />,
      title: "Your Data is Private",
      description:
        "We never share your data or personal information with third parties. GDPR-compliant.",
    },
    {
      icon: <FiShield className="w-8 h-8 text-primary flex-shrink-0" />,
      title: "Secure Infrastructure",
      description:
        "Built on secure infrastructure with SSL encryption. Your security is our priority.",
    },
  ];

  const items = propItems || defaultItems;

  return (
    <section className="py-12 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-center md:text-left">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-4 p-4"
            >
              {item.icon}
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-base-content/70">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
