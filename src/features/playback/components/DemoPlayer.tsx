'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlaybackState } from '@/hooks/usePlaybackState';
import { StepsSidebar } from './StepsSidebar';
import { PlaybackTopBar } from './PlaybackTopBar';
import {
  FaMousePointer,
  FaKeyboard,
  FaCompass,
  FaPaperPlane,
  FaScroll,
  FaLightbulb,
  FaQuestion
} from 'react-icons/fa';

interface DemoPlayerProps {
  steps: any[];
  demoId: string;
  demoTitle?: string;
}

export function DemoPlayer({ steps, demoId, demoTitle }: DemoPlayerProps) {
  const router = useRouter();
  const { state, nextStep, prevStep, jumpToStep } = usePlaybackState(steps);
  const [highlightPosition, setHighlightPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [imageTransform, setImageTransform] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node) {
      const updateSize = () => {
        setImageSize({
          width: node.naturalWidth,
          height: node.naturalHeight
        });
      };
      if (node.complete) {
        updateSize();
      } else {
        node.addEventListener('load', updateSize);
      }
    }
  }, []);

  // Update highlight position when step changes
  useEffect(() => {
    const currentStep = steps[state.currentStepIndex];
    if (!currentStep || !imageSize) {
      setHighlightPosition(null);
      return;
    }

    // Get element data - check both possible field names
    const elementData = currentStep.element || currentStep.element_data;
    if (!elementData) {
      setHighlightPosition(null);
      return;
    }

    // Get bounding rect from captured data
    const boundingRect = elementData.boundingRect || elementData.bounding_rect;
    const viewport = elementData.viewport;

    if (!boundingRect || !viewport) {
      console.warn('[DemoPlayer] Missing bounding rect or viewport data');
      setHighlightPosition(null);
      return;
    }

    // Normalize bounding rect - handle both x/y and left/top formats
    const normalizedRect = {
      x: boundingRect.x ?? boundingRect.left ?? 0,
      y: boundingRect.y ?? boundingRect.top ?? 0,
      width: boundingRect.width ?? 0,
      height: boundingRect.height ?? 0
    };

    // Calculate scale factor between captured viewport and displayed image
    // The screenshot was taken at viewport.width x viewport.height
    // But now it's displayed at imageSize.width x imageSize.height
    const scaleX = imageSize.width / viewport.width;
    const scaleY = imageSize.height / viewport.height;

    // Calculate highlight position accounting for scale
    const scaledPosition = {
      x: normalizedRect.x * scaleX,
      y: normalizedRect.y * scaleY,
      width: normalizedRect.width * scaleX,
      height: normalizedRect.height * scaleY
    };

    setHighlightPosition(scaledPosition);
    console.log('[DemoPlayer] Scaled highlight:', {
      original: boundingRect,
      viewport,
      imageSize,
      scale: { scaleX, scaleY },
      scaled: scaledPosition
    });
  }, [state.currentStepIndex, steps, imageSize]);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Prevent default for navigation keys
    if (['ArrowRight', 'ArrowLeft', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowRight':
        nextStep();
        break;
      case 'ArrowLeft':
        prevStep();
        break;
      case 'Escape':
        router.push(`/demos/${demoId}`);
        break;
      case 'Home':
        jumpToStep(0);
        break;
      case 'End':
        jumpToStep(steps.length - 1);
        break;
    }
  }, [nextStep, prevStep, jumpToStep, router, demoId, steps.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleClose = useCallback(() => {
    router.push(`/demos/${demoId}`);
  }, [router, demoId]);

  const currentStep = steps[state.currentStepIndex];
  const screenshotUrl = currentStep?.screenshot_url;

  // Get human-readable action description
  const getActionDescription = () => {
    if (!currentStep) return 'Loading...';

    const elementData = currentStep.element || currentStep.element_data;
    const type = (currentStep as any).step_type || currentStep.type || (currentStep as any).action_type || (currentStep as any).event_type;

    let action = '';
    let target = '';

    // Determine action verb
    switch (type) {
      case 'click':
        action = 'Click';
        break;
      case 'input':
      case 'change':
        action = 'Type in';
        break;
      case 'submit':
        action = 'Submit';
        break;
      case 'navigation':
        action = 'Navigate to';
        break;
      case 'scroll':
        action = 'Scroll';
        break;
      default:
        if (type && typeof type === 'string') {
          action = type.charAt(0).toUpperCase() + type.slice(1);
        } else {
          action = 'Interact with';
        }
    }

    // Determine target
    if (elementData?.textContent) {
      const text = elementData.textContent.trim();
      target = text.length > 40 ? `"${text.substring(0, 40)}..."` : `"${text}"`;
    } else if (elementData?.placeholder) {
      target = `"${elementData.placeholder}" field`;
    } else if (elementData?.tagName) {
      target = `the ${elementData.tagName.toLowerCase()}`;
    } else {
      target = 'element';
    }

    return `${action} ${target}`;
  };

  return (
    <>
      {/* Steps Sidebar */}
      <StepsSidebar
        steps={steps}
        currentStepIndex={state.currentStepIndex}
        onStepClick={jumpToStep}
      />

      {/* Top Navigation Bar */}
      <PlaybackTopBar
        demoTitle={demoTitle}
        currentStep={state.currentStepIndex}
        totalSteps={state.totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={handleClose}
      />

      {/* Main Content Area - Screenshot with enhanced highlight overlay */}
      <div className="fixed top-16 left-80 right-0 bottom-0 bg-gray-900 z-[99998] overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Screenshot */}
          {screenshotUrl ? (
            <div className="relative max-w-full max-h-full">
              <img
                ref={imageRef}
                src={screenshotUrl}
                alt={`Step ${state.currentStepIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${imageScale}) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
                  transition: 'transform 0.3s ease-out'
                }}
              />

              {/* Element Highlight Overlay - Clean and Accurate */}
              {highlightPosition && (
                <>
                  {/* Clean highlight box */}
                  <div
                    className="absolute pointer-events-none z-30"
                    style={{
                      left: `${highlightPosition.x}px`,
                      top: `${highlightPosition.y}px`,
                      width: `${highlightPosition.width}px`,
                      height: `${highlightPosition.height}px`,
                      border: '3px solid #3B82F6',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.5)'
                    }}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📸</div>
              <p className="text-lg">No screenshot available for this step</p>
              <p className="text-sm mt-2">
                {currentStep?.type || 'Unknown action'} on {currentStep?.element?.tagName || 'element'}
              </p>
            </div>
          )}

          {/* Large Action Banner (replaces annotation overlay) */}
          {currentStep && (() => {
            const stepType = (currentStep as any).step_type || currentStep.type || (currentStep as any).action_type || (currentStep as any).event_type;

            const getActionIcon = () => {
              switch (stepType) {
                case 'click':
                  return <FaMousePointer className="text-white" />;
                case 'input':
                case 'change':
                  return <FaKeyboard className="text-white" />;
                case 'navigation':
                  return <FaCompass className="text-white" />;
                case 'submit':
                  return <FaPaperPlane className="text-white" />;
                case 'scroll':
                  return <FaScroll className="text-white" />;
                default:
                  return stepType ? <FaLightbulb className="text-white" /> : <FaQuestion className="text-white" />;
              }
            };

            return (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-full px-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl flex items-center justify-center w-16 h-16">
                      {getActionIcon()}
                    </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-blue-100 mb-1">
                      Step {state.currentStepIndex + 1} of {state.totalSteps}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {currentStep.annotations?.text || getActionDescription()}
                    </h2>
                    {currentStep.value && (
                      <div className="text-sm text-blue-100 mt-2 font-mono bg-white/10 px-3 py-1 rounded inline-block">
                        Input: "{currentStep.value}"
                      </div>
                    )}
                  </div>
                    <div className="text-4xl font-bold text-white/50">
                      {state.currentStepIndex + 1}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-full whitespace-nowrap shadow-xl border border-white/20">
            <span className="text-sm font-medium">
              Use <kbd className="px-2 py-1 bg-white/20 rounded">←</kbd> <kbd className="px-2 py-1 bg-white/20 rounded">→</kbd> to navigate • Press <kbd className="px-2 py-1 bg-white/20 rounded">Esc</kbd> to exit
            </span>
          </div>
        </div>
      </div>

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-[100001] bg-black/90 text-white text-xs p-3 rounded-lg max-w-xs">
          <div className="font-mono space-y-1">
            <div className="font-bold text-green-400">Debug Info</div>
            <div>Step: {state.currentStepIndex + 1}/{state.totalSteps}</div>
            <div>Type: {currentStep?.type || 'N/A'}</div>
            <div className="text-gray-300 truncate">
              Screenshot: {screenshotUrl ? '✅' : '❌'}
            </div>
            <div className="text-gray-300 truncate">
              Highlight: {highlightPosition ? '✅' : '❌'}
            </div>
            {highlightPosition && (
              <div className="text-gray-300 text-xs">
                Pos: {Math.round(highlightPosition.x)},{Math.round(highlightPosition.y)}
                Size: {Math.round(highlightPosition.width)}x{Math.round(highlightPosition.height)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
