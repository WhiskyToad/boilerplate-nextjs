import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { DemoPlayer } from '@/features/playback/components/DemoPlayer';

export const metadata = {
  title: 'Play Demo - DemoFlow',
  description: 'Interactive demo playback'
};

export default async function DemoPlayPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = await createServerClient();

  // Fetch demo with steps
  const { data: demo, error } = await supabase
    .from('demos')
    .select(`
      *,
      steps:demo_steps(*)
    `)
    .eq('id', params.id)
    .single();

  if (error || !demo) {
    console.error('[DemoPlayPage] Error fetching demo:', error);
    redirect('/demos');
  }

  // Sort steps by order (assuming we have an order field, or by created_at)
  const sortedSteps = demo.steps?.sort((a: any, b: any) => {
    // If steps have an 'order' or 'step_number' field, use that
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // Otherwise sort by created_at
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  }) || [];

  if (sortedSteps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Steps Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This demo does not have any steps yet.
          </p>
          <a
            href={`/demos/${params.id}`}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Back to Demo
          </a>
        </div>
      </div>
    );
  }

  // Get the first step URL to render the page
  const firstStepUrl = sortedSteps[0]?.element?.url || '/';

  return (
    <div className="relative min-h-screen">
      {/* Render the actual page being demoed in an iframe */}
      <iframe
        src={firstStepUrl}
        className="w-full h-screen border-0"
        title="Demo Page"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />

      {/* Overlay the playback UI on top */}
      <DemoPlayer
        steps={sortedSteps}
        demoId={demo.id}
        demoTitle={demo.title}
      />
    </div>
  );
}
