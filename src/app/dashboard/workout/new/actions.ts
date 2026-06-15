"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().optional(),
  startedAt: z.coerce.date(),
});

type Params = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: Params) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { name, startedAt } = createWorkoutSchema.parse(params);

  const workout = await createWorkout(userId, name ?? null, startedAt);

  redirect(`/dashboard`);
}
