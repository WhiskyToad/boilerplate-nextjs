'use client';

import { useState, useCallback } from 'react';

interface PlaybackState {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
}

interface UsePlaybackStateReturn {
  state: PlaybackState;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
}

export function usePlaybackState(steps: any[]): UsePlaybackStateReturn {
  const [state, setState] = useState<PlaybackState>({
    currentStepIndex: 0,
    totalSteps: steps.length,
    isPlaying: false,
    speed: 1
  });

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex < prev.totalSteps - 1) {
        return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
      }
      return { ...prev, isPlaying: false }; // Stop at end
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex > 0) {
        return { ...prev, currentStepIndex: prev.currentStepIndex - 1 };
      }
      return prev;
    });
  }, []);

  const jumpToStep = useCallback((index: number) => {
    setState(prev => {
      if (index >= 0 && index < prev.totalSteps) {
        return { ...prev, currentStepIndex: index };
      }
      return prev;
    });
  }, []);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  return {
    state,
    nextStep,
    prevStep,
    jumpToStep,
    play,
    pause,
    setSpeed
  };
}
