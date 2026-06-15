# Authentication

## Provider: Clerk

**This app uses [Clerk](https://clerk.com) for all authentication.**

- Do NOT implement custom auth logic, sessions, or JWT handling
- Do NOT use NextAuth, Auth.js, or any other auth library
- All sign-in, sign-up, and session management is handled entirely by Clerk

## Getting the Current User

**Always use Clerk's `auth()` helper to retrieve the current user's ID in Server Components and Server Actions.**

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

- `userId` will be `null` if the user is not signed in — always handle this case
- Do NOT read the user ID from cookies, headers, or any other source

## Protecting Pages

Use Clerk's `auth()` to guard protected pages. Redirect unauthenticated users rather than rendering content conditionally.

```ts
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // render page...
}
```

Do NOT use middleware-only protection as the sole guard — always check `auth()` at the page level for any route that requires a signed-in user.

## Middleware

Clerk middleware must be configured in `src/middleware.ts` to protect routes at the edge.

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/workout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

- Add all app routes that require authentication to `isProtectedRoute`
- Public routes (e.g., `/`, `/sign-in`, `/sign-up`) do not need to be listed — they are public by default

## Clerk Components

Use Clerk's pre-built UI components for sign-in and sign-up flows — do not build custom auth forms.

```tsx
import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
```

- `<SignIn />` — renders the full sign-in form
- `<SignUp />` — renders the full sign-up form
- `<UserButton />` — renders the user avatar/menu in the nav

## Connecting Auth to the Database

The `userId` returned by `auth()` is a Clerk user ID (e.g., `"user_2abc..."`). This value is what gets stored as `userId` on all database records.

- Never store emails or usernames as the user identifier in the database — always use the Clerk `userId`
- See `data-fetching.md` for the rule requiring all queries to be scoped by `userId`
