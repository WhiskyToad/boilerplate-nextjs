'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Demo {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  total_steps?: number;
  estimated_duration?: number;
  user_id: string;
  team_id?: string;
  recording_data?: any;
  settings?: any;
}

export function useDemos() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const fetchDemos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('demos')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDemos(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching demos:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load demos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDemo = async (demoData: { title: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('demos')
        .insert([{
          title: demoData.title,
          description: demoData.description,
          status: 'draft',
          settings: {},
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setDemos(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Demo created successfully',
      });

      return data;
    } catch (err: any) {
      console.error('Error creating demo:', err);
      toast({
        title: 'Error',
        description: 'Failed to create demo',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateDemo = async (id: string, updates: Partial<Demo>) => {
    try {
      const { data, error } = await supabase
        .from('demos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setDemos(prev => prev.map(demo => demo.id === id ? data : demo));
      toast({
        title: 'Success',
        description: 'Demo updated successfully',
      });

      return data;
    } catch (err: any) {
      console.error('Error updating demo:', err);
      toast({
        title: 'Error',
        description: 'Failed to update demo',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteDemo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('demos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDemos(prev => prev.filter(demo => demo.id !== id));
      toast({
        title: 'Success',
        description: 'Demo deleted successfully',
      });
    } catch (err: any) {
      console.error('Error deleting demo:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete demo',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const publishDemo = async (id: string) => {
    return updateDemo(id, { status: 'published' });
  };

  const archiveDemo = async (id: string) => {
    return updateDemo(id, { status: 'archived' });
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  return {
    demos,
    isLoading,
    error,
    createDemo,
    updateDemo,
    deleteDemo,
    publishDemo,
    archiveDemo,
    refetch: fetchDemos,
  };
}