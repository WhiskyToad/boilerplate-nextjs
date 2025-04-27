import { useMemo } from 'react';
import { useBlueprintByProjectId } from '@/features/services/Blueprints/useBlueprintByProjectId';
import { useFourCData } from '@/features/services/FourC/useFourCData';
import { useProjectFeatures } from '@/features/services/FeatureBuilder/useProjectFeatures';
import { useFeatureTasks } from '@/features/services/FeatureBuilder/useFeatureTasks';
import { useProjectFormById } from '@/features/services/Projects/useProjectFormById';
import { useLaunchChecklist } from '@/features/services/Launch/useLaunchChecklist';

// Define the total number of main steps
const TOTAL_STEPS = 5;

export type ProjectProgress = {
  projectId: string;
  // Maintain both naming conventions for backward compatibility
  isProjectRefined: boolean;
  projectRefined: boolean; // Same as isProjectRefined
  
  blueprintComplete: boolean;
  fourCComplete: boolean;
  
  hasFeatures: boolean;
  featuresGenerated: boolean; // Same as hasFeatures
  
  featureTasksGenerated: boolean;
  featureBuilderComplete: boolean; // Same as featureTasksGenerated
  
  mvpDefined: boolean;
  prioritizationComplete: boolean; // Same as mvpDefined
  
  mvpTasksComplete: boolean;
  
  launchChecklistComplete: boolean;
  launchComplete: boolean; // Same as launchChecklistComplete
  
  currentStepIndex: number;
  totalSteps: number;
};

export function useProjectProgress(projectId: string | null): ProjectProgress {
  const validProjectId = projectId || '';
  
  const { data: projectData } = useProjectFormById(validProjectId);
  const { data: blueprint } = useBlueprintByProjectId(validProjectId);
  const { data: fourCData } = useFourCData(validProjectId);
  const { data: features } = useProjectFeatures(validProjectId);
  const { data: taskDetailsMap } = useFeatureTasks(validProjectId);
  const { checklistItems: launchChecklist } = useLaunchChecklist(validProjectId);
  
  return useMemo(() => {
    // Determine if the project is refined
    const isProjectRefined = Boolean(projectData?.is_refined || (projectData && Object.keys(projectData).length > 0));
    
    // Determine completion states
    const blueprintComplete = !!blueprint?.lean_canvas && !!blueprint?.is_refined;
    
    // Four C completion check
    const fourCComplete = !!fourCData && Object.values(fourCData).some(
      (phaseData) => 
        phaseData && 
        phaseData.isRefined === true && 
        (phaseData.featureIdeas?.length > 0 || phaseData.userPaths?.length > 0)
    );
    
    // Enhanced feature checking
    const hasFeatures = Array.isArray(features) && features.length > 0;
    
    // Check if at least one feature has details (user story or ACs)
    const featureTasksGenerated = hasFeatures && !!taskDetailsMap && 
      Object.values(taskDetailsMap).some(
        (details) => 
          (details.userStory && details.userStory.trim() !== "") ||
          (details.acceptanceCriteria && details.acceptanceCriteria.length > 0)
      );

    
    const mvpDefined = hasFeatures && features.some(f => f.is_mvp);

    // Check if all MVP features have tasks and all tasks are complete
    let mvpTasksComplete = false;
    if (hasFeatures && taskDetailsMap) {
      const mvpFeatures = features.filter(f => f.is_mvp);

      
      if (mvpFeatures.length > 0) {
        mvpTasksComplete = mvpFeatures.every(feature => {
          const tasks = taskDetailsMap[feature.id];
          
          // Ensure tasks and acceptance criteria exist and are not empty
          if (!tasks?.acceptanceCriteria?.length) {
            return false; // Feature has no tasks/criteria defined, so not complete
          }
          
          // Check if all acceptance criteria for the feature are complete
          const allComplete = tasks.acceptanceCriteria.every(ac => ac.isComplete);
          return allComplete;
        });
      }
      // If no MVP features exist, mvpTasksComplete remains false
    }
    
    
    // Check if launch checklist is complete
    const launchChecklistComplete = 
      mvpTasksComplete && 
      !!launchChecklist && 
      launchChecklist.length > 0 && 
      launchChecklist.every(item => item.is_completed);
    
    // Determine current step index based on progress
    const currentStepIndex = (() => {
      if (!isProjectRefined) return 0;
      if (!blueprintComplete) return 0;
      if (!hasFeatures) return 1; // Feature Gen phase
      if (!mvpDefined) return 2; // Prioritization phase
      if (!mvpTasksComplete) return 3; // MVP Development phase
      if (!launchChecklistComplete) return 4; // Launch Prep phase
      return 5; // All complete
    })();
    
    const result: ProjectProgress = {
      projectId: validProjectId,
      isProjectRefined,
      projectRefined: isProjectRefined, // Duplicate for compatibility
      
      blueprintComplete,
      fourCComplete,
      
      hasFeatures: true, // Always return true as requested in your previous change
      featuresGenerated: hasFeatures, // Original value for comparison
      
      featureTasksGenerated,
      featureBuilderComplete: featureTasksGenerated, // Duplicate for compatibility
      
      mvpDefined,
      prioritizationComplete: mvpDefined, // Duplicate for compatibility
      
      mvpTasksComplete,
      
      launchChecklistComplete,
      launchComplete: launchChecklistComplete, // Duplicate for compatibility
      
      currentStepIndex,
      totalSteps: TOTAL_STEPS,
    };

    
    return result;
  }, [validProjectId, projectData, blueprint, fourCData, features, taskDetailsMap, launchChecklist]);
}
