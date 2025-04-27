"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { queryClient } from "@/features/utils/queryClient"; // Import the singleton queryClient

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
          // Show toast error notification
          toast.error(
            <div>
              <p className="font-bold">AI Service Error</p>
              <p className="text-sm">{data.error}</p>
              <p className="text-xs mt-1 opacity-80">Please try again</p>
            </div>,
            { duration: 5000 }
          );
        }
      } catch (e) {
        // In case response is not JSON
        console.error("Error parsing API error response:", e);
      }
    }

    return response;
  };
};

const Providers = ({ children }: { children: React.ReactNode }) => {
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
