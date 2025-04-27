import { QueryClient } from '@tanstack/react-query';

// Create a singleton query client that can be imported anywhere
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
      retry: 1,
      refetchOnWindowFocus: true, // Re-fetch when window regains focus
      refetchOnMount: true,      // Re-fetch when component mounts
      refetchOnReconnect: true,  // Re-fetch when reconnecting
    },
    mutations: {
      // Global error handling for mutations
      onError: (error: unknown) => {
        console.error("Mutation error:", error);
        // API-specific errors will be handled by the fetch interceptor
      },
    },
  },
});

// Helper functions for consistent cache invalidation
export const invalidateFeatureCache = (projectId: string) => {
  queryClient.invalidateQueries({ queryKey: ["projectFeatures", projectId] });
  queryClient.invalidateQueries({ queryKey: ["featureTasks", projectId] });
  
  // Force refetch
  setTimeout(() => {
    queryClient.refetchQueries({ queryKey: ["projectFeatures", projectId] });
    queryClient.refetchQueries({ queryKey: ["featureTasks", projectId] });
    queryClient.refetchQueries({ queryKey: ["projectProgress", projectId] });
  }, 200);
};

// Helper for invalidating tasks
export const invalidateTaskCache = (projectId: string, featureId?: string) => {
  if (featureId) {
    queryClient.invalidateQueries({ queryKey: ["featureTask", featureId] });
  }
  queryClient.invalidateQueries({ queryKey: ["featureTasks", projectId] });
  
  // Also invalidate progress which depends on tasks
  queryClient.invalidateQueries({ queryKey: ["projectProgress", projectId] });
  
  // Force refetch
  queryClient.refetchQueries({ queryKey: ["featureTasks", projectId] });
};
