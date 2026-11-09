"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { updateSetAction, deleteSetAction } from "./actions";

type Props = {
  workoutId: string;
  set: { id: string; setNumber: number; reps: number | null; weight: string | null };
};

export function SetRow({ workoutId, set }: Props) {
  const [reps, setReps] = useState(String(set.reps ?? ""));
  const [weight, setWeight] = useState(String(Number(set.weight ?? 0)));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const dirty = reps !== String(set.reps ?? "") || weight !== String(Number(set.weight ?? 0));

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateSetAction({ workoutId, setId: set.id, reps: Number(reps), weight: Number(weight) });
      } catch {
        setError("Invalid values");
      }
    });
  }

  function remove() {
    startTransition(() => deleteSetAction({ workoutId, setId: set.id }));
  }

  return (
    <TableRow>
      <TableCell>{set.setNumber}</TableCell>
      <TableCell>
        <Input
          type="number"
          min={1}
          step={1}
          aria-label="Reps"
          className="w-24"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          step="any"
          aria-label="Weight"
          className="w-28"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {dirty && (
            <Button size="sm" onClick={save} disabled={pending}>
              Save
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={remove} disabled={pending}>
            Delete
          </Button>
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </TableCell>
    </TableRow>
  );
}
