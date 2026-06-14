"use client";

import { useState } from "react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MOCK_WORKOUTS = [
  { id: 1, name: "Bench Press", sets: 4, reps: 8, weight: 80 },
  { id: 2, name: "Squat", sets: 3, reps: 5, weight: 120 },
  { id: 3, name: "Deadlift", sets: 3, reps: 3, weight: 150 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="w-3/4 mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Workout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Column 1: date picker */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => { if (d) setDate(d); }}
            className="rounded-md border w-fit"
          />
        </div>

        {/* Column 2: workouts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          {MOCK_WORKOUTS.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No workouts logged for this date.
            </p>
          ) : (
            <div className="space-y-3">
              {MOCK_WORKOUTS.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
