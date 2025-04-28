import React from "react";
import Pricing from "../components/LandingPage/Pricing";
import Head from "next/head";
import getSiteConfig from "@/utils/siteConfig";

const PricingPage: React.FC = () => {
  const config = getSiteConfig();
  const siteTitle = config.get("site.title", "{SITE_TITLE}");
  const pricingTitle = config.get("landing.pricing.title", "Pricing Plans");
  const pricingSubtitle = config.get(
    "landing.pricing.subtitle",
    "Choose the perfect plan for your needs"
  );

  return (
    <>
      <Head>
        <title>Pricing | {siteTitle}</title>
        <meta
          name="description"
          content="Transparent pricing plans for all your needs"
        />
      </Head>

      <main className="min-h-screen bg-base-200">
        <div className="pt-10">
          <h1 className="text-4xl font-bold text-center mb-6">
            {pricingTitle}
          </h1>
          <p className="text-center text-base-content/70 max-w-2xl mx-auto mb-12">
            {pricingSubtitle}
          </p>
        </div>

        <Pricing />
      </main>
    </>
  );
};

export default PricingPage;
