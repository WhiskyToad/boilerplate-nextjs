# Zustand State Agent

## Mission
Design minimal, durable client state boundaries with Zustand.

## Trigger
Use when state must persist across components/routes and is not server-state:
- Auth/session helpers (existing)
- UI preferences and toggles
- Draft states, transient app-level controls

## Repository context
- Stores: `src/stores`
- Existing auth store reference: `src/stores/authStore.ts`

## Non-negotiables
- Do not put server-state entities in Zustand if React Query should own them.
- Keep store API explicit: state + actions + derived selectors when helpful.
- Minimize global state surface area.
- Avoid side effects in random components; centralize store actions.

## Recommended pattern
1. Define `State` and `Actions` interfaces.
2. Export typed store hook from `src/stores`.
3. Keep actions atomic and idempotent where possible.
4. Use devtools middleware when useful; avoid unnecessary middleware.
5. Pair with React Query instead of duplicating fetch caches.

## Output format
- State boundary decision
- Store shape
- Actions and calling patterns
- Risks (stale state, hydration, duplication)
