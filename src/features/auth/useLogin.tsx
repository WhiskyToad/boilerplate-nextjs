import { useState } from "react";
import { supabase } from "@/features/supabase/client";
import { useAuthStore } from "@/features/store/authStore";
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useAuthStore();

  const login = async (formData: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      // type-casting here for convenience
      // in practice, you should validate your inputs
      const input = {
        email: formData.email,
        password: formData.password,
      };

      const {
        error,
        data: { session },
      } = await supabase.auth.signInWithPassword(input);
      if (error) {
        return;
      }
      setSession(session);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
