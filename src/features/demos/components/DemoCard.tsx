'use client';

import { Badge } from '@/components/ui/badge/Badge';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card/Card';
import { Play, Edit, Share, Trash2, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface DemoCardProps {
  demo: Demo;
  onPlay: (demo: Demo) => void;
  onEdit: (demo: Demo) => void;
  onShare: (demo: Demo) => void;
  onDelete: (demo: Demo) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published': return 'default';
    case 'draft': return 'secondary';
    case 'archived': return 'outline';
    default: return 'outline';
  }
};

const statusLabels = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

export function DemoCard({ demo, onPlay, onEdit, onShare, onDelete }: DemoCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {demo.title}
            </h3>
            {demo.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {demo.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(demo.created_at), { addSuffix: true })}</span>
          </div>
          {demo.estimated_duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(demo.estimated_duration)}</span>
            </div>
          )}
          {demo.total_steps && (
            <span>{demo.total_steps} steps</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <Badge variant={getStatusVariant(demo.status)}>
            {statusLabels[demo.status]}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(demo)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" onClick={() => onPlay(demo)}>
              <Play className="h-4 w-4 mr-1" />
              Play
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}