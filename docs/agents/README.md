# Agent Pack: SaaS Starting Block

This folder defines specialized implementation agents for the boilerplate.

## Agents

1. `frontend-ui-design-agent.md`
- Owns page-level UI direction, layout systems, and component composition.

2. `react-hook-form-agent.md`
- Owns form architecture using React Hook Form + validation patterns.

3. `zustand-state-agent.md`
- Owns client state boundaries and store design.

4. `react-query-data-agent.md`
- Owns server-state fetching, caching, and mutation strategy.

5. `supabase-data-agent.md`
- Owns schema design, RLS posture, query/API contracts, and typed data access.

6. `saas-feature-orchestrator-agent.md`
- Coordinates all agents for end-to-end feature delivery.

## How to use

- Pick one agent when the scope is narrow.
- Use `saas-feature-orchestrator-agent.md` for full feature implementation.
- Require every agent output to include:
  - Architecture decisions
  - Files changed/created
  - Risks/tradeoffs
  - Validation commands (`npm run lint`, `npm run tsc`)

## Shared repository guardrails

- Use routes from `src/config/routes.ts`.
- Prefer reusable components from `src/components/ui`.
- Keep feature-specific code in `src/features/<feature>`.
- Keep shared hooks in `src/hooks`, shared utilities in `src/lib`, global stores in `src/stores`.
- Supabase clients live in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.
