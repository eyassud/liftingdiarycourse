"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { updateWorkoutAction } from "./actions";
import { toLocalDatetimeInput } from "@/lib/formatLocalDatetime";

type Props = {
  workoutId: string;
  initialName: string | null;
  initialStartedAt: Date;
};

export function EditWorkoutForm({ workoutId, initialName, initialStartedAt }: Props) {
  const [name, setName] = useState(initialName ?? "");
  const [date, setDate] = useState(
    toLocalDatetimeInput(initialStartedAt)
  );
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await updateWorkoutAction({ workoutId, name: name || undefined, startedAt: new Date(date) });
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Workout Name</Label>
          <Input
            id="name"
            placeholder="e.g. Push Day, Leg Day"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startedAt">Date & Time</Label>
          <Input
            id="startedAt"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={pending} className="flex-1">
            {pending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
