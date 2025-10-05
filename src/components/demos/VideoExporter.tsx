'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card';
import { Badge } from '@/components/ui/badge/Badge';
import { Download, Play, Settings } from 'lucide-react';

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
}

interface VideoExporterProps {
  demo: Demo;
  steps: DemoStep[];
}

interface VideoSettings {
  duration: number; // seconds per step
  showMouseCursor: boolean;
  showClickEffects: boolean;
  showTooltips: boolean;
  autoZoom: boolean;
  resolution: 'HD' | 'FHD' | '4K';
  fps: 24 | 30 | 60;
}

export default function VideoExporter({ demo, steps }: VideoExporterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<VideoSettings>({
    duration: 3,
    showMouseCursor: true,
    showClickEffects: true,
    showTooltips: true,
    autoZoom: true,
    resolution: 'FHD',
    fps: 30
  });

  const stepsWithScreenshots = steps.filter(step => step.screenshot_url);

  const getResolutionDimensions = (resolution: string) => {
    switch (resolution) {
      case 'HD': return { width: 1280, height: 720 };
      case 'FHD': return { width: 1920, height: 1080 };
      case '4K': return { width: 3840, height: 2160 };
      default: return { width: 1920, height: 1080 };
    }
  };

  const generateVideo = useCallback(async () => {
    if (!canvasRef.current || stepsWithScreenshots.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      const dimensions = getResolutionDimensions(settings.resolution);
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      // Create video recorder
      const stream = canvas.captureStream(settings.fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
        videoBitsPerSecond: 5000000 // 5 Mbps
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Download the video
        const a = document.createElement('a');
        a.href = url;
        a.download = `${demo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_demo.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setExportProgress(100);
      };

      mediaRecorder.start();

      // Render each step
      for (let i = 0; i < stepsWithScreenshots.length; i++) {
        const step = stepsWithScreenshots[i];
        await renderStepToCanvas(ctx, step, i, dimensions);
        setExportProgress((i + 1) / stepsWithScreenshots.length * 90);
        
        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, settings.duration * 1000));
      }

      mediaRecorder.stop();
      setExportProgress(100);

    } catch (error) {
      console.error('Video export failed:', error);
      setIsExporting(false);
    }
  }, [demo, stepsWithScreenshots, settings]);

  const renderStepToCanvas = async (
    ctx: CanvasRenderingContext2D, 
    step: DemoStep, 
    stepIndex: number,
    dimensions: { width: number; height: number }
  ) => {
    return new Promise<void>((resolve) => {
      if (!step.screenshot_url) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        // Calculate image scaling to fit canvas
        const imgAspect = img.width / img.height;
        const canvasAspect = dimensions.width / dimensions.height;
        
        let drawWidth, drawHeight, x, y;
        if (imgAspect > canvasAspect) {
          drawWidth = dimensions.width;
          drawHeight = dimensions.width / imgAspect;
          x = 0;
          y = (dimensions.height - drawHeight) / 2;
        } else {
          drawHeight = dimensions.height;
          drawWidth = dimensions.height * imgAspect;
          x = (dimensions.width - drawWidth) / 2;
          y = 0;
        }

        // Auto-zoom to element if enabled
        if (settings.autoZoom && step.element_data?.boundingRect) {
          const zoomResult = calculateAutoZoom(
            step.element_data.boundingRect,
            img.width,
            img.height,
            dimensions
          );
          drawWidth = zoomResult.width;
          drawHeight = zoomResult.height;
          x = zoomResult.x;
          y = zoomResult.y;
        }

        // Draw screenshot
        ctx.drawImage(img, x, y, drawWidth, drawHeight);

        // Add overlays
        if (settings.showClickEffects && step.step_type === 'click') {
          renderClickEffects(ctx, step, drawWidth, drawHeight, x, y, img.width, img.height);
        }

        if (settings.showMouseCursor) {
          renderMouseCursor(ctx, step, drawWidth, drawHeight, x, y, img.width, img.height);
        }

        if (settings.showTooltips) {
          renderTooltip(ctx, step, stepIndex);
        }

        resolve();
      };

      img.onerror = () => resolve();
      img.src = step.screenshot_url;
    });
  };

  const calculateAutoZoom = (
    rect: any,
    originalWidth: number,
    originalHeight: number,
    canvasDimensions: { width: number; height: number }
  ) => {
    const padding = 100; // Padding around the element
    const zoomWidth = rect.width + padding * 2;
    const zoomHeight = rect.height + padding * 2;
    
    const scale = Math.min(
      canvasDimensions.width / zoomWidth,
      canvasDimensions.height / zoomHeight,
      2 // Max 2x zoom
    );

    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    // Center the zoomed area around the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = canvasDimensions.width / 2 - (centerX * scale);
    const y = canvasDimensions.height / 2 - (centerY * scale);

    return {
      width: scaledWidth,
      height: scaledHeight,
      x: Math.max(Math.min(x, 0), canvasDimensions.width - scaledWidth),
      y: Math.max(Math.min(y, 0), canvasDimensions.height - scaledHeight)
    };
  };

  const renderClickEffects = (
    ctx: CanvasRenderingContext2D,
    step: DemoStep,
    drawWidth: number,
    drawHeight: number,
    offsetX: number,
    offsetY: number,
    originalWidth: number,
    originalHeight: number
  ) => {
    const rect = step.element_data.boundingRect;
    if (!rect) return;

    const scaleX = drawWidth / originalWidth;
    const scaleY = drawHeight / originalHeight;
    
    const centerX = offsetX + (rect.left + rect.width / 2) * scaleX;
    const centerY = offsetY + (rect.top + rect.height / 2) * scaleY;

    // Animated click ripple
    const time = Date.now() % 1000;
    const rippleRadius = (time / 1000) * 50 + 20;
    const opacity = 1 - (time / 1000);

    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rippleRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
  };

  const renderMouseCursor = (
    ctx: CanvasRenderingContext2D,
    step: DemoStep,
    drawWidth: number,
    drawHeight: number,
    offsetX: number,
    offsetY: number,
    originalWidth: number,
    originalHeight: number
  ) => {
    const rect = step.element_data.boundingRect;
    if (!rect) return;

    const scaleX = drawWidth / originalWidth;
    const scaleY = drawHeight / originalHeight;
    
    const cursorX = offsetX + (rect.left + rect.width / 2) * scaleX;
    const cursorY = offsetY + (rect.top + rect.height / 2) * scaleY;

    // Draw cursor
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(cursorX, cursorY);
    ctx.lineTo(cursorX + 16, cursorY + 6);
    ctx.lineTo(cursorX + 10, cursorY + 10);
    ctx.lineTo(cursorX + 6, cursorY + 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const renderTooltip = (ctx: CanvasRenderingContext2D, step: DemoStep, stepIndex: number) => {
    const text = step.annotations?.text || getStepDescription(step);
    const x = 50;
    const y = 50;

    ctx.font = 'bold 24px sans-serif';
    const textWidth = ctx.measureText(text).width;
    const padding = 20;
    const tooltipWidth = textWidth + padding * 2;
    const tooltipHeight = 50;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x, y, tooltipWidth, tooltipHeight);

    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(text, x + padding, y + 32);

    // Step number
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`Step ${stepIndex + 1}`, x + padding, y + 16);
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

  if (stepsWithScreenshots.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No screenshots available for video export.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-video-exporter>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Video Export</h3>
            <Badge variant="outline">
              {stepsWithScreenshots.length} screenshots
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Settings Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <span className="text-sm text-gray-500">
              Estimated duration: {Math.round(stepsWithScreenshots.length * settings.duration)}s
            </span>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">Duration per step (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.duration}
                  onChange={(e) => setSettings(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Resolution</label>
                <select
                  value={settings.resolution}
                  onChange={(e) => setSettings(prev => ({ ...prev, resolution: e.target.value as any }))}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="HD">HD (1280x720)</option>
                  <option value="FHD">Full HD (1920x1080)</option>
                  <option value="4K">4K (3840x2160)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Frame Rate</label>
                <select
                  value={settings.fps}
                  onChange={(e) => setSettings(prev => ({ ...prev, fps: Number(e.target.value) as any }))}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value={24}>24 FPS</option>
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showMouseCursor}
                    onChange={(e) => setSettings(prev => ({ ...prev, showMouseCursor: e.target.checked }))}
                    className="mr-2"
                  />
                  Show mouse cursor
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showClickEffects}
                    onChange={(e) => setSettings(prev => ({ ...prev, showClickEffects: e.target.checked }))}
                    className="mr-2"
                  />
                  Show click effects
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.showTooltips}
                    onChange={(e) => setSettings(prev => ({ ...prev, showTooltips: e.target.checked }))}
                    className="mr-2"
                  />
                  Show tooltips
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoZoom}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoZoom: e.target.checked }))}
                    className="mr-2"
                  />
                  Auto-zoom to elements
                </label>
              </div>
            </div>
          )}

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating video...</span>
                <span>{Math.round(exportProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={generateVideo}
            disabled={isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Generating Video...' : 'Export as Video'}
          </Button>
        </CardContent>
      </Card>

      {/* Hidden canvas for video generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}