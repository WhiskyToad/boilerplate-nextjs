'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Badge } from '@/components/ui/badge/Badge';
import { Play, Pause, Square, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchDemoData();
  }, [demoId]);

  useEffect(() => {
    if (steps.length > 0) {
      setProgress((currentStepIndex / (steps.length - 1)) * 100);
    }
  }, [currentStepIndex, steps.length]);

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

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const formatStepType = (stepType: string) => {
    switch (stepType) {
      case 'click':
        return 'Click';
      case 'input':
        return 'Type';
      case 'navigation':
        return 'Navigate';
      case 'annotation':
        return 'Note';
      case 'pause':
        return 'Pause';
      default:
        return stepType;
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
      case 'annotation':
        return step.annotations?.text || 'Add annotation';
      case 'pause':
        return 'Pause for effect';
      default:
        return 'Interaction';
    }
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

  const currentStep = steps[currentStepIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/demos" className="hover:text-gray-700">Demos</Link>
            <span>/</span>
            <span>{demo.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{demo.title}</h1>
          {demo.description && (
            <p className="text-gray-600 mt-2">{demo.description}</p>
          )}
        </div>

        {steps.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">This demo doesn't have any recorded steps yet.</p>
              <Link href={`/demos/${demo.id}/edit`}>
                <Button className="mt-4">Edit Demo</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Demo Player */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Demo Playback</h2>
                  <Badge variant="outline">
                    Step {currentStepIndex + 1} of {steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Step */}
                {currentStep && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {formatStepType(currentStep.step_type)}
                        </Badge>
                        <p className="text-sm text-gray-700">
                          {getStepDescription(currentStep)}
                        </p>
                        {currentStep.annotations?.text && (
                          <p className="text-xs text-gray-500 mt-1">
                            💡 {currentStep.annotations.text}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        #{currentStep.sequence_order + 1}
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {!isPlaying ? (
                    <Button onClick={handlePlay}>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  ) : (
                    <Button onClick={handlePause}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={handleStop}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextStep}
                    disabled={currentStepIndex === steps.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Steps List */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Demo Steps</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentStepIndex
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentStepIndex(index)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === currentStepIndex
                          ? 'bg-primary text-primary-foreground'
                          : index < currentStepIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {formatStepType(step.step_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">
                          {getStepDescription(step)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}