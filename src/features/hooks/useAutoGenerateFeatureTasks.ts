import { useEffect } from 'react';
import { useBackgroundTaskGenerationStore } from '@/features/store/useBackgroundTaskGenerationStore';
import { useBlueprintByProjectId } from '@/features/services/Blueprints/useBlueprintByProjectId';
import { ProjectFeature } from '@/features/services/FeatureBuilder/useProjectFeatures';

/**
 * Hook to automatically trigger task generation for a newly created feature
 * 
 * @param projectId The project ID
 * @param feature The feature that was just created
 * @param shouldGenerate Whether tasks should be generated (e.g., based on subscription)
 */
export function useAutoGenerateFeatureTasks(
  projectId: string,
  feature: ProjectFeature | null,
  shouldGenerate: boolean = true
) {
  const { generateTasksForFeature } = useBackgroundTaskGenerationStore();
  const { data: blueprint } = useBlueprintByProjectId(projectId);
  
  useEffect(() => {
    // Only proceed if we have all required data and should generate
    if (!shouldGenerate || !feature || !blueprint?.lean_canvas) return;
    
    // Start background generation for this specific feature
    generateTasksForFeature(projectId, feature, blueprint.lean_canvas);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature?.id]); // Only trigger when feature ID changes
  
  // No return value needed as this is a side-effect hook
}
