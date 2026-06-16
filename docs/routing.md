# Routing

## Route Structure

All application routes are accessed via `/dashboard`. There are no top-level feature routes — everything lives under the dashboard prefix.

```
/                        → redirect to /dashboard
/dashboard               → main dashboard page
/dashboard/workout/[id]  → workout detail page
/dashboard/...           → any future sub-pages
```

## Protected Routes

`/dashboard` and all sub-routes are protected — only authenticated users may access them.

Route protection is implemented via **Next.js middleware** (`src/middleware.ts`), not in individual page components or layouts. The middleware intercepts requests and redirects unauthenticated users to the sign-in page before the route ever renders.

**Do not** add auth checks inside page components or layouts. The middleware is the single enforcement point.

### Middleware behavior

- Unauthenticated requests to any `/dashboard/*` path → redirect to `/sign-in`
- Authenticated requests → allowed through
- Auth routes (`/sign-in`, `/sign-up`) → always accessible, redirect to `/dashboard` if already signed in
