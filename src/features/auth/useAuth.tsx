import { useAuthStore } from "@/features/store/authStore";
import { supabase } from "@/features/supabase/client";
import { useEffect } from "react";

export const useAuth = () => {
  const { setSession } = useAuthStore();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession]);
};
