import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { Database } from "@/lib/supabase/types";

const createStepSchema = z.object({
  sequence_order: z.number().min(0),
  step_type: z.enum(["interaction", "annotation", "pause"]).default("interaction"),
  element_data: z.record(z.any()),
  annotations: z.record(z.any()).optional(),
  interactions: z.record(z.any()).optional(),
  screenshot_url: z.string().url().optional().or(z.literal("")),
  dom_snapshot: z.record(z.any()).optional(),
  timing_data: z.record(z.any()).optional(),
});

const createBulkStepsSchema = z.object({
  steps: z.array(createStepSchema),
  replace_existing: z.boolean().default(false),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({
      cookies,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First verify the demo belongs to the user
    const { data: demo, error: demoError } = await supabase
      .from("demos")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (demoError || !demo) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    const { data: steps, error } = await supabase
      .from("demo_steps")
      .select("*")
      .eq("demo_id", params.id)
      .order("sequence_order", { ascending: true });

    if (error) {
      console.error("Error fetching demo steps:", error);
      return NextResponse.json(
        { error: "Failed to fetch demo steps" },
        { status: 500 }
      );
    }

    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Unexpected error in GET /api/demos/[id]/steps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({
      cookies,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First verify the demo belongs to the user
    const { data: demo, error: demoError } = await supabase
      .from("demos")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (demoError || !demo) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Check if this is a bulk operation or single step
    if (body.steps && Array.isArray(body.steps)) {
      // Bulk steps creation
      const validatedData = createBulkStepsSchema.parse(body);
      
      // If replace_existing is true, delete all existing steps first
      if (validatedData.replace_existing) {
        await supabase
          .from("demo_steps")
          .delete()
          .eq("demo_id", params.id);
      }

      const stepsToInsert = validatedData.steps.map(step => ({
        demo_id: params.id,
        ...step,
        element_data: step.element_data || {},
        annotations: step.annotations || {},
        interactions: step.interactions || {},
        timing_data: step.timing_data || {},
      }));

      const { data: steps, error } = await supabase
        .from("demo_steps")
        .insert(stepsToInsert)
        .select();

      if (error) {
        console.error("Error creating demo steps:", error);
        return NextResponse.json(
          { error: "Failed to create demo steps" },
          { status: 500 }
        );
      }

      return NextResponse.json({ steps }, { status: 201 });
    } else {
      // Single step creation
      const validatedData = createStepSchema.parse(body);

      const { data: step, error } = await supabase
        .from("demo_steps")
        .insert({
          demo_id: params.id,
          ...validatedData,
          element_data: validatedData.element_data || {},
          annotations: validatedData.annotations || {},
          interactions: validatedData.interactions || {},
          timing_data: validatedData.timing_data || {},
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating demo step:", error);
        return NextResponse.json(
          { error: "Failed to create demo step" },
          { status: 500 }
        );
      }

      return NextResponse.json({ step }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Unexpected error in POST /api/demos/[id]/steps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}