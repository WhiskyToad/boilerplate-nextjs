import {
  FaSearchDollar,
  FaLightbulb,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";

const Features: React.FC = () => {
  const features = [
    {
      icon: <FaSearchDollar className="w-8 h-8 text-primary" />,
      title: "AI-Powered Idea Validation",
      description:
        "Score and analyze your business ideas with AI-driven validation tools. Assess market demand, competition, technical feasibility, and virality potential before investing time and resources.",
    },
    {
      icon: <FaLightbulb className="w-8 h-8 text-primary" />,
      title: "Roadmap & Execution Planning",
      description:
        "Turn ideas into actionable plans. Use interactive roadmaps, milestone tracking, and AI-powered suggestions to build a structured path from concept to launch.",
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-primary" />,
      title: "Automated Marketing Strategy",
      description:
        "Generate tailored marketing plans with AI. Get content suggestions, social media strategies, and audience targeting insights to build traction efficiently.",
    },
    {
      icon: <FaRocket className="w-8 h-8 text-primary" />,
      title: "Business Growth Toolkit",
      description:
        "Access essential tools for launching and scaling. From initial idea to earning your first $$.",
    },
  ];

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="border-b-4 border-primary pb-2">
            Powerful Features
          </span>
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
