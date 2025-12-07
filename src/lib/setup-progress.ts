/**
 * Setup Progress Tracking
 *
 * Tracks which setup steps have been completed
 * Saves progress to .setup-progress.json (gitignored)
 */

import { promises as fs } from 'fs';
import path from 'path';

const PROGRESS_FILE = path.join(process.cwd(), '.setup-progress.json');

export type SetupStep =
  | 'supabase-account'
  | 'supabase-project'
  | 'supabase-keys'
  | 'supabase-sql-editor'
  | 'copy-sql'
  | 'supabase-db'
  | 'env-file'
  | 'env-supabase'
  | 'env-stripe'
  | 'stripe-account'
  | 'stripe-keys'
  | 'stripe-products'
  | 'site-config'
  | 'test-auth'
  | 'test-stripe';

export interface SetupProgress {
  completed: SetupStep[];
  lastUpdated: string;
}

/**
 * Load progress from file
 */
export async function loadProgress(): Promise<SetupProgress> {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      completed: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Save progress to file
 */
export async function saveProgress(progress: SetupProgress): Promise<void> {
  progress.lastUpdated = new Date().toISOString();
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/**
 * Mark a step as complete
 */
export async function completeStep(step: SetupStep): Promise<void> {
  const progress = await loadProgress();
  if (!progress.completed.includes(step)) {
    progress.completed.push(step);
    await saveProgress(progress);
  }
}

/**
 * Unmark a step (if you need to redo it)
 */
export async function uncompleteStep(step: SetupStep): Promise<void> {
  const progress = await loadProgress();
  progress.completed = progress.completed.filter(s => s !== step);
  await saveProgress(progress);
}

/**
 * Check if a step is complete
 */
export async function isStepComplete(step: SetupStep): Promise<boolean> {
  const progress = await loadProgress();
  return progress.completed.includes(step);
}

/**
 * Reset all progress
 */
export async function resetProgress(): Promise<void> {
  await saveProgress({
    completed: [],
    lastUpdated: new Date().toISOString(),
  });
}
