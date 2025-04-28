import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

interface StatsProps {
  title?: string;
  subtitle?: string;
  stats?: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
    duration?: number;
    decimals?: number;
  }>;
  bgVariant?: "default" | "primary" | "secondary" | "neutral";
}

const Stats: React.FC<StatsProps> = ({
  title = "Our Impact by the Numbers",
  subtitle = "Real metrics showcasing our success and growth",
  stats: propStats,
  bgVariant = "default",
}) => {
  const defaultStats = [
    {
      value: 50000,
      suffix: "+",
      label: "Users",
      description: "Trusted by professionals worldwide",
      duration: 2.5,
      decimals: 0,
    },
    {
      value: 99.9,
      suffix: "%",
      label: "Uptime",
      description: "Reliable service you can count on",
      duration: 2.5,
      decimals: 1,
    },
    {
      value: 3,
      suffix: "M+",
      label: "Tasks Completed",
      description: "Helping teams achieve their goals",
      duration: 2.5,
      decimals: 0,
    },
    {
      value: 4.9,
      prefix: "",
      label: "Customer Rating",
      description: "From thousands of reviews",
      duration: 2.5,
      decimals: 1,
    },
  ];

  const stats = propStats || defaultStats;

  const getBgClasses = () => {
    switch (bgVariant) {
      case "primary":
        return "bg-primary text-primary-content";
      case "secondary":
        return "bg-secondary text-secondary-content";
      case "neutral":
        return "bg-neutral text-neutral-content";
      default:
        return "bg-base-100";
    }
  };

  return (
    <section className={`py-16 ${getBgClasses()}`}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
            {subtitle && (
              <p className="text-lg max-w-2xl mx-auto opacity-80">{subtitle}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2 flex items-center">
                {stat.prefix && <span>{stat.prefix}</span>}
                <CountUp
                  end={stat.value}
                  duration={stat.duration || 2.5}
                  decimals={stat.decimals || 0}
                  separator=","
                />
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <h3 className="text-xl font-semibold mb-1">{stat.label}</h3>
              {stat.description && (
                <p className="opacity-80 text-sm">{stat.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
