// Playback configuration types for saving to database

export interface PlaybackConfig {
  zoom?: {
    enabled: boolean;
    scale: number; // 1.0 = no zoom, 2.0 = 2x zoom, etc.
    focusX: number; // Percentage (0-100) of image width to focus on
    focusY: number; // Percentage (0-100) of image height to focus on
  };
  timing?: {
    duration: number; // How long to show this step (milliseconds)
    transitionDuration: number; // How long zoom/pan transition takes
  };
}

export interface StepAnnotations {
  text?: string; // Human-readable step description
  title?: string; // Step title
  playback?: PlaybackConfig; // Playback configuration
  ai_generated?: boolean;
}
