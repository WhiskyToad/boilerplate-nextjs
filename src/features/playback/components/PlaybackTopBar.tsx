'use client';

interface PlaybackTopBarProps {
  demoTitle?: string;
  currentStep: number;
  totalSteps: number;
  stepDescription?: string;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function PlaybackTopBar({
  demoTitle,
  currentStep,
  totalSteps,
  stepDescription,
  onNext,
  onPrev,
  onClose
}: PlaybackTopBarProps) {
  const isAtStart = currentStep === 0;
  const isAtEnd = currentStep === totalSteps - 1;

  return (
    <div className="fixed top-0 left-80 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-[99999]">
      <div className="h-14 px-4 flex items-center justify-between gap-4">
        {/* Left: Demo Title */}
        <div className="min-w-0 flex-shrink-0">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
            {demoTitle || 'Demo Playback'}
          </h1>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={isAtStart}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous (←)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3">
            {currentStep + 1} / {totalSteps}
          </span>

          <button
            onClick={onNext}
            disabled={isAtEnd}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next (→)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Middle: Description */}
        {stepDescription && (
          <div className="flex-1 min-w-0 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {stepDescription}
            </p>
          </div>
        )}

        {/* Right: Close button */}
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          title="Close (Esc)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
