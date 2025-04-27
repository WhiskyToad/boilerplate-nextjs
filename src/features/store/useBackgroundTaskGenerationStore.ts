import { create } from 'zustand';
import { supabase } from '@/features/supabase/client';
import { ProjectFeature } from '@/features/services/FeatureBuilder/useProjectFeatures';
import { LeanCanvas } from '@/features/services/Blueprints/useGenerateBlueprint';
import { AcceptanceCriterion } from '../services/FeatureBuilder/useFeatureTasks';
import { queryClient } from '../utils/queryClient';
// Types for generation status tracking
interface TaskGenerationStatus {
  isGenerating: boolean;
  isComplete: boolean;
  isError: boolean;
  error?: Error | null;
}

interface BackgroundTaskGenerationState {
  // Map of featureId -> generation status
  generationStatus: Record<string, TaskGenerationStatus>;
  
  // Start the background task generation process for a single feature
  generateTasksForFeature: (
    projectId: string, 
    feature: ProjectFeature, 
    leanCanvas: LeanCanvas
  ) => void;
  
  // Start the background task generation process for multiple features
  generateTasksForFeatures: (
    projectId: string, 
    features: ProjectFeature[], 
    leanCanvas: LeanCanvas
  ) => void;
  
  // Reset status for a specific feature
  resetStatus: (featureId: string) => void;
  
  // Check if a feature is currently being processed
  isFeatureProcessing: (featureId: string) => boolean;

  // Get recently completed features
  getCompletedFeatures: () => string[];

  // Mark features as acknowledged after UI update
  acknowledgeCompletedFeature: (featureId: string) => void;
}

// Default status for new tasks
const DEFAULT_GENERATION_STATUS: TaskGenerationStatus = {
  isGenerating: false,
  isComplete: false,
  isError: false,
  error: null
};

export const useBackgroundTaskGenerationStore = create<BackgroundTaskGenerationState>((set, get) => ({
  generationStatus: {},
  
  generateTasksForFeature: (projectId, feature, leanCanvas) => {
    // Set initial status
    set(state => ({
      generationStatus: {
        ...state.generationStatus,
        [feature.id]: {
          isGenerating: true,
          isComplete: false,
          isError: false,
          error: null
        }
      }
    }));
    
    // Set a safety timeout for this feature
    const safetyTimeout = setTimeout(() => {
      set(state => {
        if (state.generationStatus[feature.id]?.isGenerating) {
          return {
            generationStatus: {
              ...state.generationStatus,
              [feature.id]: {
                isGenerating: false,
                isComplete: false,
                isError: true,
                error: new Error("Task generation timed out after 2 minutes")
              }
            }
          };
        }
        return state;
      });
    }, 2 * 60 * 1000); // 2 minute timeout
    
    // Execute the generation asynchronously
    generateTasksForFeature(projectId, feature, leanCanvas)
      .then(() => {
        // Update status to complete
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            [feature.id]: {
              isGenerating: false,
              isComplete: true,
              isError: false
            }
          }
        }));
        
        // Invalidate relevant queries with multiple variations to ensure it's caught
        queryClient.invalidateQueries({ queryKey: ["featureTasks", projectId] });
        queryClient.invalidateQueries({ queryKey: ["featureTasks"] });
        
        // Force an immediate refetch with a slight delay to ensure DB consistency
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ["featureTasks", projectId] });
          // Also refetch project features and progress which depend on tasks
          queryClient.refetchQueries({ queryKey: ["projectFeatures", projectId] });
          queryClient.refetchQueries({ queryKey: ["projectProgress", projectId] });
        }, 300); // Small delay to ensure DB transaction completes
        
        console.log(`Background task generation completed for feature: ${feature.id}`);
      })
      .catch(error => {
        console.error(`Background task generation failed for feature ${feature.id}:`, error);
        
        // Update status to error
        set(state => ({
          generationStatus: {
            ...state.generationStatus,
            [feature.id]: {
              isGenerating: false,
              isComplete: false,
              isError: true,
              error: error instanceof Error ? error : new Error(String(error))
            }
          }
        }));
      })
      .finally(() => {
        // Clear the safety timeout
        clearTimeout(safetyTimeout);
      });
  },
  
  generateTasksForFeatures: (projectId, features, leanCanvas) => {
    // Process features sequentially to avoid overwhelming the API
    features.forEach(feature => {
      // Only generate tasks for features that don't have an existing status or have error status
      const currentStatus = get().generationStatus[feature.id];
      if (!currentStatus || currentStatus.isError) {
        get().generateTasksForFeature(projectId, feature, leanCanvas);
      }
    });
  },
  
  resetStatus: (featureId) => {
    set(state => ({
      generationStatus: {
        ...state.generationStatus,
        [featureId]: { ...DEFAULT_GENERATION_STATUS }
      }
    }));
  },
  
  isFeatureProcessing: (featureId) => {
    return get().generationStatus[featureId]?.isGenerating || false;
  },
  
  // Get all features that have completed generation but haven't been acknowledged
  getCompletedFeatures: () => {
    const state = get();
    return Object.entries(state.generationStatus)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, status]) => status.isComplete)
      .map(([featureId]) => featureId);
  },
  
  // Mark a feature as acknowledged after UI update
  acknowledgeCompletedFeature: (featureId) => {
    set(state => {
      const newStatus = { ...state.generationStatus };
      delete newStatus[featureId]; // Remove from status tracking once acknowledged
      return { generationStatus: newStatus };
    });
  }
}));

// Helper function to generate tasks for a single feature
async function generateTasksForFeature(
  projectId: string,
  feature: ProjectFeature,
  leanCanvas: LeanCanvas
): Promise<void> {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Generate a prompt for the AI
    const prompt = `
You are a project breakdown assistant.
Given this feature:

Feature: ${feature.title}
Description: ${feature.description || "N/A"}
Lean Canvas Problem: ${leanCanvas.problem}
Phase: ${feature.phase || "N/A"}

Generate:
1. A user story (As a [role], I want [feature] so that [benefit].).
2. 3-5 acceptance criteria (bullet points defining 'done').

Return ONLY valid JSON in this exact format:
{
  "userStory": "As a [role], I want [feature] so that [benefit].",
  "acceptanceCriteria": [
    { "text": "Criterion 1...", "isComplete": false },
    { "text": "Criterion 2...", "isComplete": false },
    { "text": "Criterion 3...", "isComplete": false }
  ]
}`;

    const response = await fetch("/api/openai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful project breakdown AI assistant outputting valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to generate details (status: ${response.status})`);
    }

    const generatedData = await response.json();

    // Basic validation for AI response format
    if (
      !generatedData.userStory ||
      !generatedData.acceptanceCriteria ||
      !Array.isArray(generatedData.acceptanceCriteria) ||
      generatedData.acceptanceCriteria.some((ac: AcceptanceCriterion) => typeof ac.text !== 'string' || typeof ac.isComplete !== 'boolean')
    ) {
      throw new Error("Invalid detail format received from AI.");
    }

    // Save the generated data
    const dataToSave = {
      feature_id: feature.id,
      project_id: projectId,
      user_id: userId,
      user_story: generatedData.userStory,
      acceptance_criteria: generatedData.acceptanceCriteria,
    };

    // Upsert based on feature_id
    const { error: saveError } = await supabase
      .from("feature_tasks")
      .upsert(dataToSave, { onConflict: "feature_id" });

    if (saveError) {
      throw new Error(`Details generated but failed to save: ${saveError.message}`);
    }
  } catch (error) {
    console.error(`Error generating tasks for feature ${feature.id}:`, error);
    throw error; // Re-throw to be caught by the calling function
  }
}
