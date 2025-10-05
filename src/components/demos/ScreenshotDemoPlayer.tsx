'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Badge } from '@/components/ui/badge/Badge';
import { Play, Pause, Square, ChevronLeft, ChevronRight, RotateCcw, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

interface DemoStep {
  id: string;
  sequence_order: number;
  step_type: string;
  element_data: any;
  annotations?: any;
  interactions?: any;
  timing_data?: any;
  screenshot_url?: string;
}

interface Demo {
  id: string;
  title: string;
  description?: string;
  settings?: any;
  total_steps?: number;
}

interface ScreenshotDemoPlayerProps {
  demo: Demo;
  steps: DemoStep[];
  onStepChange?: (stepIndex: number) => void;
}

export default function ScreenshotDemoPlayer({ demo, steps, onStepChange }: ScreenshotDemoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showClickEffect, setShowClickEffect] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMouseCursor, setShowMouseCursor] = useState(false);

  const currentStep = steps[currentStepIndex];
  const stepsWithScreenshots = steps.filter(step => step.screenshot_url);

  useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      const timer = setTimeout(() => {
        playNextStep();
      }, (3000 / playbackSpeed)); // 3 second delay per step

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isPaused, currentStepIndex, playbackSpeed]);

  useEffect(() => {
    preloadImages();
  }, [steps]);

  useEffect(() => {
    if (imagesLoaded && currentStep) {
      renderCurrentStep();
    }
  }, [currentStepIndex, imagesLoaded, zoomLevel, panOffset]);

  const preloadImages = async () => {
    setIsLoading(true);
    const imagePromises = stepsWithScreenshots.map(step => {
      return new Promise<void>((resolve) => {
        if (!step.screenshot_url) {
          resolve();
          return;
        }
        
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve on error
        img.src = step.screenshot_url;
      });
    });

    await Promise.all(imagePromises);
    setImagesLoaded(true);
    setIsLoading(false);
  };

  const renderCurrentStep = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !currentStep?.screenshot_url) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to container size
      const container = containerRef.current;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate image dimensions to fit canvas while maintaining aspect ratio
      const imgAspect = img.width / img.height;
      const canvasAspect = canvas.width / canvas.height;
      
      let drawWidth, drawHeight;
      if (imgAspect > canvasAspect) {
        drawWidth = canvas.width * zoomLevel;
        drawHeight = (canvas.width / imgAspect) * zoomLevel;
      } else {
        drawHeight = canvas.height * zoomLevel;
        drawWidth = (canvas.height * imgAspect) * zoomLevel;
      }

      // Apply pan offset
      const x = (canvas.width - drawWidth) / 2 + panOffset.x;
      const y = (canvas.height - drawHeight) / 2 + panOffset.y;

      // Draw the screenshot
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      // Add click overlays and effects
      if (currentStep.element_data?.boundingRect) {
        renderClickOverlay(ctx, drawWidth, drawHeight, x, y, img.width, img.height);
      }

      // Show mouse cursor if animating
      if (showMouseCursor) {
        renderMouseCursor(ctx);
      }

      // Show click effect
      if (showClickEffect) {
        renderClickEffect(ctx);
      }
    };

    img.src = currentStep.screenshot_url;
  };

  const renderClickOverlay = (
    ctx: CanvasRenderingContext2D, 
    drawWidth: number, 
    drawHeight: number, 
    offsetX: number, 
    offsetY: number,
    originalWidth: number,
    originalHeight: number
  ) => {
    const rect = currentStep.element_data.boundingRect;
    if (!rect) return;

    // Calculate position on scaled image
    const scaleX = drawWidth / originalWidth;
    const scaleY = drawHeight / originalHeight;
    
    const elementX = offsetX + (rect.left * scaleX);
    const elementY = offsetY + (rect.top * scaleY);
    const elementWidth = rect.width * scaleX;
    const elementHeight = rect.height * scaleY;

    // Draw element highlight
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(elementX, elementY, elementWidth, elementHeight);

    // Draw click hotspot
    if (currentStep.step_type === 'click') {
      const centerX = elementX + elementWidth / 2;
      const centerY = elementY + elementHeight / 2;

      // Pulsing circle
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.stroke();

      // Click number
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((currentStepIndex + 1).toString(), centerX, centerY + 5);
    }

    // Draw tooltip
    if (currentStep.annotations?.text || getStepDescription(currentStep)) {
      const tooltipText = currentStep.annotations?.text || getStepDescription(currentStep);
      const tooltipX = elementX + elementWidth / 2;
      const tooltipY = elementY - 10;
      
      renderTooltip(ctx, tooltipText, tooltipX, tooltipY);
    }
  };

  const renderTooltip = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.font = '12px sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padding = 8;
    const tooltipWidth = textWidth + padding * 2;
    const tooltipHeight = 24;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x - tooltipWidth / 2, y - tooltipHeight, tooltipWidth, tooltipHeight);

    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - 8);
  };

  const renderMouseCursor = (ctx: CanvasRenderingContext2D) => {
    // Draw animated mouse cursor
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    
    // Cursor shape
    ctx.beginPath();
    ctx.moveTo(mousePosition.x, mousePosition.y);
    ctx.lineTo(mousePosition.x + 12, mousePosition.y + 4);
    ctx.lineTo(mousePosition.x + 8, mousePosition.y + 8);
    ctx.lineTo(mousePosition.x + 4, mousePosition.y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const renderClickEffect = (ctx: CanvasRenderingContext2D) => {
    // Ripple effect
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(clickPosition.x, clickPosition.y, 30, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.beginPath();
    ctx.arc(clickPosition.x, clickPosition.y, 50, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const getStepDescription = (step: DemoStep) => {
    switch (step.step_type) {
      case 'click':
        return `Click ${step.element_data.textContent ? `"${step.element_data.textContent}"` : 'element'}`;
      case 'input':
        return `Type "${step.interactions?.value || 'text'}"`;
      case 'navigation':
        return `Navigate to ${step.timing_data?.title || 'page'}`;
      case 'initial':
        return 'Starting point';
      default:
        return 'Interaction';
    }
  };

  const playNextStep = () => {
    if (currentStepIndex < stepsWithScreenshots.length - 1) {
      animateToNextStep();
    } else {
      setIsPlaying(false);
    }
  };

  const animateToNextStep = () => {
    const nextStep = stepsWithScreenshots[currentStepIndex + 1];
    if (!nextStep) return;

    // Animate mouse cursor if there's a click
    if (nextStep.step_type === 'click' && nextStep.element_data?.boundingRect) {
      animateMouseToClick(nextStep.element_data.boundingRect);
    }

    // Move to next step after animation
    setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 500);
  };

  const animateMouseToClick = (rect: any) => {
    const canvas = canvasRef.current;
    if (!canvas || !rect) return;

    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    setShowMouseCursor(true);
    
    // Animate mouse movement
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 800, 1);
      
      const currentX = mousePosition.x + (targetX - mousePosition.x) * progress;
      const currentY = mousePosition.y + (targetY - mousePosition.y) * progress;
      
      setMousePosition({ x: currentX, y: currentY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Show click effect
        setClickPosition({ x: targetX, y: targetY });
        setShowClickEffect(true);
        setTimeout(() => {
          setShowClickEffect(false);
          setShowMouseCursor(false);
        }, 300);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleNextStep = () => {
    if (currentStepIndex < stepsWithScreenshots.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const exportAsVideo = async () => {
    // This will be handled by the VideoExporter component
    // Scroll to video export section
    const videoExporter = document.querySelector('[data-video-exporter]');
    if (videoExporter) {
      videoExporter.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600">Loading demo screenshots...</p>
        </CardContent>
      </Card>
    );
  }

  if (stepsWithScreenshots.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">This demo doesn't have any screenshots yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Record a new demo with the Chrome extension to capture screenshots.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Screenshot Demo Player</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {currentStepIndex + 1} of {stepsWithScreenshots.length}
              </Badge>
              <select 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 mb-4">
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
                {isPaused ? 'Resume' : 'Play'}
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
            
            <Button variant="outline" onClick={() => { setCurrentStepIndex(0); setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <div className="border-l pl-2 ml-2 flex gap-1">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" onClick={exportAsVideo}>
              <Download className="h-4 w-4 mr-2" />
              Export Video
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextStep}
              disabled={currentStepIndex === stepsWithScreenshots.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress</span>
              <span>{Math.round(((currentStepIndex + 1) / stepsWithScreenshots.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStepIndex + 1) / stepsWithScreenshots.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Canvas */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={containerRef}
            className="relative bg-gray-100 rounded-lg overflow-hidden" 
            style={{ height: '600px' }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-pointer"
              onClick={(e) => {
                // Allow clicking to advance
                if (!isPlaying) {
                  handleNextStep();
                }
              }}
            />
            
            {/* Zoom level indicator */}
            {zoomLevel !== 1 && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Info */}
      {currentStep && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {currentStep.step_type.charAt(0).toUpperCase() + currentStep.step_type.slice(1)}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}