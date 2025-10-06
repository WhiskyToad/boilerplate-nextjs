'use client';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export function PlaybackControls({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onClose,
  isPlaying = false,
  onPlayPause
}: PlaybackControlsProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isAtStart = currentStep === 0;
  const isAtEnd = currentStep === totalSteps - 1;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100000]">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl px-6 py-4 flex items-center gap-4 border border-gray-200 dark:border-gray-700">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={isAtStart}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Previous step (← arrow key)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause Button (optional) */}
        {onPlayPause && (
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title={isPlaying ? 'Pause (space)' : 'Play (space)'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>
        )}

        {/* Step Counter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[70px] text-center">
            Step {currentStep + 1} of {totalSteps}
          </span>

          {/* Progress Bar */}
          <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage */}
          <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[45px]">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={isAtEnd}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Next step (→ arrow key)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
          title="Exit playback (Esc)"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 bg-black/70 text-white px-3 py-1 rounded whitespace-nowrap">
        Use ← → arrow keys to navigate • Press Esc to exit
      </div>
    </div>
  );
}
