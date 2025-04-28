import React from "react";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

type FeatureStatus = boolean | "partial" | string;

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  yourProductName?: string;
  competitors?: string[];
  features?: Array<{
    name: string;
    description?: string;
    yourProduct: FeatureStatus;
    competitorValues: FeatureStatus[];
    category?: string;
  }>;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title = "Product Comparison",
  subtitle = "See how we stack up against the competition",
  yourProductName = "Our Solution",
  competitors: propCompetitors = ["Competitor A", "Competitor B"],
  features: propFeatures,
}) => {
  const defaultFeatures = [
    {
      name: "Core Feature 1",
      description: "Description of this feature and why it matters",
      yourProduct: true,
      competitorValues: [true, false],
      category: "Essential Features",
    },
    {
      name: "Core Feature 2",
      yourProduct: true,
      competitorValues: ["Limited", false],
      category: "Essential Features",
    },
    {
      name: "Advanced Feature 1",
      description: "Important capability that sets products apart",
      yourProduct: true,
      competitorValues: [false, "Partial"],
      category: "Advanced Capabilities",
    },
    {
      name: "Advanced Feature 2",
      yourProduct: true,
      competitorValues: [false, false],
      category: "Advanced Capabilities",
    },
    {
      name: "Premium Feature",
      description: "Enterprise-grade functionality",
      yourProduct: true,
      competitorValues: ["Premium tier only", "Premium tier only"],
      category: "Premium Features",
    },
  ];

  const features = propFeatures || defaultFeatures;
  const competitors = propCompetitors || ["Competitor A", "Competitor B"];

  const currentCategories = Array.from(
    new Set(features.map((feature) => feature.category || ""))
  );

  const renderFeatureValue = (value: FeatureStatus, index: number) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className="flex justify-center">
          <FiCheck className="text-success" size={24} />
        </div>
      ) : (
        <div className="flex justify-center">
          <FiX className="text-error" size={24} />
        </div>
      );
    }

    if (value === "partial") {
      return (
        <div className="text-center text-warning">
          <span>Partial</span>
        </div>
      );
    }

    return <div className="text-center text-xs">{value}</div>;
  };

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg max-w-2xl mx-auto text-base-content/70">
            {subtitle}
          </p>
        </div>

        <div className="overflow-x-auto max-w-6xl mx-auto">
          <table className="table w-full comparison-table">
            <thead>
              <tr className="bg-base-200">
                <th className="w-1/4">Features</th>
                <th className="text-center bg-primary text-primary-content">
                  {yourProductName}
                </th>
                {competitors.map((competitor, index) => (
                  <th key={index} className="text-center">
                    {competitor}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category, catIndex) => (
                <React.Fragment key={`category-${catIndex}`}>
                  {category && (
                    <tr className="bg-base-200/50">
                      <td
                        colSpan={2 + competitors.length}
                        className="font-semibold"
                      >
                        {category}
                      </td>
                    </tr>
                  )}
                  {features
                    .filter((feature) => feature.category === category)
                    .map((feature, index) => (
                      <tr
                        key={`${category}-${index}`}
                        className="hover:bg-base-200/30"
                      >
                        <td className="align-middle">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            {feature.description && (
                              <>
                                <FiInfo
                                  className="text-base-content/50 cursor-help"
                                  data-tooltip-id={`feature-tip-${catIndex}-${index}`}
                                  size={14}
                                />
                                <Tooltip
                                  id={`feature-tip-${catIndex}-${index}`}
                                  content={feature.description}
                                  place="top"
                                />
                              </>
                            )}
                          </div>
                        </td>
                        <td className="bg-primary/5">
                          {renderFeatureValue(feature.yourProduct, index)}
                        </td>
                        {feature.competitorValues.map((value, compIndex) => (
                          <td key={compIndex}>
                            {renderFeatureValue(value, compIndex)}
                          </td>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
