import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./EditWorkoutForm";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const { userId } = await auth();
  if (!userId) notFound();

  const workout = await getWorkoutById(workoutId, userId);
  if (!workout) notFound();

  return (
    <div className="w-3/4 mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Edit Workout</h1>
      <Card className="max-w-md">
        <EditWorkoutForm
          workoutId={workout.id}
          initialName={workout.name}
          initialStartedAt={workout.startedAt}
        />
      </Card>
    </div>
  );
}
