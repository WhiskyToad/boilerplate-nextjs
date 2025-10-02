'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Badge } from '@/components/ui/badge/Badge';
import { Input } from '@/components/ui/input/Input';
import { Plus, Play, Edit, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Demo {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  total_steps?: number;
  estimated_duration?: number;
}

export default function DemosPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDemoTitle, setNewDemoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const { data, error } = await supabase
        .from('demos')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDemos(data || []);
    } catch (err) {
      console.error('Error fetching demos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createDemo = async () => {
    if (!newDemoTitle.trim()) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('demos')
        .insert([{
          title: newDemoTitle.trim(),
          status: 'draft',
          settings: {},
        }])
        .select()
        .single();

      if (error) throw error;

      setDemos(prev => [data, ...prev]);
      setNewDemoTitle('');
      
      // Navigate to edit the new demo
      router.push(`/demos/${data.id}/edit`);
    } catch (err) {
      console.error('Error creating demo:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Demos</h1>
        <p className="text-gray-600 mt-2">
          Create and manage your interactive product demos
        </p>
      </div>

      {/* Create Demo Section */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Demo</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter demo title..."
              value={newDemoTitle}
              onChange={(e) => setNewDemoTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createDemo()}
              className="flex-1"
            />
            <Button 
              onClick={createDemo} 
              disabled={isCreating || !newDemoTitle.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : 'Create Demo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demos List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : demos.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Play className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No demos yet</h3>
          <p className="text-gray-500 mt-2">
            Create your first interactive demo to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Card key={demo.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {demo.title}
                    </h3>
                    {demo.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {demo.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(demo.created_at)}</span>
                  </div>
                  {demo.total_steps && (
                    <span>{demo.total_steps} steps</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusVariant(demo.status)}>
                    {demo.status.charAt(0).toUpperCase() + demo.status.slice(1)}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Link href={`/demos/${demo.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/demos/${demo.id}/play`}>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chrome Extension Info */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎬 Ready to Record?
            </h3>
            <p className="text-blue-700 mb-4">
              Install the DemoFlow Chrome extension to start recording interactive demos
            </p>
            <Button variant="outline" className="text-blue-700 border-blue-300">
              Get Chrome Extension
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}