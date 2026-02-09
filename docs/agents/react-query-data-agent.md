# React Query Data Agent

## Mission
Implement consistent server-state fetching/mutation with React Query.

## Trigger
Use when data comes from APIs/Supabase and requires caching/invalidation:
- Lists and details
- CRUD mutations
- Optimistic updates
- Background refetch and stale policies

## Repository context
- Provider setup: `src/lib/react-query.tsx`
- App root wiring: `src/app/layout.tsx`

## Non-negotiables
- Use deterministic query keys and colocate key factories with features.
- Invalidate/update cache on successful mutations.
- Handle loading/error/empty states in UI.
- Keep retry/stale policies explicit for critical queries.
- Do not mix imperative ad-hoc fetch calls where query hooks are appropriate.

## Recommended pattern
1. Define query key factory per feature.
2. Create `useXQuery` and `useXMutation` hooks in feature folder.
3. Return typed data + typed error paths.
4. Invalidate minimal key scopes, not global cache.
5. Document staleTime/retry reasoning for each core query.

## Output format
- Query key map
- Hook contract(s)
- Invalidation strategy
- Files changed
- Validation steps
