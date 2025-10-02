'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Input } from '@/components/ui/input/Input';
import { Badge } from '@/components/ui/badge/Badge';
import { Save, Play, ChevronLeft, Settings } from 'lucide-react';
import Link from 'next/link';
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

interface DemoStep {
  id: string;
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: any;
}

export default function DemoEditPage() {
  const params = useParams();
  const router = useRouter();
  const demoId = params.id as string;
  const supabase = createClient();

  const [demo, setDemo] = useState<Demo | null>(null);
  const [steps, setSteps] = useState<DemoStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDemoData();
  }, [demoId]);

  useEffect(() => {
    if (demo) {
      setTitle(demo.title);
      setDescription(demo.description || '');
    }
  }, [demo]);

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
    } catch (err) {
      console.error('Error fetching demo:', err);
      router.push('/demos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!demo) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('demos')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', demoId);

      if (error) throw error;
      setDemo(prev => prev ? { ...prev, title, description } : null);
    } catch (err) {
      console.error('Error saving demo:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStepDescription = (step: DemoStep) => {
    switch (step.step_type) {
      case 'click':
        return `Click on ${step.element_data.tagName || 'element'}`;
      case 'input':
        return `Type "${step.interactions?.value || 'text'}"`;
      case 'navigation':
        return `Navigate to ${step.timing_data?.url || 'page'}`;
      default:
        return 'Interaction';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo not found</h1>
          <Link href="/demos">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Demos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/demos" className="hover:text-gray-700">Demos</Link>
              <span>/</span>
              <span>Edit</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Demo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/demos/${demoId}/play`}>
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Demo Settings</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter demo title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this demo shows..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Badge variant={getStatusVariant(demo.status)}>
                  {demo.status.charAt(0).toUpperCase() + demo.status.slice(1)}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Created:</strong> {new Date(demo.created_at).toLocaleDateString()}</p>
                <p><strong>Steps:</strong> {steps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Demo Steps ({steps.length})</h2>
          </CardHeader>
          <CardContent>
            {steps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No steps recorded yet</p>
                <p className="text-sm text-gray-400">
                  Use the Chrome extension to record your demo steps
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">How to Record:</h3>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Install the DemoFlow Chrome extension</li>
                    <li>2. Navigate to the page you want to demo</li>
                    <li>3. Click the extension icon and select this demo</li>
                    <li>4. Start recording and perform your actions</li>
                    <li>5. Stop recording to save your steps</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {step.step_type}
                        </Badge>
                        {step.timing_data?.url && (
                          <span className="text-xs text-gray-500">
                            {new URL(step.timing_data.url).hostname}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">
                        {getStepDescription(step)}
                      </p>
                      {step.annotations?.text && (
                        <p className="text-xs text-blue-600 mt-1">
                          💡 {step.annotations.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}