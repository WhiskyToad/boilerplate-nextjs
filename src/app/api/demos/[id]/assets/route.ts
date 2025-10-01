import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'text/html': 'html',
  'application/json': 'json',
};

async function verifyDemoOwnership(supabase: any, demoId: string, userId: string) {
  const { data: demo, error } = await supabase
    .from("demos")
    .select("id")
    .eq("id", demoId)
    .eq("user_id", userId)
    .single();

  return { exists: !!demo && !error, demo };
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

    // Verify demo ownership
    const { exists } = await verifyDemoOwnership(supabase, params.id, session.user.id);
    if (!exists) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const assetType = formData.get("type") as string; // 'screenshot', 'dom_snapshot', 'thumbnail'
    const stepId = formData.get("stepId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!assetType || !["screenshot", "dom_snapshot", "thumbnail"].includes(assetType)) {
      return NextResponse.json(
        { error: "Invalid asset type. Must be 'screenshot', 'dom_snapshot', or 'thumbnail'" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed types: PNG, JPEG, WebP, HTML, JSON" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
    const fileName = stepId 
      ? `${assetType}_step_${stepId}_${timestamp}.${fileExtension}`
      : `${assetType}_${timestamp}.${fileExtension}`;

    // Create storage path
    const storagePath = `demos/${params.id}/${assetType}s/${fileName}`;

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("demo-assets")
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("demo-assets")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // If this is a step screenshot or DOM snapshot, update the step record
    if (stepId && (assetType === "screenshot" || assetType === "dom_snapshot")) {
      const updateField = assetType === "screenshot" ? "screenshot_url" : "dom_snapshot";
      const updateData = assetType === "screenshot" 
        ? { screenshot_url: publicUrl }
        : { dom_snapshot: { url: publicUrl, originalSize: file.size } };

      const { error: updateError } = await supabase
        .from("demo_steps")
        .update(updateData)
        .eq("id", stepId)
        .eq("demo_id", params.id);

      if (updateError) {
        console.error("Error updating step with asset URL:", updateError);
        // File was uploaded but step update failed - log but don't fail the request
      }
    }

    // If this is a thumbnail, update the demo record
    if (assetType === "thumbnail") {
      const { error: updateError } = await supabase
        .from("demos")
        .update({ thumbnail_url: publicUrl })
        .eq("id", params.id)
        .eq("user_id", session.user.id);

      if (updateError) {
        console.error("Error updating demo with thumbnail URL:", updateError);
        // File was uploaded but demo update failed - log but don't fail the request
      }
    }

    return NextResponse.json({
      success: true,
      asset: {
        type: assetType,
        url: publicUrl,
        path: storagePath,
        size: file.size,
        contentType: file.type,
        stepId: stepId || null,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Unexpected error in POST /api/demos/[id]/assets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Verify demo ownership
    const { exists } = await verifyDemoOwnership(supabase, params.id, session.user.id);
    if (!exists) {
      return NextResponse.json(
        { error: "Demo not found" },
        { status: 404 }
      );
    }

    // List all assets for this demo
    const { data: files, error } = await supabase.storage
      .from("demo-assets")
      .list(`demos/${params.id}`, {
        limit: 100,
        offset: 0,
      });

    if (error) {
      console.error("Error listing demo assets:", error);
      return NextResponse.json(
        { error: "Failed to list demo assets" },
        { status: 500 }
      );
    }

    // Get public URLs for all files
    const assets = files?.map(file => {
      const { data: urlData } = supabase.storage
        .from("demo-assets")
        .getPublicUrl(`demos/${params.id}/${file.name}`);

      return {
        name: file.name,
        url: urlData.publicUrl,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at,
        contentType: file.metadata?.mimetype,
      };
    }) || [];

    return NextResponse.json({ assets });

  } catch (error) {
    console.error("Unexpected error in GET /api/demos/[id]/assets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}