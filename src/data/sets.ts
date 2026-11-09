import { db } from "@/db";
import { sets, workoutExercises, workouts } from "@/db/schema";
import { and, asc, eq, max } from "drizzle-orm";

type SetValues = { reps: number; weight: number };

/** Returns the workout id if the workout exercise belongs to the user, else null. */
async function getOwnedWorkoutExercise(workoutExerciseId: string, userId: string) {
  const [row] = await db
    .select({ id: workoutExercises.id, workoutId: workoutExercises.workoutId })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(workoutExercises.id, workoutExerciseId), eq(workouts.userId, userId)))
    .limit(1);
  return row ?? null;
}

async function getOwnedSet(setId: string, userId: string) {
  const [row] = await db
    .select({ id: sets.id, workoutExerciseId: sets.workoutExerciseId })
    .from(sets)
    .innerJoin(workoutExercises, eq(workoutExercises.id, sets.workoutExerciseId))
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(and(eq(sets.id, setId), eq(workouts.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function addSet(workoutExerciseId: string, userId: string, values: SetValues) {
  const owned = await getOwnedWorkoutExercise(workoutExerciseId, userId);
  if (!owned) return null;

  const [{ last }] = await db
    .select({ last: max(sets.setNumber) })
    .from(sets)
    .where(eq(sets.workoutExerciseId, workoutExerciseId));

  const [created] = await db
    .insert(sets)
    .values({
      workoutExerciseId,
      setNumber: (last ?? 0) + 1,
      reps: values.reps,
      weight: values.weight.toFixed(2),
    })
    .returning();
  return created;
}

export async function updateSet(setId: string, userId: string, values: SetValues) {
  const owned = await getOwnedSet(setId, userId);
  if (!owned) return null;

  const [updated] = await db
    .update(sets)
    .set({ reps: values.reps, weight: values.weight.toFixed(2) })
    .where(eq(sets.id, setId))
    .returning();
  return updated ?? null;
}

export async function deleteSet(setId: string, userId: string) {
  const owned = await getOwnedSet(setId, userId);
  if (!owned) return false;

  await db.delete(sets).where(eq(sets.id, setId));

  // Renumber remaining sets so numbering stays contiguous.
  const remaining = await db
    .select({ id: sets.id })
    .from(sets)
    .where(eq(sets.workoutExerciseId, owned.workoutExerciseId))
    .orderBy(asc(sets.setNumber), asc(sets.createdAt));
  for (const [i, s] of remaining.entries()) {
    await db.update(sets).set({ setNumber: i + 1 }).where(eq(sets.id, s.id));
  }
  return true;
}
