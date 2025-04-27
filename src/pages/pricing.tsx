import React from "react";
import Pricing from "../components/LandingPage/Pricing";
import Head from "next/head";

const PricingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pricing | Boost Toad</title>
        <meta
          name="description"
          content="Transparent pricing plans for all your product development needs"
        />
      </Head>

      <main className="min-h-screen bg-base-200">
        <div className="pt-10">
          <h1 className="text-4xl font-bold text-center mb-6">Pricing Plans</h1>
          <p className="text-center text-base-content/70 max-w-2xl mx-auto mb-12">
            Choose the perfect plan for your product development needs. Start
            for free or unlock all features with our paid plans.
          </p>
        </div>

        <Pricing />
      </main>
    </>
  );
};

export default PricingPage;
