"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient } from "@/features/utils/queryClient"; // Import the singleton queryClient
import { useToast } from "@/components/Feedback/Toast";

// Import the proper Toast type from your Toast component
import type { ToastType } from "@/components/Feedback/Toast";

// Define a type that matches exactly what the Toast component expects
type ToastPayload = {
  type: ToastType;
  message: string; // Changed to string only to match Toast component
  duration?: number;
};

// Create a global reference for toast functions
const globalToastHandler: {
  addToast?: (toast: ToastPayload) => void;
} = {};

// Export a function to show toasts from anywhere - with corrected types
export const showGlobalToast = (
  type: ToastType,
  message: string, // Changed to string only to match Toast component
  duration?: number
) => {
  if (globalToastHandler.addToast) {
    globalToastHandler.addToast({ type, message, duration });
  } else {
    console.warn("Toast handler not registered yet. Toast message:", message);
  }
};

// Global fetch interceptor for OpenAI API calls
const setupFetchInterceptor = () => {
  if (typeof window === "undefined") return; // Only run on client side

  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const response = await originalFetch(input, init);

    // Process only API errors from our OpenAI endpoint
    if (
      typeof input === "string" &&
      input.includes("/api/openai/") &&
      !response.ok
    ) {
      try {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();

        if (data.showToast && data.error) {
          // Use the global toast handler instead of the hook - with correct type
          // Convert any ReactNode to string if needed
          const errorMessage =
            typeof data.error === "object"
              ? "AI Service Error"
              : String(data.error || "AI Service Error");

          showGlobalToast("error", errorMessage);
        }
      } catch (error) {
        console.error("Failed to parse API error response", error);
      }
    }

    return response;
  };
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  // Get access to toast functions using the hook (inside component context)
  const toast = useToast();

  // Register the toast functions when the component mounts
  useEffect(() => {
    if (toast?.addToast) {
      // No type error should occur now with the fixed types
      globalToastHandler.addToast = toast.addToast;
    }

    return () => {
      // Cleanup on unmount
      delete globalToastHandler.addToast;
    };
  }, [toast]);

  // Setup fetch interceptor on client side only
  useEffect(() => {
    setupFetchInterceptor();
  }, []);

  // Configure the queryClient's default options if needed
  useEffect(() => {
    queryClient.setDefaultOptions({
      queries: {
        queryFn: async ({ queryKey }) => {
          const response = await fetch(queryKey[0] as string, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        },
        retry: false, // Don't retry API calls by default (prevent excessive AI API calls)
        // Add other default options you want to keep
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
