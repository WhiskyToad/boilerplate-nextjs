import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Providers from "@/utils/Providers";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useAuth } from "@/features/auth/useAuth";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { getFontClassNames } from "@/config/fonts";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Check if PostHog is available (client-side and not in development)
const isPostHogAvailable =
  typeof window !== "undefined" && process.env.NODE_ENV !== "development";

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useAuth();
  const router = useRouter();

  useEffect(() => {
    // Initialize PostHog only if available
    if (isPostHogAvailable) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
        ui_host: "https://eu.posthog.com",
        capture_pageview: false, // Disable automatic pageview capture
        capture_pageleave: true,
      });
    } else if (process.env.NODE_ENV === "development") {
      console.log("PostHog disabled in development mode.");
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
  }, [router.events]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const AppContent = (
    <Providers>
      <Head>
        <title>
          Boost Toad: AI-Powered Product Development Blueprint & Roadmap Tool
        </title>
        <meta
          name="description"
          content="Transform ideas into products with Boost Toad's AI blueprint generator, feature prioritization matrix, interactive roadmap planner, and task management system. Build MVPs faster with data-driven guidance."
        />
        <meta
          name="keywords"
          content="product development, AI blueprint generator, MVP planning, feature prioritization, startup roadmap, product management tool, agile development, task tracking, project validation, lean canvas, product strategy"
        />
        <meta name="author" content="Boost Toad" />

        {/* Add favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />

        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Boost Toad: AI-Powered Product Development Blueprint & Roadmap Tool"
        />
        <meta
          property="og:description"
          content="Transform ideas into products with AI-generated blueprints, feature prioritization, and interactive roadmaps. Build MVPs faster with data-driven guidance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://boosttoad.com" />
        <meta
          property="og:image"
          content="https://boosttoad.com/og-image.png"
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Boost Toad: AI-Powered Product Development Tool"
        />
        <meta
          name="twitter:description"
          content="Transform ideas into products with AI blueprints, feature prioritization, and interactive roadmaps."
        />
        <meta
          name="twitter:image"
          content="https://boosttoad.com/twitter-card.png"
        />
      </Head>
      <div className={getFontClassNames()}>
        <Header logo={<></>} />
        <main className="min-w-full min-h-screen px-2">
          {getLayout(<Component {...pageProps} />)}
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Global toast options
              duration: 5000,
              style: {
                borderRadius: "0.5rem",
                padding: "1rem",
                maxWidth: "500px",
              },
              // Custom styles for different toast types
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
            }}
          />
        </main>
        <Footer />
      </div>
    </Providers>
  );

  // Conditionally wrap with PostHogProvider
  if (isPostHogAvailable) {
    return <PostHogProvider client={posthog}>{AppContent}</PostHogProvider>;
  }

  // Render without PostHogProvider if not available (e.g., in development)
  return AppContent;
}
