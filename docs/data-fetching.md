# Data Fetching

## Rule: Server Components Only

**ALL data fetching must be done exclusively via React Server Components.**

- Do NOT fetch data in client components (`"use client"`)
- Do NOT fetch data in route handlers (`src/app/api/`)
- Do NOT use `useEffect` + `fetch` patterns
- Do NOT use SWR, React Query, or any client-side data fetching library

Server Components run on the server, have direct access to the database, never expose credentials to the client, and keep data fetching simple and secure. There is no valid reason to deviate from this pattern in this app.

## Rule: /data Directory for All Database Queries

**All database queries must be implemented as helper functions inside the `/data` directory.**

- Do NOT write database queries inline in page or component files
- Do NOT use raw SQL — always use Drizzle ORM
- Each file in `/data` should group related queries (e.g., `data/workouts.ts`, `data/exercises.ts`)

### Example structure

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## Rule: Users Can Only Access Their Own Data

**Every query that returns user-owned data MUST filter by the authenticated user's ID.**

- Always retrieve the current user's ID from the session before querying
- Always pass `userId` as a parameter to data helper functions and include it in the `WHERE` clause
- Never query a resource by ID alone — always scope it to the user (e.g., `WHERE id = ? AND user_id = ?`)
- Never expose another user's data, even accidentally

### Example — scoped by user

```ts
// CORRECT: scoped to the authenticated user
export async function getWorkoutById(workoutId: string, userId: string) {
  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);
}

// WRONG: not scoped — any logged-in user could read any workout
export async function getWorkoutById(workoutId: string) {
  return db.select().from(workouts).where(eq(workouts.id, workoutId)).limit(1);
}
```

Failure to scope queries by `userId` is a **security vulnerability**. Always verify the user is authenticated and always filter by their ID.
