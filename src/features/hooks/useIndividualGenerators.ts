import { useCallback } from 'react';
import { useBlueprintGeneration } from '@/features/generation/blueprint/useBlueprintGeneration';
import { useFourCGeneration } from '@/features/generation/fourC/useFourCGeneration';
import { useFeatureGeneration } from '@/features/generation/features/useFeatureGeneration';
import { useTaskGeneration } from '@/features/generation/tasks/useTaskGeneration';
import { ProjectFeature } from '@/features/services/FeatureBuilder/useProjectFeatures';
import { ProjectFormInput } from '@/features/types';
import { LeanCanvas } from '@/features/services/Blueprints/useGenerateBlueprint';
import { Phase } from '@/features/FourC/types';
import { useAuthStore } from '../store/authStore';
import { useSubscription } from './useSubscription';

/**
 * Custom hook to access individual generation functions
 */
export function useIndividualGenerators() {
  const { user } = useAuthStore();
  const { isPaid } = useSubscription(); // Get subscription status
  const userId = user?.id;
  
  // Blueprint generation
  const generateBlueprint = useCallback((projectId: string, formData: ProjectFormInput) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    return useBlueprintGeneration.getState().generateBlueprint(userId, projectId, formData);
  }, [userId]);
  
  // 4C framework generation
  const generateFourC = useCallback((projectId: string, phases: readonly Phase[], leanCanvas: LeanCanvas) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    return useFourCGeneration.getState().generateFourC(userId, projectId, phases as Phase[], leanCanvas);
  }, [userId]);
  
  const generateFourCPhase = useCallback((projectId: string, phase: Phase, leanCanvas: LeanCanvas) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    return useFourCGeneration.getState().generateSinglePhase(userId, projectId, phase, leanCanvas);
  }, [userId]);
  
  // Feature generation with integrated prioritization
  const generateFeatures = useCallback((projectId: string, leanCanvas: LeanCanvas, phases: Phase[]) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    return useFeatureGeneration.getState().generateFeatures(userId, projectId, leanCanvas, phases, isPaid);
  }, [userId, isPaid]);
  
  const generateFeaturesForPhase = useCallback((projectId: string, leanCanvas: LeanCanvas, phase: Phase, maxFeatures?: number) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    
    // For free users, enforce stricter limits
    const effectiveMaxFeatures = isPaid ? maxFeatures : Math.min(maxFeatures || 1, 1);
    
    return useFeatureGeneration.getState().generateFeaturesForPhase(
      userId, 
      projectId, 
      leanCanvas, 
      phase, 
      effectiveMaxFeatures
    );
  }, [userId, isPaid]);
  
  // Core feature generation
  const generateCoreFeatures = useCallback((projectId: string, leanCanvas: LeanCanvas, projectContext: ProjectFormInput) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    return useFeatureGeneration.getState().generateCoreFeatures(userId, projectId, leanCanvas, projectContext, isPaid);
  }, [userId, isPaid]);
  
  // Fundamental features generation
  const generateFundamentalFeatures = useCallback((projectId: string) => {
    if (!userId) return Promise.reject(new Error('User not authenticated'));
    return useFeatureGeneration.getState().generateFundamentalFeatures(userId, projectId);
  }, [userId]);
  
  // Task generation
  const generateTasksForFeatures = useCallback((projectId: string, features: ProjectFeature[], leanCanvas: LeanCanvas) => {
    return useTaskGeneration.getState().generateTasksForFeatures(projectId, features, leanCanvas);
  }, []);
  
  const generateTaskForFeature = useCallback((projectId: string, feature: ProjectFeature, leanCanvas: LeanCanvas) => {
    return useTaskGeneration.getState().generateTaskForFeature(projectId, feature, leanCanvas);
  }, []);
  
  // Status selectors
  const blueprintStatus = useBlueprintGeneration(state => ({
    isGenerating: state.isGenerating,
    isComplete: state.isComplete,
    isError: state.isError,
    error: state.error
  }));
  
  const fourCStatus = useFourCGeneration(state => ({
    isGenerating: state.isGenerating,
    isComplete: state.isComplete,
    isError: state.isError,
    error: state.error,
    currentPhase: state.currentPhase
  }));
  
  const featuresStatus = useFeatureGeneration(state => ({
    isGenerating: state.isGenerating,
    isComplete: state.isComplete,
    isError: state.isError,
    error: state.error,
    currentPhase: state.currentPhase
  }));
  
  const taskStatus = useTaskGeneration(state => ({
    isGenerating: state.isGenerating,
    isComplete: state.isComplete,
    isError: state.isError,
    error: state.error,
    currentFeatureId: state.currentFeatureId
  }));
  
  return {
    // Generation functions
    generateBlueprint,
    generateFourC,
    generateFourCPhase,
    generateFeatures,
    generateFeaturesForPhase,
    generateCoreFeatures,
    generateFundamentalFeatures,
    generateTasksForFeatures,
    generateTaskForFeature,
    
    // Status objects
    blueprintStatus,
    fourCStatus,
    featuresStatus,
    taskStatus,
    
    // Add subscription status for convenience
    isPaid,
  };
}
