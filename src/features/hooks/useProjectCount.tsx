import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { supabase } from '@/features/supabase/client';

export function useProjectCount() {
  const { user } = useAuthStore();

  const { data: projectCount, isLoading } = useQuery({
    queryKey: ['projectCount', user],
    queryFn: async (): Promise<number> => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('project_forms')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return count || 0;
    },
    enabled: !!user,
  });

  return { projectCount: projectCount || 0, isLoading };
}