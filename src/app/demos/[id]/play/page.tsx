'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Badge } from '@/components/ui/badge/Badge';
import { Home, Edit } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ScreenshotDemoPlayer from '@/components/demos/ScreenshotDemoPlayer';
import VideoExporter from '@/components/demos/VideoExporter';

interface DemoStep {
  id: string;
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: any;
}

interface Demo {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  total_steps?: number;
  estimated_duration?: number;
}

export default function DemoPlayPage() {
  const params = useParams();
  const demoId = params.id as string;
  const supabase = createClient();

  const [demo, setDemo] = useState<Demo | null>(null);
  const [steps, setSteps] = useState<DemoStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDemoData();
  }, [demoId]);

  const fetchDemoData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch demo details
      const { data: demoData, error: demoError } = await supabase
        .from('demos')
        .select('*')
        .eq('id', demoId)
        .single();

      if (demoError) throw demoError;

      // Fetch demo steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('demo_steps')
        .select('*')
        .eq('demo_id', demoId)
        .order('sequence_order');

      if (stepsError) throw stepsError;

      setDemo(demoData);
      setSteps(stepsData || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching demo:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !demo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo not found</h1>
          <p className="text-gray-600 mb-6">
            The demo you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/demos">
            <Button>
              <Home className="h-4 w-4 mr-2" />
              Back to Demos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/demos" className="hover:text-gray-700">Demos</Link>
            <span>/</span>
            <span>{demo.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{demo.title}</h1>
              {demo.description && (
                <p className="text-gray-600 mt-2">{demo.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/demos/${demo.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Demo
                </Button>
              </Link>
              <Link href="/demos">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  All Demos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Screenshot Demo Player */}
          <div className="lg:col-span-2">
            <ScreenshotDemoPlayer 
              demo={demo}
              steps={steps}
              onStepChange={handleStepChange}
            />
          </div>

          {/* Video Export Panel */}
          <div className="lg:col-span-1">
            <VideoExporter 
              demo={demo}
              steps={steps}
            />
          </div>
        </div>
      </div>
    </div>
  );
}