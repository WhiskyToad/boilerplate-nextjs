import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DemoPlayer } from '@/features/playback/components/DemoPlayer';

export const metadata = {
  title: 'Play Demo - DemoFlow',
  description: 'Interactive demo playback'
};

export default async function DemoPlayPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch demo with steps
  const { data: demo, error } = await supabase
    .from('demos')
    .select(`
      *,
      steps:demo_steps(*)
    `)
    .eq('id', id)
    .single();

  if (error || !demo) {
    console.error('[DemoPlayPage] Error fetching demo:', error);
    redirect('/demos');
  }

  // Sort steps by sequence_order
  const sortedSteps = demo.steps?.sort((a: any, b: any) => {
    return (a.sequence_order || 0) - (b.sequence_order || 0);
  }) || [];

  if (sortedSteps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Steps Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This demo doesn't have any steps yet.
          </p>
          <a
            href={`/demos/${id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Demo
          </a>
        </div>
      </div>
    );
  }

  // All demos use screenshot-based playback - works for any website
  return (
    <div className="fixed inset-0 bg-gray-900">
      {/* DemoPlayer renders the playback UI with screenshots */}
      <DemoPlayer
        steps={sortedSteps}
        demoId={demo.id}
        demoTitle={demo.title}
      />
    </div>
  );
}
