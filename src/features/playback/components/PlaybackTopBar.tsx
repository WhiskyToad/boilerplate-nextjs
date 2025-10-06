'use client';

interface PlaybackTopBarProps {
  demoTitle?: string;
  currentStep: number;
  totalSteps: number;
  isPlaying?: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPlayPause?: () => void;
  onClose: () => void;
}

export function PlaybackTopBar({
  demoTitle,
  currentStep,
  totalSteps,
  isPlaying = false,
  onNext,
  onPrev,
  onPlayPause,
  onClose
}: PlaybackTopBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isAtStart = currentStep === 0;
  const isAtEnd = currentStep === totalSteps - 1;

  return (
    <div className="fixed top-0 left-80 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-[99999] h-16">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Demo Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {demoTitle || 'Demo Playback'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Interactive demo recording
          </p>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-3">
          {/* Previous */}
          <button
            onClick={onPrev}
            disabled={isAtStart}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous step (← arrow)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause (optional) */}
          {onPlayPause && (
            <button
              onClick={onPlayPause}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              title={isPlaying ? 'Pause (space)' : 'Play (space)'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Next */}
          <button
            onClick={onNext}
            disabled={isAtEnd}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next step (→ arrow)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-2" />

          {/* Progress Info */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-center">
              {currentStep + 1} / {totalSteps}
            </span>

            {/* Progress Bar */}
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Right: Close Button */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
            title="Exit playback (Esc)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
