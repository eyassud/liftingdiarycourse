"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createWorkoutAction } from "./actions";
import { toLocalDatetimeInput } from "@/lib/formatLocalDatetime";

export default function NewWorkoutPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => toLocalDatetimeInput(new Date()));
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await createWorkoutAction({ name: name || undefined, startedAt: new Date(date) });
  }

  return (
    <div className="w-3/4 mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Create New Workout</h1>
      <Card className="max-w-md">

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
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Creating..." : "Create Workout"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
