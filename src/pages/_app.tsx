import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Providers from "@/utils/Providers";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useAuth } from "@/features/auth/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { getFontClassNames } from "@/config/fonts";
import ConfigLoader from "@/components/ConfigLoader";
import getSiteConfig from "@/utils/siteConfig";
import { ToastProvider } from "@/components/Feedback/Toast";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useAuth();
  const router = useRouter();

  // Get site configuration
  const config = getSiteConfig();
  const siteTitle = config.get("site.title", "{SITE_TITLE}");
  const siteDescription = config.get(
    "site.description",
    "{YOUR_SITE_DESCRIPTION}"
  );
  const siteKeywords = config.get(
    "site.keywords",
    "{COMMA_SEPARATED_KEYWORDS}"
  );
  const companyName = config.get("site.companyName", "{YOUR_COMPANY_NAME}");
  const domain = config.get("site.domain", "{YOUR_DOMAIN}");

  // Analytics config
  const ENABLE_ANALYTICS = config.get("analytics.enabled", false);
  const posthogUiHost = config.get(
    "analytics.posthog.uiHost",
    "https://app.posthog.com"
  );
  const posthogCapturePageleave = config.get(
    "analytics.posthog.capturePageleave",
    true
  );

  // Check if PostHog is available
  const isPostHogAvailable =
    ENABLE_ANALYTICS &&
    typeof window !== "undefined" &&
    process.env.NODE_ENV !== "development" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY;

  useEffect(() => {
    // Initialize PostHog only if enabled and available
    if (isPostHogAvailable) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
        ui_host: posthogUiHost,
        capture_pageview: false,
        capture_pageleave: posthogCapturePageleave,
      });
    }

    // Track page views manually only if PostHog is available
    const handleRouteChange = () => {
      if (isPostHogAvailable) {
        posthog.capture("$pageview");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [
    router.events,
    posthogUiHost,
    posthogCapturePageleave,
    isPostHogAvailable,
  ]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  // Build the head content
  const headContent = (
    <Head>
      <title>{`${siteTitle}: ${siteDescription}`}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={companyName} />

      {/* Add favicon and app icons - uncomment and update as needed */}
      {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
      {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
      {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
      {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
      {/* <link rel="manifest" href="/site.webmanifest" /> */}
      <meta name="theme-color" content="#ffffff" />

      {/* Open Graph tags for social sharing */}
      <meta property="og:title" content={`${siteTitle}: ${siteDescription}`} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={domain} />
      <meta
        property="og:image"
        content={`${domain}${config.get(
          "site.socialImages.ogImage",
          "/og-image.png"
        )}`}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta
        name="twitter:image"
        content={`${domain}${config.get(
          "site.socialImages.twitterCard",
          "/twitter-card.png"
        )}`}
      />
    </Head>
  );

  // Create properly structured app content with providers
  return (
    <ConfigLoader>
      {/* First layer - Analytics provider (optional) */}
      {isPostHogAvailable ? (
        <PostHogProvider client={posthog}>
          {/* Second layer - Toast provider (always available) */}
          <ToastProvider position="bottom-center" autoCloseTime={5000}>
            {/* Third layer - App providers */}
            <Providers>
              {headContent}
              <div className={getFontClassNames()}>
                <Header logo={<></>} />
                <main className="min-w-full min-h-screen px-2">
                  {getLayout(<Component {...pageProps} />)}
                </main>
                <Footer />
              </div>
            </Providers>
          </ToastProvider>
        </PostHogProvider>
      ) : (
        <ToastProvider position="bottom-center" autoCloseTime={5000}>
          <Providers>
            {headContent}
            <div className={getFontClassNames()}>
              <Header logo={<></>} />
              <main className="min-w-full min-h-screen px-2">
                {getLayout(<Component {...pageProps} />)}
              </main>
              <Footer />
            </div>
          </Providers>
        </ToastProvider>
      )}
    </ConfigLoader>
  );
}
