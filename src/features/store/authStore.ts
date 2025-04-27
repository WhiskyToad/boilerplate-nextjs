import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";
import { create } from "zustand";
import posthog from "posthog-js"; // Import posthog

interface AuthState {
  session: Session | null;
  user: Session["user"] | null;
  isLoading: boolean; // Add isLoading state
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true, // Initialize isLoading as true
  setSession: (session) => {
    set({ session, user: session?.user || null, isLoading: false }); // Set isLoading to false when session is set
    // Check if not in development before interacting with PostHog
    if (process.env.NODE_ENV !== "development") {
      if (session?.user) {
        // Identify the user in PostHog
        posthog.identify(
          session.user.id, // Use Supabase user ID as distinct_id
          {
            email: session.user.email, // Optional: set user properties
            // Add any other relevant user properties here
          }
        );
        console.log("PostHog user identified:", session.user.id);
      } else {
        // If session is null (logout), reset PostHog identification
        posthog.reset();
        console.log("PostHog user reset");
      }
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isLoading: false }); // Set isLoading to false on sign out
  },
}));

// Auto-update session when auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  // The first call to setSession will set isLoading to false
  useAuthStore.getState().setSession(session);
});