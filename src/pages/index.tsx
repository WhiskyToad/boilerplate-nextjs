import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import Hero from "@/components/LandingPage/Hero";
import ValueProposition from "@/components/LandingPage/ValueProposition";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import ProductScreenshots from "@/components/LandingPage/ProductScreenshots";
import PricingTeaser from "@/components/LandingPage/PricingTeaser";
import TrustSafety from "@/components/LandingPage/TrustSafety";
import FAQ from "@/components/LandingPage/FAQ";
import FinalCTA from "@/components/LandingPage/FinalCTA";

const Page: NextPageWithLayout = () => {
  const siteUrl = "https://boosttoad.com"; // Replace with your actual domain
  const pageTitle =
    "Boost Toad - Launch Your Startup Faster with AI-Driven Plans"; // Updated Title
  const pageDescription =
    "Cut ideation time by 80% and build with confidence. Get your AI-generated MVP blueprint in 60 seconds. No credit card required."; // Updated Description
  const imageUrl = `${siteUrl}/images/og_image_v2.jpg`; // Consider updating OG image

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="AI startup coach, MVP blueprint generator, Lean Canvas AI, feature prioritization tool, startup launch checklist, product roadmap AI, idea validation tool"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={imageUrl} />

        {/* Favicon links remain the same */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"> */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"> */}
        {/* <link rel="manifest" href="/site.webmanifest"> */}
      </Head>
      <Hero />
      <ValueProposition />
      <div id="screenshots">
        <ProductScreenshots />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="pricing">
        <PricingTeaser />
      </div>
      <TrustSafety />
      <FAQ />
      <FinalCTA />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Page;
