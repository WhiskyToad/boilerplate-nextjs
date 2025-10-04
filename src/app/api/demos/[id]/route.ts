import { NextRequest } from 'next/server'
import { withAuth, apiResponse, apiError, parseRequestBody } from '@/lib/api/middleware'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const GET = withAuth(async (request: NextRequest, user: any, context: { params?: any }) => {
  const params = await context.params;
  const demoId = params?.id;
  
  if (!demoId) {
    return apiError('Demo ID is required', 400);
  }
  
  const { data: demo, error } = await supabase
    .from("demos")
    .select(`
      *,
      demo_steps(
        id,
        sequence_order,
        step_type,
        element_data,
        annotations,
        interactions,
        screenshot_url,
        timing_data,
        created_at
      )
    `)
    .eq("id", demoId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return apiError("Demo not found", 404)
    }
    console.error("Error fetching demo:", error)
    return apiError("Failed to fetch demo", 500)
  }

  return apiResponse({ demo })
})

export const PATCH = withAuth(async (request: NextRequest, user: any, context: { params?: any }) => {
  const params = await context.params;
  const demoId = params?.id;
  
  if (!demoId) {
    return apiError('Demo ID is required', 400);
  }
  
  const body = await parseRequestBody(request)
  
  // Simple validation
  const validatedData: any = {};
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      return apiError('Title must be a non-empty string', 400);
    }
    validatedData.title = body.title.trim();
  }
  if (body.description !== undefined) validatedData.description = body.description;
  if (body.status !== undefined) {
    if (!['draft', 'published', 'archived'].includes(body.status)) {
      return apiError('Invalid status', 400);
    }
    validatedData.status = body.status;
  }
  if (body.recording_data !== undefined) validatedData.recording_data = body.recording_data;
  if (body.settings !== undefined) validatedData.settings = body.settings;
  if (body.brand_settings !== undefined) validatedData.brand_settings = body.brand_settings;
  if (body.thumbnail_url !== undefined) validatedData.thumbnail_url = body.thumbnail_url;
  if (body.estimated_duration !== undefined) validatedData.estimated_duration = body.estimated_duration;
  if (body.total_steps !== undefined) validatedData.total_steps = body.total_steps;

  // First check if demo exists and belongs to user
  const { data: existingDemo, error: fetchError } = await supabase
    .from("demos")
    .select("id")
    .eq("id", demoId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !existingDemo) {
    return apiError("Demo not found", 404)
  }

  const { data: demo, error } = await supabase
    .from("demos")
    .update(validatedData)
    .eq("id", demoId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating demo:", error)
    return apiError("Failed to update demo", 500)
  }

  return apiResponse({ demo }, "Demo updated successfully")
})

export const DELETE = withAuth(async (request: NextRequest, user: any, context: { params?: any }) => {
  const params = await context.params;
  const demoId = params?.id;
  
  if (!demoId) {
    return apiError('Demo ID is required', 400);
  }
  
  // First check if demo exists and belongs to user
  const { data: existingDemo, error: fetchError } = await supabase
    .from("demos")
    .select("id, title")
    .eq("id", demoId)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !existingDemo) {
    return apiError("Demo not found", 404)
  }

  const { error } = await supabase
    .from("demos")
    .delete()
    .eq("id", demoId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting demo:", error)
    return apiError("Failed to delete demo", 500)
  }

  return apiResponse({ 
    message: `Demo "${existingDemo.title}" deleted successfully` 
  })
})