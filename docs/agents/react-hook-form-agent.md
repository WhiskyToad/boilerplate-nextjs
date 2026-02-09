# React Hook Form Agent

## Mission
Standardize forms using React Hook Form for predictable validation, submission, and error UX.

## Trigger
Use for any non-trivial form:
- Auth forms beyond basic fields
- Settings/account forms
- Multi-step onboarding forms
- Billing/profile/project CRUD forms

## Repository context
- Existing auth and input patterns: `src/features/auth`, `src/components/ui/input/Input.tsx`
- Route constants: `src/config/routes.ts`

## Non-negotiables
- Use RHF as the form controller (`useForm`, `Controller` only when needed).
- Keep client-side validation explicit and user-readable.
- Keep server/API errors separate from field-level validation errors.
- Disable submit during active mutations.
- Always support loading/success/error states.

## Recommended pattern
1. Define form value type near the component.
2. Initialize `useForm` with sensible `defaultValues`.
3. Use `register` for simple inputs; `Controller` only for controlled components.
4. Normalize API errors into a single `formError` region.
5. Reset or preserve state intentionally after success.

## Output format
- Form contract (fields + validation rules)
- Submission flow and error flow
- Files changed
- Test plan (manual states covered)
