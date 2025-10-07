import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PlaybackConfig } from '@/features/playback/types/playback-config';

/**
 * PATCH /api/demos/[id]/steps/[stepId]/playback
 * Update playback configuration for a specific step
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const { id: demoId, stepId } = await params;
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify demo ownership
    const { data: demo, error: demoError } = await supabase
      .from('demos')
      .select('id, user_id')
      .eq('id', demoId)
      .single();

    if (demoError || !demo) {
      return NextResponse.json(
        { error: 'Demo not found' },
        { status: 404 }
      );
    }

    if (demo.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get playback config from request body
    const playbackConfig: PlaybackConfig = await request.json();

    // Get current step annotations
    const { data: step, error: stepError } = await supabase
      .from('demo_steps')
      .select('annotations')
      .eq('id', stepId)
      .eq('demo_id', demoId)
      .single();

    if (stepError || !step) {
      return NextResponse.json(
        { error: 'Step not found' },
        { status: 404 }
      );
    }

    // Update step with new playback config
    const updatedAnnotations = {
      ...(step.annotations || {}),
      playback: playbackConfig
    };

    const { data: updatedStep, error: updateError } = await supabase
      .from('demo_steps')
      .update({
        annotations: updatedAnnotations
      })
      .eq('id', stepId)
      .select()
      .single();

    if (updateError) {
      console.error('[API] Error updating step playback config:', updateError);
      return NextResponse.json(
        { error: 'Failed to update playback configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      step: updatedStep
    });

  } catch (error) {
    console.error('[API] Unexpected error in PATCH /api/demos/[id]/steps/[stepId]/playback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/demos/[id]/steps/[stepId]/playback
 * Remove playback configuration from a step (reset to auto)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const { id: demoId, stepId } = await params;
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify demo ownership
    const { data: demo, error: demoError } = await supabase
      .from('demos')
      .select('id, user_id')
      .eq('id', demoId)
      .single();

    if (demoError || !demo) {
      return NextResponse.json(
        { error: 'Demo not found' },
        { status: 404 }
      );
    }

    if (demo.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get current step annotations
    const { data: step, error: stepError } = await supabase
      .from('demo_steps')
      .select('annotations')
      .eq('id', stepId)
      .eq('demo_id', demoId)
      .single();

    if (stepError || !step) {
      return NextResponse.json(
        { error: 'Step not found' },
        { status: 404 }
      );
    }

    // Remove playback config from annotations
    const updatedAnnotations = {
      ...(step.annotations || {}),
      playback: undefined
    };

    const { data: updatedStep, error: updateError } = await supabase
      .from('demo_steps')
      .update({
        annotations: updatedAnnotations
      })
      .eq('id', stepId)
      .select()
      .single();

    if (updateError) {
      console.error('[API] Error removing step playback config:', updateError);
      return NextResponse.json(
        { error: 'Failed to remove playback configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      step: updatedStep
    });

  } catch (error) {
    console.error('[API] Unexpected error in DELETE /api/demos/[id]/steps/[stepId]/playback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
