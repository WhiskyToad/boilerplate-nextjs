import type { ReactElement } from "react";
import Head from "next/head";
import Hero from "@/components/LandingPage/Hero";
import ValueProposition from "@/components/LandingPage/ValueProposition";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import ProductScreenshots from "@/components/LandingPage/ProductScreenshots";
import PricingTeaser from "@/components/LandingPage/PricingTeaser";
import TrustSafety from "@/components/LandingPage/TrustSafety";
import FAQ from "@/components/LandingPage/FAQ";
import FinalCTA from "@/components/LandingPage/FinalCTA";
import getSiteConfig from "@/utils/siteConfig";

const Page = () => {
  const config = getSiteConfig();
  const siteUrl = config.get("site.domain");
  const pageTitle = `${config.get("site.title")} - ${config.get(
    "site.tagline"
  )}`;
  const pageDescription = config.get("site.description");
  const imageUrl = `${siteUrl}${config.get("site.socialImages.ogImage")}`;
  const keywords = config.get("site.keywords");

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
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

        {/* Favicon links - uncomment and update paths as needed */}
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
