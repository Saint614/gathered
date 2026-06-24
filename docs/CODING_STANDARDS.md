# Coding Standards

These rules apply across the entire codebase. Claude Code must follow them on every file it creates or edits.

---

## TypeScript

- **Strict mode on everywhere.** `"strict": true` in `tsconfig.json`.
- **No `any`.** Use `unknown` and narrow it, or define a proper type.
- **No implicit returns.** Every function has an explicit return type.
- **Shared types live in `lib/types/`.** Never define the same type in two places.
- **Use Zod for runtime validation** (API inputs, form data, env vars). Types flow from Zod schemas.

```typescript
// Good
import { z } from 'zod';

const CreateEventSchema = z.object({
  title: z.string().min(1).max(200),
  starts_at: z.coerce.date(),
  event_type: z.enum(['open_farm_day', 'farmers_market', 'food_truck', 'u_pick', 'csa_pickup', 'workshop', 'other']),
});

type CreateEventInput = z.infer<typeof CreateEventSchema>;

// Bad
const createEvent = (data: any) => { ... }
```

---

## File & Folder Naming

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase file | `FarmCard.tsx` |
| Hooks | camelCase, `use` prefix | `useFarmsNearMe.ts` |
| Utilities | camelCase | `geocodeAddress.ts` |
| Supabase Edge Functions | kebab-case folder | `sync-farm-events/` |
| DB migrations | `{number}_{description}.sql` | `0001_initial_schema.sql` |
| Constants | SCREAMING_SNAKE | `const MAX_RADIUS_KM = 100` |

---

## React Components

- **Functional components only.** No class components.
- **One component per file.** Co-locate its types and hooks in the same file if they're only used there.
- **Props interface above the component**, named `{ComponentName}Props`.
- **No prop drilling more than 2 levels.** Use context or Zustand.

```typescript
// Good
interface FarmCardProps {
  farm: Farm;
  distanceKm?: number;
}

export function FarmCard({ farm, distanceKm }: FarmCardProps) {
  return (...)
}
```

---

## Data Fetching

- **Always use TanStack Query** for server state. Never fetch in `useEffect`.
- **Query keys are typed arrays**, defined as constants near the query.
- **Mutations use `useMutation`** with `onSuccess` / `onError` toast feedback.

```typescript
// Good
const FARM_QUERY_KEYS = {
  all: ['farms'] as const,
  near: (lat: number, lng: number) => ['farms', 'near', lat, lng] as const,
  detail: (slug: string) => ['farms', 'detail', slug] as const,
};

export function useFarmsNear(lat: number, lng: number) {
  return useQuery({
    queryKey: FARM_QUERY_KEYS.near(lat, lng),
    queryFn: () => getFarmsNear({ lat, lng }),
    enabled: !!lat && !!lng,
  });
}
```

---

## Supabase Patterns

- **Two clients — use the right one:**
  - `lib/supabase/client.ts` — browser client; use in Client Components and hooks
  - `lib/supabase/server.ts` — server client; use in Server Components, Server Actions, and API routes
- **Never use `.select('*')`** — always specify columns.
- **Always handle errors** — Supabase returns `{ data, error }`, check both.
- **RLS handles auth** — don't add manual `WHERE user_id = X` checks when RLS already does it.

```typescript
// Good
const { data: farms, error } = await supabase
  .from('farms')
  .select('id, name, slug, city, state, cover_image_url, location')
  .eq('is_active', true);

if (error) throw error;

// Bad
const { data } = await supabase.from('farms').select('*');
```

---

## Error Handling

- **App Router**: use `error.tsx` for route-level errors, `notFound()` for 404s.
- **API routes / Server Actions**: always return typed error responses with appropriate status codes.
- **Never swallow errors silently.** Log + surface to user.

```typescript
// Server Action or API route
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = CreateEventSchema.parse(body);
    // ...
    return Response.json({ data: event }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Styling

- **Tailwind only** — no inline styles, no CSS modules, no styled-components.
- **Tailwind v4** with `@theme` CSS variables for design tokens.
- **Mobile-first responsive**: default styles = mobile browser, `md:` = tablet, `lg:` = desktop.
- Design tokens (colors, spacing, typography) defined in `tailwind.config.ts` or a `@theme` block.

```tsx
// Good — mobile first, responsive
<div className="flex flex-col gap-2 p-4 md:flex-row md:gap-4 md:p-6">

// Bad — hardcoded styles
<div style={{ display: 'flex', gap: 16 }}>
```

> **Note:** NativeWind is not used. This is a web-only project. Do not install NativeWind or any React Native styling library.

---

## Git Conventions

- **Branch naming**: `feat/farm-discovery-map`, `fix/event-sync-duplicate`, `chore/update-deps`
- **Commit messages**: `feat: add farm type filter chips`, `fix: geocoding fails on PO Box addresses`
- **Never commit to `main` directly.** Always PR, even solo.
- **Migration files are immutable once merged to main.** Write a new migration to alter, never edit an old one.

---

## Environment & Secrets

- **Never hardcode any key, token, or URL.**
- **All env vars have a corresponding entry in `.env.example`** with a placeholder value and comment.
- **`NEXT_PUBLIC_` prefix** = safe to expose to browser. Anything without = server only.
- Server-only secrets (Supabase service role key, Meta app secret, Google server API key) must never use the `NEXT_PUBLIC_` prefix.
