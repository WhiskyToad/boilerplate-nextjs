import { NextRequest } from 'next/server'
import { withAuth, apiResponse, apiError, parseRequestBody } from '@/lib/api/middleware'
import { createClient } from '@supabase/supabase-js'
import * as z from 'zod'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const createDemoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().optional(),
  recording_data: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  brand_settings: z.record(z.any()).optional(),
})

export const GET = withAuth(async (request: NextRequest, user: any, context: { params?: any }) => {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = parseInt(searchParams.get("limit") || "50")
  const offset = parseInt(searchParams.get("offset") || "0")

  let query = supabase
    .from("demos")
    .select(`
      id,
      title,
      description,
      status,
      thumbnail_url,
      total_steps,
      estimated_duration,
      created_at,
      updated_at
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && ["draft", "published", "archived"].includes(status)) {
    query = query.eq("status", status)
  }

  const { data: demos, error } = await query

  if (error) {
    console.error("Error fetching demos:", error)
    return apiError("Failed to fetch demos", 500)
  }

  return apiResponse({
    demos,
    pagination: {
      limit,
      offset,
      total: demos?.length || 0,
    },
  })
})

export const POST = withAuth(async (request: NextRequest, user: any, context: { params?: any }) => {
  const body = await parseRequestBody(request)
  
  // Simple validation instead of Zod for now
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    return apiError('Title is required', 400);
  }
  
  const validatedData = {
    title: body.title.trim(),
    description: body.description || '',
    recording_data: body.recording_data || {},
    settings: body.settings || {},
    brand_settings: body.brand_settings || {}
  }

  const { data: demo, error } = await supabase
    .from("demos")
    .insert({
      user_id: user.id,
      title: validatedData.title,
      description: validatedData.description,
      recording_data: validatedData.recording_data || {},
      settings: validatedData.settings || {},
      brand_settings: validatedData.brand_settings || {},
      status: "draft",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating demo:", error)
    return apiError("Failed to create demo", 500)
  }

  return apiResponse({ demo }, "Demo created successfully", 201)
})