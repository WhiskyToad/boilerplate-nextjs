import { NextRequest, NextResponse } from 'next/server';
import { loadProgress, completeStep, uncompleteStep, resetProgress, type SetupStep } from '@/lib/setup-progress';

/**
 * GET /api/dev/progress - Load current progress
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const progress = await loadProgress();
  return NextResponse.json(progress);
}

/**
 * POST /api/dev/progress - Update progress
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const body = await request.json();
  const { action, step } = body;

  if (action === 'complete' && step) {
    await completeStep(step as SetupStep);
  } else if (action === 'uncomplete' && step) {
    await uncompleteStep(step as SetupStep);
  } else if (action === 'reset') {
    await resetProgress();
  }

  const progress = await loadProgress();
  return NextResponse.json(progress);
}
