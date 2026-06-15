# Data Mutations

## Rule: /data Directory for All Database Mutations

**All database mutations must be implemented as helper functions inside the `/data` directory.**

- Do NOT write database mutation calls inline in server actions, pages, or component files
- Do NOT use raw SQL — always use Drizzle ORM
- Each file in `/data` groups related operations (e.g., `data/workouts.ts`, `data/exercises.ts`)

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Rule: Server Actions for All Mutations

**All data mutations must be triggered via Server Actions defined in colocated `actions.ts` files.**

- Do NOT mutate data in route handlers (`src/app/api/`)
- Do NOT mutate data directly inside Server Components or Client Components
- Each feature folder must have its own `actions.ts` file colocated alongside its page or component files

### Example structure

```
src/
  app/
    dashboard/
      page.tsx
    workouts/
      actions.ts       ← server actions for this feature
      page.tsx
      new/
        actions.ts     ← server actions for the new workout flow
        page.tsx
```

### Example server action

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { name, date } = createWorkoutSchema.parse(params);

  return createWorkout(session.user.id, name, date);
}
```

## Rule: Typed Parameters — No FormData

**Server action parameters must be explicitly typed. `FormData` is NOT an acceptable parameter type.**

- Define a plain TypeScript object type or inline type for every server action's parameters
- Extract the schema from the Zod schema using `z.infer<>` to keep the type and validation in sync

```ts
// CORRECT: typed params derived from the Zod schema
const schema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1),
});

type Params = z.infer<typeof schema>;

export async function updateWorkoutAction(params: Params) { ... }

// WRONG: FormData
export async function updateWorkoutAction(formData: FormData) { ... }
```

## Rule: Validate All Arguments with Zod

**Every server action must validate its arguments using a Zod schema before doing anything else.**

- Define the Zod schema at the top of the file, outside the function
- Call `.parse()` (throws on failure) rather than `.safeParse()` unless you need to handle errors manually
- Validation must happen before any database call or business logic

```ts
// CORRECT
const schema = z.object({
  workoutId: z.string().uuid(),
  sets: z.number().int().positive(),
});

export async function logSetsAction(params: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { workoutId, sets } = schema.parse(params); // validate first
  return addSetsToWorkout(workoutId, session.user.id, sets);
}

// WRONG: skipping validation
export async function logSetsAction(params: { workoutId: string; sets: number }) {
  return addSetsToWorkout(params.workoutId, "hardcoded-user", params.sets);
}
```

## Rule: Users Can Only Mutate Their Own Data

**Every mutation must be scoped to the authenticated user's ID.**

- Always retrieve the current user's ID from the session at the start of the server action
- Always pass `userId` to the `/data` helper and include it in the `WHERE` clause
- Never mutate a resource by ID alone — always verify ownership (e.g., `WHERE id = ? AND user_id = ?`)

Failure to scope mutations by `userId` is a **security vulnerability**. Always authenticate first, always filter by the user's ID.
