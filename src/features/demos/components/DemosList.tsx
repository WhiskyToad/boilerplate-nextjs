'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { DemoCard } from './DemoCard';

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

interface DemosListProps {
  demos: Demo[];
  isLoading?: boolean;
  onCreateDemo: () => void;
  onPlayDemo: (demo: Demo) => void;
  onEditDemo: (demo: Demo) => void;
  onShareDemo: (demo: Demo) => void;
  onDeleteDemo: (demo: Demo) => void;
}

export function DemosList({
  demos,
  isLoading = false,
  onCreateDemo,
  onPlayDemo,
  onEditDemo,
  onShareDemo,
  onDeleteDemo,
}: DemosListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const filteredDemos = demos.filter((demo) => {
    const matchesSearch = demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         demo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || demo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1">
            <div className="h-10 bg-gray-200 rounded-md flex-1 animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search demos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onCreateDemo}>
          <Plus className="h-4 w-4 mr-2" />
          New Demo
        </Button>
      </div>

      {/* Results */}
      {filteredDemos.length === 0 ? (
        <div className="text-center py-12">
          {demos.length === 0 ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No demos yet</h3>
                <p className="text-gray-500 mt-1">
                  Get started by creating your first interactive demo
                </p>
              </div>
              <Button onClick={onCreateDemo}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Demo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No demos found</h3>
                <p className="text-gray-500 mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map((demo) => (
            <DemoCard
              key={demo.id}
              demo={demo}
              onPlay={onPlayDemo}
              onEdit={onEditDemo}
              onShare={onShareDemo}
              onDelete={onDeleteDemo}
            />
          ))}
        </div>
      )}

      {/* Results summary */}
      {filteredDemos.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredDemos.length} of {demos.length} demos
        </div>
      )}
    </div>
  );
}