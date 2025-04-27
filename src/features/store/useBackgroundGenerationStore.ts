import { create } from 'zustand';
import { supabase } from '@/features/supabase/client';
import { ProjectFormInput } from '@/features/types';
import { Phase } from '@/features/FourC/types';
import { queryClient } from '@/features/utils/queryClient';
import { useBlueprintGeneration } from '@/features/generation/blueprint/useBlueprintGeneration';
import { useFourCGeneration } from '@/features/generation/fourC/useFourCGeneration';
import { useFeatureGeneration } from '@/features/generation/features/useFeatureGeneration';
import { useTaskGeneration } from '@/features/generation/tasks/useTaskGeneration';

interface BackgroundGenerationState {
  // Track generation status
  generationStatus: GenerationStatus;
  
  // Start the background generation process
  startGeneration: (userId: string, projectId: string, projectData: ProjectFormInput, isPaid?: boolean) => void;
  
  // Reset status
  resetStatus: (projectId: string) => void;
}

// Types for generation status tracking with individual steps
type GenerationStatus = {
  blueprintGenerating: boolean;
  fourcGenerating: boolean;
  fundamentalsGenerating: boolean;
  coreGenerating: boolean;
  featuresGenerating: boolean;
  tasksGenerating: boolean;
  isComplete: boolean;
  isError: boolean;
  error?: Error | null;
  progress: number; // 0-100 percentage of completion
};

// Default state
const DEFAULT_GENERATION_STATUS: GenerationStatus = {
  blueprintGenerating: false,
  fourcGenerating: false,
  fundamentalsGenerating: false,
  coreGenerating: false,
  featuresGenerating: false,
  tasksGenerating: false,
  isComplete: false,
  isError: false,
  error: null,
  progress: 0
};

export const useBackgroundGenerationStore = create<BackgroundGenerationState>((set) => ({
  generationStatus: { ...DEFAULT_GENERATION_STATUS },
  
  startGeneration: (userId, projectId, projectData, isPaid = false) => {
    // Set a safety timeout to reset status if generation gets stuck
    const safetyTimeout = setTimeout(() => {
      set(state => {
        if (!state.generationStatus.isComplete && !state.generationStatus.isError) {
          return {
            generationStatus: {
              ...state.generationStatus,
              blueprintGenerating: false,
              fourcGenerating: false,
              fundamentalsGenerating: false,
              coreGenerating: false,
              featuresGenerating: false,
              tasksGenerating: false,
              isError: true,
              error: new Error("Generation timed out after 15 minutes")
            }
          };
        }
        return state;
      });
    }, 15 * 60 * 1000); // 15 minute timeout for the entire process
    
    // Initialize the state at the start
    set(() => ({
      generationStatus: {
        ...DEFAULT_GENERATION_STATUS,
        blueprintGenerating: true,
        progress: 5
      }
    }));
    
    // Execute the generation pipeline asynchronously
    (async () => {
      try {
        // --- STEP 1: Generate Blueprint ---
        // Always allow blueprint generation for the "WOW" moment
        console.log(`Starting blueprint generation for project ${projectId}`);
        const leanCanvas = await useBlueprintGeneration.getState().generateBlueprint(userId, projectId, projectData);
        
        // For free users, we generate a more limited experience
        if (!isPaid) {
          // Update progress - move directly to 4C for free users
          set(state => ({
            generationStatus: {
              ...state.generationStatus,
              blueprintGenerating: false,
              fourcGenerating: true,
              progress: 20
            }
          }));
          
          console.log(`Starting 4C generation for project ${projectId} (limited for free user)`);
          const phases = ["Capture"] as const; // Only generate capture phase for free users
          //@ts-expect-error - cba
          await useFourCGeneration.getState().generateFourC(userId, projectId, phases, leanCanvas);
          
          // Update progress - proceed to fundamental features
          set(state => ({
            generationStatus: {
              ...state.generationStatus,
              fourcGenerating: false,
              fundamentalsGenerating: true,
              progress: 40
            }
          }));
          
          // Generate fundamental features for free users
          console.log(`Adding fundamental features for project ${projectId}`);
          await useFeatureGeneration.getState().generateFundamentalFeatures(userId, projectId);
          
          // Update progress - proceed to core features
          set(state => ({
            generationStatus: {
              ...state.generationStatus,
              fundamentalsGenerating: false,
              coreGenerating: true,
              progress: 60
            }
          }));
          
          console.log(`Generating core features for project ${projectId}`);
          await useFeatureGeneration.getState().generateCoreFeatures(userId, projectId, leanCanvas, projectData, isPaid);
          
          // Update status to show complete
          set({
            generationStatus: {
              blueprintGenerating: false,
              fundamentalsGenerating: false,
              fourcGenerating: false,
              coreGenerating: false, 
              featuresGenerating: false,
              tasksGenerating: false,
              isComplete: true,
              isError: false,
              error: null,
              progress: 100
            }
          });
          
          // Final cache refresh
          invalidateAllCaches(projectId);
          
          console.log(`Background generation completed for free user project: ${projectId}`);
          return;
        }
        
        // --- STEP 2: Generate 4C Framework --- (For paid users, follow correct order)
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            blueprintGenerating: false,
            fourcGenerating: true,
            progress: 20
          }
        }));
        
        console.log(`Starting 4C generation for project ${projectId}`);
        const phases = ["Capture", "Commit", "Convert", "Continue"] as const;
        //@ts-expect-error - cba
        await useFourCGeneration.getState().generateFourC(userId, projectId, phases, leanCanvas);
        
        // --- STEP 3: Generate Fundamental Features ---
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            fourcGenerating: false,
            fundamentalsGenerating: true,
            progress: 40
          }
        }));
        
        console.log(`Adding fundamental features for project ${projectId}`);
        await useFeatureGeneration.getState().generateFundamentalFeatures(userId, projectId);
        
        // --- STEP 4: Generate Core Features ---
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            fundamentalsGenerating: false,
            coreGenerating: true,
            progress: 60
          }
        }));
        
        console.log(`Generating core features for project ${projectId}`);
        await useFeatureGeneration.getState().generateCoreFeatures(userId, projectId, leanCanvas, projectData);
        
        // --- STEP 5 & 6: Generate Phase-specific Features & Tasks ---
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            coreGenerating: false, 
            featuresGenerating: true,
            progress: 80
          }
        }));
        
        // Check total feature count before generating more features
        const { count } = await supabase
          .from("project_features")
          .select("*", { count: "exact", head: true })
          .eq("project_id", projectId);
          
        const existingFeatureCount = count || 0;
        const maxDesiredFeatures = 12;
        
        if (existingFeatureCount < maxDesiredFeatures) {
          console.log(`Starting phase feature generation for project ${projectId}`);
          await useFeatureGeneration.getState().generateFeatures(
            userId, 
            projectId, 
            leanCanvas, 
            phases as unknown as Phase[]
          );
        }
        
        // Move to task generation
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            featuresGenerating: false,
            tasksGenerating: true,
            progress: 90
          }
        }));
        
        console.log(`Starting task generation for MVP features in project ${projectId}`);
        
        // Fetch all MVP features to get the full set
        const { data: allFeatures } = await supabase
          .from("project_features")
          .select("*")
          .eq("project_id", projectId)
          .eq("is_mvp", true);
        
        if (allFeatures && allFeatures.length > 0) {
          await useTaskGeneration.getState().generateTasksForFeatures(
            projectId, 
            allFeatures, 
            leanCanvas
          );
        }
        
        // Update status to show all complete
        set({
          generationStatus: {
            blueprintGenerating: false,
            fundamentalsGenerating: false,
            fourcGenerating: false,
            coreGenerating: false, 
            featuresGenerating: false,
            tasksGenerating: false,
            isComplete: true,
            isError: false,
            error: null,
            progress: 100
          }
        });
        
        // Final cache refresh
        invalidateAllCaches(projectId);
        
        console.log(`Background generation completed for project: ${projectId}`);
      } catch (error) {
        console.error(`Background generation failed for project ${projectId}:`, error);
        
        // Update state to indicate error
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            blueprintGenerating: false,
            fundamentalsGenerating: false,
            fourcGenerating: false,
            coreGenerating: false,
            featuresGenerating: false,
            tasksGenerating: false,
            isComplete: false,
            isError: true,
            error: error instanceof Error ? error : new Error(String(error)),
            progress: state.generationStatus.progress // Keep the progress where it failed
          }
        }));
      } finally {
        // Clear the safety timeout
        clearTimeout(safetyTimeout);
      }
    })();
  },
  
  resetStatus: () => {
    set({
      generationStatus: { ...DEFAULT_GENERATION_STATUS }
    });
    
    // Reset all individual stores
    useBlueprintGeneration.getState().reset();
    useFourCGeneration.getState().reset();
    useFeatureGeneration.getState().reset();
    useTaskGeneration.getState().reset();
  },
}));

// Helper to invalidate all relevant caches
function invalidateAllCaches(projectId: string) {
  // First batch - immediate invalidations
  queryClient.invalidateQueries({ queryKey: ["blueprint", projectId] });
  queryClient.invalidateQueries({ queryKey: ["projectFeatures", projectId] });
  queryClient.invalidateQueries({ queryKey: ["featureTasks", projectId] });
  queryClient.invalidateQueries({ queryKey: ["projectProgress", projectId] });
  
  // Second batch - delayed refetch to ensure DB consistency
  setTimeout(() => {
    queryClient.refetchQueries({ queryKey: ["featureTasks", projectId] });
    queryClient.refetchQueries({ queryKey: ["projectFeatures", projectId] });
    queryClient.refetchQueries({ queryKey: ["projectProgress", projectId] });
  }, 2000);
}
