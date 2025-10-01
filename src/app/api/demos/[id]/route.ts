import { NextRequest } from 'next/server'
import { withAuth, apiResponse, apiError, parseRequestBody } from '@/lib/api/middleware'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updateDemoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  recording_data: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  brand_settings: z.record(z.any()).optional(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  estimated_duration: z.number().min(0).optional(),
})

export const GET = withAuth(async (request: NextRequest, user: any, context: { params?: any }) => {
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
    .eq("id", context.params?.id)
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
  const body = await parseRequestBody(request)
  const validatedData = updateDemoSchema.parse(body)

  // First check if demo exists and belongs to user
  const { data: existingDemo, error: fetchError } = await supabase
    .from("demos")
    .select("id")
    .eq("id", context.params?.id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !existingDemo) {
    return apiError("Demo not found", 404)
  }

  const { data: demo, error } = await supabase
    .from("demos")
    .update(validatedData)
    .eq("id", context.params?.id)
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
  // First check if demo exists and belongs to user
  const { data: existingDemo, error: fetchError } = await supabase
    .from("demos")
    .select("id, title")
    .eq("id", context.params?.id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !existingDemo) {
    return apiError("Demo not found", 404)
  }

  const { error } = await supabase
    .from("demos")
    .delete()
    .eq("id", context.params?.id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting demo:", error)
    return apiError("Failed to delete demo", 500)
  }

  return apiResponse({ 
    message: `Demo "${existingDemo.title}" deleted successfully` 
  })
})