'use client';

import { useState, useEffect } from 'react';
import { FiCheck, FiSquare, FiCheckSquare, FiChevronDown, FiChevronRight, FiCopy } from 'react-icons/fi';
import type { SetupStep } from '@/lib/setup-progress';

interface Step {
  id: SetupStep;
  title: string;
  description: string;
  time: string;
  link?: string;
}

interface Section {
  title: string;
  time: string;
  steps: Step[];
}

const SETUP_SECTIONS: Section[] = [
  {
    title: '1. Supabase Setup',
    time: '10 min',
    steps: [
      {
        id: 'supabase-account',
        title: 'Create Supabase account + project',
        description: 'Go to supabase.com → New project → Wait for it to initialize',
        time: '5 min',
        link: 'https://supabase.com/dashboard',
      },
      {
        id: 'supabase-keys',
        title: 'Copy your API keys',
        description: 'Project Settings → API → Copy: URL, anon key, service_role key',
        time: '2 min',
      },
      {
        id: 'env-file',
        title: 'Create .env.local file',
        description: 'Run: cp .env.local.example .env.local',
        time: '1 min',
      },
      {
        id: 'env-supabase',
        title: 'Paste Supabase keys into .env.local',
        description: 'Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY',
        time: '2 min',
      },
    ],
  },
  {
    title: '2. Database Setup',
    time: '5 min',
    steps: [
      {
        id: 'supabase-sql-editor',
        title: 'Open Supabase SQL Editor',
        description: 'Go to your project → SQL Editor → New query',
        time: '1 min',
        link: 'https://supabase.com/dashboard',
      },
      {
        id: 'copy-sql',
        title: 'Choose schema & copy SQL',
        description: 'Choose between Solo or Teams schema below, copy the SQL, paste in SQL Editor, and click Run',
        time: '4 min',
      },
    ],
  },
  {
    title: '3. Stripe Setup',
    time: '20 min',
    steps: [
      {
        id: 'stripe-account',
        title: 'Create Stripe account',
        description: 'Go to stripe.com → Sign up → Use test mode',
        time: '3 min',
        link: 'https://dashboard.stripe.com/register',
      },
      {
        id: 'stripe-keys',
        title: 'Copy Stripe API keys',
        description: 'Developers → API keys → Reveal and copy publishable + secret keys',
        time: '2 min',
      },
      {
        id: 'stripe-products',
        title: 'Create products & prices',
        description: 'Products → Add products → Create Free, Pro, Teams → Add monthly/yearly prices → Copy price IDs',
        time: '12 min',
      },
      {
        id: 'env-stripe',
        title: 'Add Stripe keys to .env.local',
        description: 'Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, and all price IDs',
        time: '3 min',
      },
    ],
  },
  {
    title: '4. Test Everything',
    time: '10 min',
    steps: [
      {
        id: 'site-config',
        title: 'Customize landing page',
        description: 'Edit src/config/site-config.ts - Update name, hero title, features, pricing',
        time: '5 min',
      },
      {
        id: 'test-auth',
        title: 'Test signup & login',
        description: 'Run npm run dev → Sign up with test email',
        time: '3 min',
      },
      {
        id: 'test-stripe',
        title: 'Test Stripe checkout',
        description: 'Try upgrading → Use card: 4242 4242 4242 4242',
        time: '2 min',
      },
    ],
  },
];

export function SetupGuide() {
  const [completed, setCompleted] = useState<SetupStep[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]); // First section expanded by default
  const [loading, setLoading] = useState(true);
  const [includeTeams, setIncludeTeams] = useState(false);
  const [includeAdmin, setIncludeAdmin] = useState(true);
  const [includeSecurity, setIncludeSecurity] = useState(false);
  const [includeWaitlist, setIncludeWaitlist] = useState(true);
  const [sql, setSql] = useState<string>('');
  const [loadingSql, setLoadingSql] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load progress on mount
  useEffect(() => {
    fetch('/api/dev/progress')
      .then(res => res.json())
      .then(data => {
        setCompleted(data.completed || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load SQL when options change or Database Setup section is expanded
  useEffect(() => {
    if (expandedSections.includes(1)) { // Database Setup is section index 1
      setLoadingSql(true);
      const params = new URLSearchParams({
        teams: includeTeams.toString(),
        admin: includeAdmin.toString(),
        security: includeSecurity.toString(),
        waitlist: includeWaitlist.toString(),
      });
      fetch(`/api/migrations?${params}`)
        .then(res => res.json())
        .then(data => {
          setSql(data.sql || '');
          setLoadingSql(false);
        })
        .catch(() => {
          setSql('');
          setLoadingSql(false);
        });
    }
  }, [includeTeams, includeAdmin, includeSecurity, includeWaitlist, expandedSections]);

  const copySql = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStep = async (stepId: SetupStep) => {
    const isComplete = completed.includes(stepId);
    const action = isComplete ? 'uncomplete' : 'complete';

    // Optimistic update
    setCompleted(prev =>
      isComplete ? prev.filter(s => s !== stepId) : [...prev, stepId]
    );

    // Update server
    await fetch('/api/dev/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, step: stepId }),
    });
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const totalSteps = SETUP_SECTIONS.reduce((sum, section) => sum + section.steps.length, 0);
  const completedSteps = completed.length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Guide</h1>
          <p className="text-gray-600 mb-6">
            Follow these steps to get your SaaS up and running. Check off each step as you complete it.
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedSteps}/{totalSteps} steps complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-600 w-6 h-6" />
                  <div>
                    <div className="font-bold text-green-900">Setup Complete!</div>
                    <div className="text-sm text-green-700">
                      You're ready to start building. Run <code className="bg-green-100 px-2 py-1 rounded">npm run dev</code> to get started.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Setup Sections */}
        <div className="space-y-4">
          {SETUP_SECTIONS.map((section, sectionIndex) => {
            const isExpanded = expandedSections.includes(sectionIndex);
            const sectionCompleted = section.steps.every(step => completed.includes(step.id));
            const sectionProgress = section.steps.filter(step => completed.includes(step.id)).length;

            return (
              <div key={sectionIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {sectionCompleted ? (
                      <FiCheckSquare className="text-green-600 w-6 h-6" />
                    ) : (
                      <FiSquare className="text-gray-400 w-6 h-6" />
                    )}
                    <div className="text-left">
                      <div className="font-bold text-lg text-gray-900">{section.title}</div>
                      <div className="text-sm text-gray-600">
                        {sectionProgress}/{section.steps.length} steps • {section.time}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <FiChevronDown className="text-gray-400 w-5 h-5" />
                  ) : (
                    <FiChevronRight className="text-gray-400 w-5 h-5" />
                  )}
                </button>

                {/* Section Steps */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {/* SQL Viewer for Database Setup section */}
                    {sectionIndex === 1 && (
                      <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="mb-4">
                          <div className="font-medium text-gray-900 mb-3">Configure Your Database:</div>
                          <div className="space-y-3">
                            {/* Always included */}
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <FiCheckSquare className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900">Base (Required)</div>
                                <div className="text-sm text-gray-600">
                                  Profiles, subscriptions, usage tracking, admin roles
                                </div>
                              </div>
                            </div>

                            {/* Optional modules */}
                            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={includeTeams}
                                onChange={(e) => setIncludeTeams(e.target.checked)}
                                className="mt-0.5"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Teams & Collaboration</div>
                                <div className="text-sm text-gray-600">
                                  Team creation, members, invitations, and personal teams
                                </div>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={includeAdmin}
                                onChange={(e) => setIncludeAdmin(e.target.checked)}
                                className="mt-0.5"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Admin Activity Logging</div>
                                <div className="text-sm text-gray-600">
                                  Track admin actions and enhanced admin views
                                </div>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={includeWaitlist}
                                onChange={(e) => setIncludeWaitlist(e.target.checked)}
                                className="mt-0.5"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Waitlist</div>
                                <div className="text-sm text-gray-600">
                                  Collect early access signups with RLS-guarded waitlist table
                                </div>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
                              <input
                                type="checkbox"
                                checked={includeSecurity}
                                onChange={(e) => setIncludeSecurity(e.target.checked)}
                                className="mt-0.5"
                              />
                              <div>
                                <div className="font-medium text-gray-900">Security & Audit</div>
                                <div className="text-sm text-gray-600">
                                  Comprehensive logging, failed logins, rate limiting, session tracking
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>

                        {loadingSql ? (
                          <div className="text-center py-8 text-gray-600">Loading SQL...</div>
                        ) : (
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-gray-900">SQL Migration:</div>
                              <button
                                onClick={copySql}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <FiCopy className="w-4 h-4" />
                                {copied ? 'Copied!' : 'Copy SQL'}
                              </button>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
                              <code>{sql}</code>
                            </pre>
                            <div className="mt-3 text-sm text-gray-600">
                              ✨ Copy the SQL above and paste it into your Supabase SQL Editor, then click Run
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {section.steps.map((step, stepIndex) => {
                      const isComplete = completed.includes(step.id);
                      return (
                        <div
                          key={step.id}
                          className="flex items-start gap-4 p-4 border-b border-gray-200 last:border-b-0 hover:bg-white transition-colors"
                        >
                          <button
                            onClick={() => toggleStep(step.id)}
                            className="flex-shrink-0 mt-1"
                          >
                            {isComplete ? (
                              <FiCheckSquare className="text-green-600 w-5 h-5" />
                            ) : (
                              <FiSquare className="text-gray-400 w-5 h-5 hover:text-gray-600" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className={`font-medium ${isComplete ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {step.title}
                              </div>
                              <div className="text-xs text-gray-500">{step.time}</div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{step.description}</div>
                            {step.link && (
                              <a
                                href={step.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                              >
                                Open →
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="font-bold text-blue-900 mb-2">💡 Tips</div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• You can pause anytime - your progress is automatically saved</li>
            <li>• Check off steps as you complete them to track your progress</li>
            <li>• Use the dashboard to quickly check environment status</li>
            <li>• Stuck? Check the troubleshooting section in the docs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
