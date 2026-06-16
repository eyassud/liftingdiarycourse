"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout } from "@/data/workouts";

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
