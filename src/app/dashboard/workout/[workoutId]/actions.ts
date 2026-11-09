"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateWorkout, addExerciseToWorkout, removeWorkoutExercise } from "@/data/workouts";
import { addSet, updateSet, deleteSet } from "@/data/sets";

const updateWorkoutSchema = z.object({
  workoutId: z.uuid(),
  name: z.string().optional(),
  startedAt: z.coerce.date(),
});

type Params = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(params: Params) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, name, startedAt } = updateWorkoutSchema.parse(params);

  await updateWorkout(workoutId, userId, { name: name ?? null, startedAt });

  redirect("/dashboard");
}

const addExerciseSchema = z.object({
  workoutId: z.uuid(),
  exerciseId: z.uuid(),
});

export async function addExerciseAction(params: z.infer<typeof addExerciseSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, exerciseId } = addExerciseSchema.parse(params);
  const created = await addExerciseToWorkout(workoutId, userId, exerciseId);
  if (!created) throw new Error("Workout not found");

  revalidatePath(`/dashboard/workout/${workoutId}`);
}

const removeExerciseSchema = z.object({
  workoutId: z.uuid(),
  workoutExerciseId: z.uuid(),
});

export async function removeExerciseAction(params: z.infer<typeof removeExerciseSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, workoutExerciseId } = removeExerciseSchema.parse(params);
  if (!(await removeWorkoutExercise(workoutExerciseId, userId))) throw new Error("Not found");

  revalidatePath(`/dashboard/workout/${workoutId}`);
}

const setValuesSchema = {
  reps: z.number().int().positive().max(1000),
  weight: z.number().nonnegative().max(9999.99),
};

const addSetSchema = z.object({
  workoutId: z.uuid(),
  workoutExerciseId: z.uuid(),
  ...setValuesSchema,
});

export async function addSetAction(params: z.infer<typeof addSetSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, workoutExerciseId, reps, weight } = addSetSchema.parse(params);
  if (!(await addSet(workoutExerciseId, userId, { reps, weight }))) throw new Error("Not found");

  revalidatePath(`/dashboard/workout/${workoutId}`);
}

const updateSetSchema = z.object({
  workoutId: z.uuid(),
  setId: z.uuid(),
  ...setValuesSchema,
});

export async function updateSetAction(params: z.infer<typeof updateSetSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, setId, reps, weight } = updateSetSchema.parse(params);
  if (!(await updateSet(setId, userId, { reps, weight }))) throw new Error("Not found");

  revalidatePath(`/dashboard/workout/${workoutId}`);
}

const deleteSetSchema = z.object({
  workoutId: z.uuid(),
  setId: z.uuid(),
});

export async function deleteSetAction(params: z.infer<typeof deleteSetSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { workoutId, setId } = deleteSetSchema.parse(params);
  if (!(await deleteSet(setId, userId))) throw new Error("Not found");

  revalidatePath(`/dashboard/workout/${workoutId}`);
}
