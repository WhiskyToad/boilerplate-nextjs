import { NextRequest } from 'next/server';
import { withAuth, apiResponse, apiError, parseRequestBody } from '@/lib/api/middleware';
import { createClient } from '@supabase/supabase-js';
import * as z from 'zod';
import { Database } from '@/lib/supabase/types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const updateStepSchema = z.object({
  sequence_order: z.number().min(0).optional(),
  step_type: z.enum(["interaction", "annotation", "pause"]).optional(),
  element_data: z.record(z.any()).optional(),
  annotations: z.record(z.any()).optional(),
  interactions: z.record(z.any()).optional(),
  screenshot_url: z.string().url().optional().or(z.literal("")),
  dom_snapshot: z.record(z.any()).optional(),
  timing_data: z.record(z.any()).optional(),
});

async function verifyDemoOwnership(demoId: string, userId: string) {
  const { data: demo, error } = await supabase
    .from("demos")
    .select("id")
    .eq("id", demoId)
    .eq("user_id", userId)
    .single();

  return { exists: !!demo && !error, demo };
}

export const GET = withAuth(async (request: NextRequest, user: any, context: { params: { id: string; stepId: string } }) => {
  const params = await context.params;
  const demoId = params.id;
  const stepId = params.stepId;

  // Verify demo ownership
  const { exists } = await verifyDemoOwnership(demoId, user.id);
  if (!exists) {
    return apiError('Demo not found', 404);
  }

  const { data: step, error } = await supabase
    .from("demo_steps")
    .select("*")
    .eq("id", stepId)
    .eq("demo_id", demoId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return apiError('Step not found', 404);
    }

    console.error("Error fetching demo step:", error);
    return apiError('Failed to fetch demo step', 500);
  }

  return apiResponse({ step });
});

export const PATCH = withAuth(async (request: NextRequest, user: any, context: { params: { id: string; stepId: string } }) => {
  const params = await context.params;
  const demoId = params.id;
  const stepId = params.stepId;

  // Verify demo ownership
  const { exists } = await verifyDemoOwnership(demoId, user.id);
  if (!exists) {
    return apiError('Demo not found', 404);
  }

  const body = await parseRequestBody(request);

  try {
    const validatedData = updateStepSchema.parse(body);

    // Check if step exists
    const { data: existingStep, error: fetchError } = await supabase
      .from("demo_steps")
      .select("id")
      .eq("id", stepId)
      .eq("demo_id", demoId)
      .single();

    if (fetchError || !existingStep) {
      return apiError('Step not found', 404);
    }

    const { data: step, error } = await supabase
      .from("demo_steps")
      .update(validatedData)
      .eq("id", stepId)
      .eq("demo_id", demoId)
      .select()
      .single();

    if (error) {
      console.error("Error updating demo step:", error);
      return apiError('Failed to update demo step', 500);
    }

    return apiResponse({ step });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid input', 400, 'VALIDATION_ERROR', error.errors);
    }
    throw error;
  }
});

export const DELETE = withAuth(async (request: NextRequest, user: any, context: { params: { id: string; stepId: string } }) => {
  const params = await context.params;
  const demoId = params.id;
  const stepId = params.stepId;

  // Verify demo ownership
  const { exists } = await verifyDemoOwnership(demoId, user.id);
  if (!exists) {
    return apiError('Demo not found', 404);
  }

  // Check if step exists
  const { data: existingStep, error: fetchError } = await supabase
    .from("demo_steps")
    .select("id, sequence_order")
    .eq("id", stepId)
    .eq("demo_id", demoId)
    .single();

  if (fetchError || !existingStep) {
    return apiError('Step not found', 404);
  }

  const { error } = await supabase
    .from("demo_steps")
    .delete()
    .eq("id", stepId)
    .eq("demo_id", demoId);

  if (error) {
    console.error("Error deleting demo step:", error);
    return apiError('Failed to delete demo step', 500);
  }

  return apiResponse(
    { message: `Step ${existingStep.sequence_order} deleted successfully` },
    `Step ${existingStep.sequence_order} deleted successfully`
  );
});