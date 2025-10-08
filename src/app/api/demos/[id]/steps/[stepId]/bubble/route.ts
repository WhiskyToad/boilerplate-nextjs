import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const supabase = await createClient();
    const bubbleConfig = await request.json();

    // Get current step to merge with existing annotations
    const { data: step, error: fetchError } = await supabase
      .from('demo_steps')
      .select('annotations')
      .eq('id', params.stepId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Merge bubble config into annotations
    const currentAnnotations = (step?.annotations as Record<string, any>) || {};
    const updatedAnnotations = {
      ...currentAnnotations,
      bubble: bubbleConfig,
    };

    const { data, error } = await supabase
      .from('demo_steps')
      .update({ annotations: updatedAnnotations })
      .eq('id', params.stepId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update bubble config' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const supabase = await createClient();

    // Get current step to remove bubble from annotations
    const { data: step, error: fetchError } = await supabase
      .from('demo_steps')
      .select('annotations')
      .eq('id', params.stepId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Remove bubble from annotations
    const currentAnnotations = (step?.annotations as Record<string, any>) || {};
    const updatedAnnotations = { ...currentAnnotations };
    delete updatedAnnotations.bubble;

    const { data, error } = await supabase
      .from('demo_steps')
      .update({ annotations: updatedAnnotations })
      .eq('id', params.stepId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete bubble config' },
      { status: 500 }
    );
  }
}
