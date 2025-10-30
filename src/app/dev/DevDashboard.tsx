'use client';

import { useState } from 'react';
import { FiCopy, FiCheckCircle, FiExternalLink, FiCheck, FiX, FiBook, FiCode } from 'react-icons/fi';

export function DevDashboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Check environment variables
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const hasAppUrl = !!process.env.NEXT_PUBLIC_APP_URL;
  const isSetup = hasSupabase && hasStripe && hasAppUrl;

  const quickCommands = [
    { title: 'Start Dev Server', command: 'npm run dev', description: 'Run on localhost:3000' },
    { title: 'Initialize Database', command: 'npm run db:init', description: 'Choose Solo or Teams schema' },
    { title: 'Generate Types', command: 'npm run types:generate', description: 'Sync from Supabase' },
    { title: 'Check Setup', command: 'npm run setup:check', description: 'Validate environment' },
    { title: 'Run Type Check', command: 'npm run tsc', description: 'Check for TypeScript errors' },
    { title: 'View Storybook', command: 'npm run storybook', description: 'Component library' },
  ];

  const guides = [
    {
      title: 'Setup Guide',
      description: 'Get your SaaS running in 45 minutes',
      icon: '🚀',
      link: '/dev/setup',
      time: '45 min',
    },
    {
      title: 'Google OAuth',
      description: 'Enable Google Sign-In (optional)',
      icon: '🔐',
      link: '/dev/docs/google-oauth',
      time: '5 min',
    },
    {
      title: 'Blog System',
      description: 'Write posts, SEO, and markdown tips',
      icon: '📝',
      link: '/dev/docs/blog',
      time: '10 min',
    },
    {
      title: 'Customization',
      description: 'Branding, colors, and content',
      icon: '🎨',
      link: '/dev/docs/customization',
      time: '15 min',
    },
    {
      title: 'Database Setup',
      description: 'Solo vs Teams schemas',
      icon: '🗄️',
      link: '/dev/docs/db-setup',
      time: '10 min',
    },
  ];

  const features = [
    {
      title: 'Blog System',
      description: 'Markdown-based blog with pSEO',
      icon: '📝',
      items: [
        { label: 'Write posts in markdown', detail: 'content/blog/*.md' },
        { label: 'Auto-generates sitemap', detail: 'SEO optimized' },
        { label: 'Categories and tags', detail: 'Organize content' },
      ],
      link: '/blog',
      linkText: 'View Blog',
    },
    {
      title: 'Admin Dashboard',
      description: 'Monitor users and revenue',
      icon: '👑',
      items: [
        { label: 'User metrics', detail: 'Total users, projects' },
        { label: 'Revenue tracking', detail: 'MRR calculation' },
        { label: 'Email-based auth', detail: 'Secure admin access' },
      ],
      link: '/admin',
      linkText: 'Open Admin',
      note: 'Add NEXT_PUBLIC_ADMIN_EMAILS to .env.local',
    },
    {
      title: 'SEO Ready',
      description: 'Automatic sitemap and robots.txt',
      icon: '🔍',
      items: [
        { label: 'Dynamic sitemap.xml', detail: 'Auto-updates' },
        { label: 'robots.txt configured', detail: 'Search engine ready' },
        { label: 'JSON-LD structured data', detail: 'Rich snippets' },
      ],
    },
    {
      title: 'UI Components',
      description: 'Reusable components library',
      icon: '🎨',
      items: [
        { label: 'Modals & Tooltips', detail: 'Smart positioning' },
        { label: 'Time toggles', detail: 'Analytics views' },
        { label: 'Forms & Inputs', detail: 'Accessible' },
      ],
      link: 'http://localhost:6006',
      linkText: 'Open Storybook',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Developer Hub</h1>
              <p className="text-gray-600 mt-1">Everything you need to build your SaaS</p>
            </div>
            {!isSetup && (
              <a
                href="/dev/setup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Setup →
              </a>
            )}
          </div>

          {/* Environment Status */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {hasSupabase ? (
                <FiCheck className="w-5 h-5 text-green-500" />
              ) : (
                <FiX className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-700">Supabase</span>
            </div>
            <div className="flex items-center gap-2">
              {hasStripe ? (
                <FiCheck className="w-5 h-5 text-green-500" />
              ) : (
                <FiX className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-700">Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              {hasAppUrl ? (
                <FiCheck className="w-5 h-5 text-green-500" />
              ) : (
                <FiX className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-gray-700">App URL</span>
            </div>
            {isSetup && (
              <div className="ml-auto flex items-center gap-2 text-green-600 font-medium">
                <FiCheckCircle className="w-5 h-5" />
                All set!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Guides */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiBook className="w-5 h-5 text-blue-600" />
              Quick Guides
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {guides.map((guide, i) => (
                <a
                  key={i}
                  href={guide.link}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl mb-2">{guide.icon}</div>
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 mb-1">
                    {guide.title}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{guide.description}</div>
                  <div className="text-xs text-gray-500">{guide.time}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCode className="w-5 h-5 text-blue-600" />
              Quick Commands
            </h2>
            <div className="space-y-2">
              {quickCommands.map((cmd, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900">{cmd.title}</div>
                    <code className="text-xs text-gray-600 font-mono truncate block">{cmd.command}</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cmd.command, `cmd-${i}`)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    title="Copy command"
                  >
                    {copied === `cmd-${i}` ? (
                      <FiCheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {feature.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-900">{item.label}</span>
                        <span className="text-xs text-gray-500 ml-2">• {item.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                {feature.note && (
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    {feature.note}
                  </div>
                )}

                {feature.link && (
                  <a
                    href={feature.link}
                    target={feature.external ? "_blank" : undefined}
                    rel={feature.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {feature.linkText}
                    {feature.external && <FiExternalLink className="w-3 h-3" />}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help Footer */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-900 mb-1">📖 Documentation</div>
              <p className="text-gray-600">All guides available at <a href="/dev/docs/readme" className="text-blue-600 hover:underline">/dev/docs</a></p>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">🔧 Commands</div>
              <p className="text-gray-600">Run <code className="bg-gray-100 px-1 rounded">npm run setup:check</code> to validate setup</p>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1">🎯 Quick Start</div>
              <p className="text-gray-600">Follow the <a href="/dev/setup" className="text-blue-600 hover:underline">interactive setup guide</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
