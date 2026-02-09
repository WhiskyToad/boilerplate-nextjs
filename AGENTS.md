# Repository Guidelines

## Project Structure & Module Organization
- Core app routes live in `src/app` (Next.js App Router). Shared UI sits in `src/components`, while feature-specific pieces live in `src/features`. Hooks are in `src/hooks`, utilities in `src/lib`, and global stores in `src/stores`.
- Configuration lives at the root (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`) and in `src/config` for app-level settings.
- Static assets go in `public/`; Supabase database changes live in `supabase/migrations/`. Content and docs are under `content/` and `docs/`.

## Build, Test, and Development Commands
- `npm run dev` — start the Next.js dev server (Turbopack).
- `npm run build` / `npm run start` — create and run the production build.
- `npm run lint` — ESLint with the Next.js config; fixes require manual edits.
- `npm run tsc` — type-check the project without emitting files.
- `npm run storybook` / `npm run build-storybook` — develop or build the component catalog.
- `npm run setup:check` — validate environment variables and required tooling.
- `npm run types:generate` — regenerate Supabase types; run after schema changes.

## Coding Style & Naming Conventions
- TypeScript-first; prefer typed props and return values. Stick to React function components.
- Follow ESLint defaults from `eslint.config.mjs`; address lint warnings before committing.
- Use PascalCase for components (`FeatureCard.tsx`), camelCase for variables/functions, and `use*` for hooks. Route segments match Next.js conventions.
- Tailwind is the default styling approach; co-locate styles with components and lean on utility classes before custom CSS.

## Testing Guidelines
- Storybook is the primary feedback loop for UI states; add stories alongside components to cover empty, loading, error, and success cases.
- Run `npm run lint` and `npm run tsc` before opening a PR. If you introduce logic-heavy utilities, add focused tests (Jest setup is available via `@types/jest`, though no script is wired by default).
- After updating Supabase schema, rerun `npm run types:generate` and ensure relevant flows still render in Storybook.

## Commit & Pull Request Guidelines
- Use concise, conventional-style commit messages (`feat:`, `fix:`, `chore:`). Keep commits scoped and readable.
- PRs should include: a brief summary of changes, linked issue (if applicable), and screenshots/GIFs for UI tweaks. Call out migration changes (`supabase/migrations`) and whether `npm run types:generate` was run.
- Ensure the app builds (`npm run build`) or at least passes lint/type checks before requesting review.

## Security & Configuration Tips
- Keep secrets in `.env.local`; never commit them. Run `npm run setup:check` after updating env variables.
- When modifying auth, billing, or analytics flows, review related config in `src/config` and update documentation in `docs/` as needed.

## Local Agent Pack
- Specialized implementation agents are available in `docs/agents/`.
- Use `docs/agents/saas-feature-orchestrator-agent.md` for end-to-end feature work.
- Use focused agents for narrow tasks:
  - UI/UX: `docs/agents/frontend-ui-design-agent.md`
  - Forms: `docs/agents/react-hook-form-agent.md`
  - Client state: `docs/agents/zustand-state-agent.md`
  - Server-state/data fetching: `docs/agents/react-query-data-agent.md`
  - Data layer and migrations: `docs/agents/supabase-data-agent.md`
