'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Badge } from '@/components/ui/badge/Badge';
import { Play, Pause, Square, ChevronLeft, ChevronRight, RotateCcw, Maximize2 } from 'lucide-react';

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
  settings?: any;
  total_steps?: number;
}

interface DemoPlayerProps {
  demo: Demo;
  steps: DemoStep[];
  onStepChange?: (stepIndex: number) => void;
}

export default function DemoPlayer({ demo, steps, onStepChange }: DemoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [iframeSize, setIframeSize] = useState({ width: 0, height: 0 });

  const startUrl = demo.settings?.startUrl || 'https://example.com';
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      const timer = setTimeout(() => {
        playNextStep();
      }, (2000 / playbackSpeed)); // Base 2 second delay per step

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isPaused, currentStepIndex, playbackSpeed]);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    // Get iframe dimensions for overlay positioning
    if (iframeRef.current) {
      const rect = iframeRef.current.getBoundingClientRect();
      setIframeSize({ width: rect.width, height: rect.height });
    }
  };

  const playNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      executeStep(steps[currentStepIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  const executeStep = (step: DemoStep) => {
    if (!step || !isIframeLoaded) return;

    const elementData = step.element_data;
    
    // Calculate position for visual effects
    let targetX = 0;
    let targetY = 0;

    if (elementData.boundingRect) {
      targetX = elementData.boundingRect.left + elementData.boundingRect.width / 2;
      targetY = elementData.boundingRect.top + elementData.boundingRect.height / 2;
    }

    // Show visual effects based on step type
    switch (step.step_type) {
      case 'click':
        showClickEffect(targetX, targetY);
        if (elementData.textContent) {
          showTooltipAtPosition(`Click on "${elementData.textContent}"`, targetX, targetY);
        }
        break;
      
      case 'input':
        showInputEffect(targetX, targetY);
        if (step.interactions?.value) {
          showTooltipAtPosition(`Type: "${step.interactions.value}"`, targetX, targetY);
        }
        break;
      
      case 'navigation':
        showNavigationEffect();
        if (step.timing_data?.url) {
          showTooltipAtPosition(`Navigate to: ${step.timing_data.url}`, 400, 50);
        }
        break;
      
      case 'annotation':
        if (step.annotations?.text) {
          showTooltipAtPosition(step.annotations.text, targetX, targetY);
        }
        break;
    }

    // Auto-zoom to the element
    if (elementData.boundingRect) {
      autoZoomToElement(elementData.boundingRect);
    }
  };

  const showClickEffect = (x: number, y: number) => {
    if (!overlayRef.current) return;

    // Create click ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${x - 20}px;
      top: ${y - 20}px;
      width: 40px;
      height: 40px;
      background: rgba(59, 130, 246, 0.3);
      border: 2px solid #3b82f6;
      border-radius: 50%;
      animation: ripple 1s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    overlayRef.current.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
      style.remove();
    }, 1000);

    // Show click cursor
    showCursorEffect(x, y);
  };

  const showInputEffect = (x: number, y: number) => {
    if (!overlayRef.current) return;

    // Create input highlight
    const highlight = document.createElement('div');
    highlight.style.cssText = `
      position: absolute;
      left: ${x - 30}px;
      top: ${y - 10}px;
      width: 60px;
      height: 20px;
      background: rgba(34, 197, 94, 0.2);
      border: 2px solid #22c55e;
      border-radius: 4px;
      animation: pulse 2s infinite;
      pointer-events: none;
      z-index: 1000;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);

    overlayRef.current.appendChild(highlight);
    setTimeout(() => {
      highlight.remove();
      style.remove();
    }, 2000);
  };

  const showNavigationEffect = () => {
    // Add page transition effect
    if (overlayRef.current) {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        z-index: 1001;
        animation: fade 1s ease-in-out;
      `;
      overlay.textContent = '🔄 Navigating...';

      const style = document.createElement('style');
      style.textContent = `
        @keyframes fade {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);

      overlayRef.current.appendChild(overlay);
      setTimeout(() => {
        overlay.remove();
        style.remove();
      }, 1000);
    }
  };

  const showCursorEffect = (x: number, y: number) => {
    if (!overlayRef.current) return;

    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>') no-repeat;
      background-size: contain;
      pointer-events: none;
      z-index: 1002;
      animation: cursor-click 0.5s ease-out;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes cursor-click {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    overlayRef.current.appendChild(cursor);
    setTimeout(() => {
      cursor.remove();
      style.remove();
    }, 500);
  };

  const showTooltipAtPosition = (content: string, x: number, y: number) => {
    setTooltipContent(content);
    setTooltipPosition({ x, y });
    setShowTooltip(true);
    
    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  const autoZoomToElement = (boundingRect: any) => {
    // Calculate zoom to focus on the element
    const elementWidth = boundingRect.width;
    const elementHeight = boundingRect.height;
    const containerWidth = iframeSize.width;
    const containerHeight = iframeSize.height;

    if (elementWidth > 0 && elementHeight > 0) {
      const zoomX = Math.min(containerWidth / (elementWidth * 2), 2);
      const zoomY = Math.min(containerHeight / (elementHeight * 2), 2);
      const newZoom = Math.min(zoomX, zoomY, 1.5);
      
      setZoomLevel(newZoom);
      
      // Reset zoom after 3 seconds
      setTimeout(() => {
        setZoomLevel(1);
      }, 3000);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
    if (currentStepIndex < steps.length) {
      executeStep(steps[currentStepIndex]);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setZoomLevel(1);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      executeStep(steps[newIndex]);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      executeStep(steps[newIndex]);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setZoomLevel(1);
    setShowTooltip(false);
  };

  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">This demo doesn't have any recorded steps yet.</p>
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
            <h2 className="text-xl font-semibold">Visual Demo Player</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {currentStepIndex + 1} of {steps.length}
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
            
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
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

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress</span>
              <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            {/* Website Iframe */}
            <iframe
              ref={iframeRef}
              src={startUrl}
              className="w-full h-full border-0 transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
              onLoad={handleIframeLoad}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
            
            {/* Interactive Overlay */}
            <div 
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 999 }}
            >
              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="absolute bg-black text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg z-1003 animate-in fade-in duration-200"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y - 40}px`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {tooltipContent}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
              )}
            </div>

            {/* Loading Overlay */}
            {!isIframeLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading demo...</p>
                </div>
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
                  {currentStep.step_type === 'click' && `Click on ${currentStep.element_data.tagName || 'element'}`}
                  {currentStep.step_type === 'input' && `Type "${currentStep.interactions?.value || 'text'}"`}
                  {currentStep.step_type === 'navigation' && `Navigate to ${currentStep.timing_data?.url || 'page'}`}
                  {currentStep.step_type === 'annotation' && (currentStep.annotations?.text || 'Add annotation')}
                </p>
                {currentStep.annotations?.text && currentStep.step_type !== 'annotation' && (
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