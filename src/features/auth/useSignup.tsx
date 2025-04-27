import { useState } from "react";
import { supabase } from "@/features/supabase/client";
import { useAuthStore } from "@/features/store/authStore";
import { AuthResponse } from "@supabase/supabase-js";

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useAuthStore();

  const signup = async (formData: {
    email: string;
    password: string;
  }): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const input = {
        email: formData.email,
        password: formData.password,
      };

      const response = await supabase.auth.signUp(input);

      if (response.error) {
        setError(response.error.message);
        return null;
      }

      // Only set session if one was returned (won't be if email confirmation is required)
      if (response.data.session) {
        setSession(response.data.session);
      }

      // Return the full response so we can check if email confirmation is needed
      return response;
    } catch (err) {
      console.log("An unexpected error occurred", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
}
