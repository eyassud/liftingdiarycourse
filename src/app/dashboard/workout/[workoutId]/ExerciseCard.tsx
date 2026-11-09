"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { removeExerciseAction } from "./actions";
import { SetRow } from "./SetRow";
import { AddSetForm } from "./AddSetForm";

type Props = {
  workoutId: string;
  exercise: {
    id: string;
    name: string;
    sets: { id: string; setNumber: number; reps: number | null; weight: string | null }[];
  };
};

export function ExerciseCard({ workoutId, exercise }: Props) {
  const [pending, startTransition] = useTransition();
  const last = exercise.sets[exercise.sets.length - 1];

  return (
    <Card>
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">{exercise.name}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(() =>
                removeExerciseAction({ workoutId, workoutExerciseId: exercise.id })
              )
            }
          >
            {pending ? "Removing..." : "Remove"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercise.sets.length === 0 && (
          <p className="text-sm text-muted-foreground">No sets logged.</p>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Set</TableHead>
              <TableHead>Reps</TableHead>
              <TableHead>Weight (lbs)</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercise.sets.map((set) => (
              <SetRow key={set.id} workoutId={workoutId} set={set} />
            ))}
            <AddSetForm
              workoutId={workoutId}
              workoutExerciseId={exercise.id}
              nextSetNumber={exercise.sets.length + 1}
              defaultReps={last?.reps ?? null}
              defaultWeight={last?.weight ?? null}
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
