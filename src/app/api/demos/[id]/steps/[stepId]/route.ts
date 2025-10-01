import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { Database } from "@/lib/supabase/types";

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

async function verifyDemoOwnership(supabase: any, demoId: string, userId: string) {
  const { data: demo, error } = await supabase
    .from("demos")
    .select("id")
    .eq("id", demoId)
    .eq("user_id", userId)
    .single();

  return { exists: !!demo && !error, demo };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
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

    // Verify demo ownership
    const { exists } = await verifyDemoOwnership(supabase, params.id, session.user.id);
    if (!exists) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    const { data: step, error } = await supabase
      .from("demo_steps")
      .select("*")
      .eq("id", params.stepId)
      .eq("demo_id", params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Step not found" },
          { status: 404 }
        );
      }

      console.error("Error fetching demo step:", error);
      return NextResponse.json(
        { error: "Failed to fetch demo step" },
        { status: 500 }
      );
    }

    return NextResponse.json({ step });
  } catch (error) {
    console.error("Unexpected error in GET /api/demos/[id]/steps/[stepId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
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

    // Verify demo ownership
    const { exists } = await verifyDemoOwnership(supabase, params.id, session.user.id);
    if (!exists) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateStepSchema.parse(body);

    // Check if step exists
    const { data: existingStep, error: fetchError } = await supabase
      .from("demo_steps")
      .select("id")
      .eq("id", params.stepId)
      .eq("demo_id", params.id)
      .single();

    if (fetchError || !existingStep) {
      return NextResponse.json(
        { error: "Step not found" },
        { status: 404 }
      );
    }

    const { data: step, error } = await supabase
      .from("demo_steps")
      .update(validatedData)
      .eq("id", params.stepId)
      .eq("demo_id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating demo step:", error);
      return NextResponse.json(
        { error: "Failed to update demo step" },
        { status: 500 }
      );
    }

    return NextResponse.json({ step });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Unexpected error in PATCH /api/demos/[id]/steps/[stepId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
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

    // Verify demo ownership
    const { exists } = await verifyDemoOwnership(supabase, params.id, session.user.id);
    if (!exists) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    // Check if step exists
    const { data: existingStep, error: fetchError } = await supabase
      .from("demo_steps")
      .select("id, sequence_order")
      .eq("id", params.stepId)
      .eq("demo_id", params.id)
      .single();

    if (fetchError || !existingStep) {
      return NextResponse.json(
        { error: "Step not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("demo_steps")
      .delete()
      .eq("id", params.stepId)
      .eq("demo_id", params.id);

    if (error) {
      console.error("Error deleting demo step:", error);
      return NextResponse.json(
        { error: "Failed to delete demo step" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: `Step ${existingStep.sequence_order} deleted successfully` 
    });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/demos/[id]/steps/[stepId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}