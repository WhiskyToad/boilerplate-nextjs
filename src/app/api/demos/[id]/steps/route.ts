import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, parseRequestBody } from '@/lib/api/middleware';
import { createClient } from '@supabase/supabase-js';
import * as z from 'zod';
import { Database } from '@/lib/supabase/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stepSchema = z.object({
  sequence_order: z.number(),
  step_type: z.string(),
  element_data: z.any(),
  annotations: z.any().optional(),
  interactions: z.any().optional(),
  timing_data: z.any().optional(),
});

const bulkStepsSchema = z.object({
  steps: z.array(stepSchema),
  replace_existing: z.boolean().optional().default(false),
});

export const GET = withAuth(async (request: NextRequest, user: any, context: { params?: { id?: string } }) => {
  const params = await context.params;
  const demoId = params?.id;

  if (!demoId) {
    return apiError('Demo ID is required', 400);
  }

  // Verify demo ownership
  const { data: demo, error: demoError } = await supabase
    .from('demos')
    .select('id, user_id')
    .eq('id', demoId)
    .eq('user_id', user.id)
    .single();

  if (demoError || !demo) {
    return apiError('Demo not found', 404);
  }

  // Get demo steps
  const { data: steps, error: stepsError } = await supabase
    .from('demo_steps')
    .select('*')
    .eq('demo_id', demoId)
    .order('sequence_order');

  if (stepsError) {
    return apiError('Failed to fetch demo steps', 500);
  }

  return apiResponse({ steps: steps || [] });
});

export const POST = withAuth(async (request: NextRequest, user: any, context: { params?: { id?: string } }) => {
  const params = await context.params;
  const demoId = params?.id;

  if (!demoId) {
    return apiError('Demo ID is required', 400);
  }

  // Verify demo ownership
  const { data: demo, error: demoError } = await supabase
    .from('demos')
    .select('id, user_id')
    .eq('id', demoId)
    .eq('user_id', user.id)
    .single();

  if (demoError || !demo) {
    return apiError('Demo not found', 404);
  }

  // Parse request body
  const body = await parseRequestBody(request) as any;
  
  if (!body.steps || !Array.isArray(body.steps)) {
    return apiError('Steps array is required', 400);
  }

  const { steps, replace_existing = false } = body;

  try {
    // If replacing existing, delete all current steps
    if (replace_existing) {
      await supabase
        .from('demo_steps')
        .delete()
        .eq('demo_id', demoId);
    }

    // Insert new steps - remove any client-generated id fields since database auto-generates UUIDs
    const stepsToInsert = steps.map((step: any) => {
      const { id, ...stepWithoutId } = step; // Remove id field
      return {
        ...stepWithoutId,
        demo_id: demoId,
        created_at: new Date().toISOString(),
      };
    });

    const { data: insertedSteps, error: insertError } = await supabase
      .from('demo_steps')
      .insert(stepsToInsert)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Update demo metadata
    await supabase
      .from('demos')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', demoId);

    return apiResponse({ 
      steps: insertedSteps,
      message: `${steps.length} steps saved successfully`
    });

  } catch (error) {
    console.error('Error saving demo steps:', error);
    const message = error instanceof Error ? error.message : 'Failed to save demo steps';
    return apiError(`Failed to save demo steps: ${message}`, 500);
  }
});