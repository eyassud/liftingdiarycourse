"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { addSetAction } from "./actions";

type Props = {
  workoutId: string;
  workoutExerciseId: string;
  nextSetNumber: number;
  defaultReps: number | null;
  defaultWeight: string | null;
};

export function AddSetForm({
  workoutId,
  workoutExerciseId,
  nextSetNumber,
  defaultReps,
  defaultWeight,
}: Props) {
  const [reps, setReps] = useState(defaultReps ? String(defaultReps) : "");
  const [weight, setWeight] = useState(defaultWeight ? String(Number(defaultWeight)) : "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        await addSetAction({
          workoutId,
          workoutExerciseId,
          reps: Number(reps),
          weight: Number(weight),
        });
      } catch {
        setError("Enter valid reps and weight");
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <TableRow>
      <TableCell>{nextSetNumber}</TableCell>
      <TableCell>
        <Input
          type="number"
          min={1}
          step={1}
          placeholder="Reps"
          aria-label="Reps"
          className="w-24"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          step="any"
          placeholder="Weight"
          aria-label="Weight"
          className="w-28"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={submit} disabled={pending || !reps || !weight}>
            {pending ? "Adding..." : "Add Set"}
          </Button>
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </TableCell>
    </TableRow>
  );
}
