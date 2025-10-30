import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Markdown Documentation Viewer
 *
 * Renders markdown documentation files in the browser
 * Only accessible in development mode
 */

// Map URL slugs to actual file paths
const DOC_MAP: Record<string, string> = {
  'quickstart': 'QUICKSTART.md',
  'setup': 'SETUP.md',
  'env': '.env.local.example',
  'google-oauth': 'docs/GOOGLE_OAUTH_SETUP.md',
  'blog': 'docs/BLOG.md',
  'customization': 'docs/CUSTOMIZATION.md',
  'architecture': 'docs/UNIVERSAL_SAAS_PATTERNS.md',
  'site-config': 'src/config/site-config.ts',
  'db-setup': 'supabase/migrations/README.md',
  'simple-schema': 'supabase/migrations/00_simple_solo_schema.sql',
  'teams-schema': 'supabase/migrations/01_essential_saas_schema.sql',
  'changelog': 'CHANGELOG.md',
  'readme': 'README.md',
};

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    redirect('/');
  }

  const { slug } = await params;
  const docSlug = slug?.[0] || 'readme';

  // Get the file path from the map
  const filePath = DOC_MAP[docSlug];
  if (!filePath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Document Not Found</h1>
          <p className="text-gray-600">The requested document could not be found.</p>
          <a href="/dev" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Read the file
  const projectRoot = process.cwd();
  const fullPath = path.join(projectRoot, filePath);

  let content: string;
  try {
    content = await fs.readFile(fullPath, 'utf8');
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Reading File</h1>
          <p className="text-gray-600">Could not read file: {filePath}</p>
          <a href="/dev" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Determine if it's a code file (non-markdown)
  const isCodeFile = filePath.endsWith('.ts') || filePath.endsWith('.sql') || filePath.endsWith('.example');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <a href="/dev" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Dashboard
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {isCodeFile ? (
            // Render code files with syntax highlighting
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{filePath}</h1>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{content}</code>
              </pre>
            </div>
          ) : (
            // Render markdown files
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const docSlug = slug?.[0] || 'readme';
  const filePath = DOC_MAP[docSlug];

  return {
    title: `${docSlug} - Developer Docs`,
    description: `Documentation: ${filePath}`,
  };
}
