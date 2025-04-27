import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';

interface BlueprintGenerationState {
  // Map of projectId -> status
  generationStatus: Record<string, GenerationStatus>;
  startGeneration: (projectId: string) => void;
  completeGeneration: (projectId: string) => void;
  setGenerationError: (projectId: string) => void;
  resetGeneration: (projectId: string) => void;
  getStatus: (projectId: string) => GenerationStatus;
}

export const useBlueprintGenerationStore = create<BlueprintGenerationState>()(
  persist(
    (set, get) => ({
      generationStatus: {},
      
      startGeneration: (projectId: string) => 
        set((state) => ({
          generationStatus: { 
            ...state.generationStatus, 
            [projectId]: 'generating' 
          }
        })),
      
      completeGeneration: (projectId: string) => 
        set((state) => ({
          generationStatus: { 
            ...state.generationStatus, 
            [projectId]: 'complete' 
          }
        })),
      
      setGenerationError: (projectId: string) => 
        set((state) => ({
          generationStatus: { 
            ...state.generationStatus, 
            [projectId]: 'error' 
          }
        })),
      
      resetGeneration: (projectId: string) => 
        set((state) => {
          const newStatus = { ...state.generationStatus };
          delete newStatus[projectId];
          return { generationStatus: newStatus };
        }),
      
      getStatus: (projectId: string) => {
        return get().generationStatus[projectId] || 'idle';
      },
    }),
    {
      name: 'blueprint-generation-storage',
    }
  )
);
