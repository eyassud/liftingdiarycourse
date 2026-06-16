import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function getWorkoutById(workoutId: string, userId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);
  return workout ?? null;
}

export async function updateWorkout(
  workoutId: string,
  userId: string,
  data: { name: string | null; startedAt: Date }
) {
  const [workout] = await db
    .update(workouts)
    .set({ name: data.name, startedAt: data.startedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return workout ?? null;
}

export async function createWorkout(userId: string, name: string | null, startedAt: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, startedAt })
    .returning();
  return workout;
}

export async function getWorkoutsForUserOnDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutName: workouts.name,
      startedAt: workouts.startedAt,
      workoutExerciseId: workoutExercises.id,
      exerciseOrder: workoutExercises.order,
      exerciseName: exercises.name,
      setId: sets.id,
      setNumber: sets.setNumber,
      reps: sets.reps,
      weight: sets.weight,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    )
    .orderBy(workouts.startedAt, workoutExercises.order, sets.setNumber);

  // Group into workouts → exercises → sets
  const workoutMap = new Map<
    string,
    {
      id: string;
      name: string | null;
      startedAt: Date;
      exercises: Map<
        string,
        {
          id: string;
          name: string;
          order: number;
          sets: { id: string; setNumber: number | null; reps: number | null; weight: string | null }[];
        }
      >;
    }
  >();

  for (const row of rows) {
    if (!workoutMap.has(row.workoutId)) {
      workoutMap.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        startedAt: row.startedAt,
        exercises: new Map(),
      });
    }
    const workout = workoutMap.get(row.workoutId)!;

    if (row.workoutExerciseId) {
      if (!workout.exercises.has(row.workoutExerciseId)) {
        workout.exercises.set(row.workoutExerciseId, {
          id: row.workoutExerciseId,
          name: row.exerciseName!,
          order: row.exerciseOrder!,
          sets: [],
        });
      }
      const exercise = workout.exercises.get(row.workoutExerciseId)!;

      if (row.setId) {
        exercise.sets.push({
          id: row.setId,
          setNumber: row.setNumber,
          reps: row.reps,
          weight: row.weight,
        });
      }
    }
  }

  return Array.from(workoutMap.values()).map((w) => ({
    ...w,
    exercises: Array.from(w.exercises.values()),
  }));
}
