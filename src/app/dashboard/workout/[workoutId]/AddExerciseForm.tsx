"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addExerciseAction } from "./actions";

type Props = {
  workoutId: string;
  exercises: { id: string; name: string }[];
};

export function AddExerciseForm({ workoutId, exercises }: Props) {
  const [exerciseId, setExerciseId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    if (!exerciseId) return;
    startTransition(async () => {
      await addExerciseAction({ workoutId, exerciseId });
      setExerciseId("");
    });
  }

  return (
    <div className="flex gap-3 max-w-md">
      <Select value={exerciseId} onValueChange={setExerciseId}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select an exercise" />
        </SelectTrigger>
        <SelectContent>
          {exercises.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleAdd} disabled={!exerciseId || pending}>
        {pending ? "Adding..." : "Add Exercise"}
      </Button>
    </div>
  );
}
