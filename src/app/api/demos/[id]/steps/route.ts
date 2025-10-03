import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api/middleware';
import { apiResponse, apiError } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

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

export const GET = withAuth(async (request: NextRequest, user: any, context: { params: { id: string } }) => {
  const supabase = await createClient();
  const demoId = context.params.id;

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

export const POST = withAuth(async (request: NextRequest, user: any, context: { params: { id: string } }) => {
  const supabase = await createClient();
  const demoId = context.params.id;

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
  let body;
  try {
    body = await request.json();
    bulkStepsSchema.parse(body);
  } catch (error) {
    return apiError('Invalid request data', 400);
  }

  const { steps, replace_existing } = body;

  try {
    // If replacing existing, delete all current steps
    if (replace_existing) {
      await supabase
        .from('demo_steps')
        .delete()
        .eq('demo_id', demoId);
    }

    // Insert new steps
    const stepsToInsert = steps.map((step: any) => ({
      ...step,
      demo_id: demoId,
      created_at: new Date().toISOString(),
    }));

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
    return apiError('Failed to save demo steps', 500);
  }
});