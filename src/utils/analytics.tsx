import { PostHog } from "posthog-node";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

// Server-side PostHog client
let posthogClient: PostHog | null = null;

// Server-side PostHog client initialization
export const getPostHogClient = () => {
  // Only initialize on server side
  if (typeof window !== "undefined") return null;

  try {
    if (!posthogClient && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: "https://eu.i.posthog.com",
        flushAt: 1, // Flush immediately for server-side reliability
        flushInterval: 0,
      });
    }
    return posthogClient;
  } catch (error) {
    console.error("Failed to initialize PostHog server client:", error);
    return null;
  }
};

// Initialize client-side PostHog (should be called once in your app)
export const initClientPostHog = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    try {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "https://eu.i.posthog.com",
        capture_pageview: true,
        capture_pageleave: true,
        disable_session_recording: false,
      });
    } catch (error) {
      console.error("Failed to initialize PostHog client:", error);
    }
  }
};

// Client-side analytics wrapper for consistent event tracking
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  try {
    // For client-side tracking
    if (typeof window !== "undefined") {
      posthog.capture(eventName, properties);
      return;
    }

    // For server-side tracking
    const serverClient = getPostHogClient();
    if (serverClient) {
      serverClient.capture({
        distinctId: properties?.distinctId || "unknown_server_user",
        event: eventName,
        properties,
      });

      // Ensure events are flushed on server
      serverClient.flush();
    }
  } catch (error) {
    console.error(`Failed to track event "${eventName}":`, error);
  }
};

// For identifying users consistently between client and server
export const identifyUser = (
  userId: string,
  userProperties?: Record<string, any>
) => {
  try {
    // Client-side identification
    if (typeof window !== "undefined") {
      posthog.identify(userId, userProperties);
      return;
    }

    // Server-side identification
    const serverClient = getPostHogClient();
    if (serverClient && userId) {
      serverClient.identify({
        distinctId: userId,
        properties: userProperties,
      });
    }
  } catch (error) {
    console.error("Failed to identify user:", error);
  }
};

// Consistent analytics provider for client components
export const AnalyticsProvider = ({ children }: { children: any }) => {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    //@ts-expect-error - post hog  has it as never
    <PostHogProvider
      client={posthog}
      apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ""}
      options={{
        api_host: "https://eu.i.posthog.com",
      }}
    >
      {children}
    </PostHogProvider>
  );
};
