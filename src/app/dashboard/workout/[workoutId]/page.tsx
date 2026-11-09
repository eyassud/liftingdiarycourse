import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { getWorkoutWithLogById } from "@/data/workouts";
import { getAllExercises } from "@/data/exercises";
import { EditWorkoutForm } from "./EditWorkoutForm";
import { AddExerciseForm } from "./AddExerciseForm";
import { ExerciseCard } from "./ExerciseCard";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const { userId } = await auth();
  if (!userId) notFound();

  const [log, catalogue] = await Promise.all([
    getWorkoutWithLogById(workoutId, userId),
    getAllExercises(),
  ]);
  if (!log) notFound();
  const { workout, exercises } = log;

  return (
    <div className="w-3/4 mx-auto p-8 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-8">Edit Workout</h1>
        <Card className="max-w-md">
          <EditWorkoutForm
            workoutId={workout.id}
            initialName={workout.name}
            initialStartedAt={workout.startedAt}
          />
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <span className="text-sm text-muted-foreground">
            {format(workout.startedAt, "do MMM yyyy")}
          </span>
        </div>

        <AddExerciseForm
          workoutId={workout.id}
          exercises={catalogue.map((e) => ({ id: e.id, name: e.name }))}
        />

        {exercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">No exercises yet.</p>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} workoutId={workout.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
