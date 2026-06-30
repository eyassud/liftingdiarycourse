import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "./DatePicker";
import { WorkoutTime } from "./WorkoutTime";
import { getWorkoutsForUserOnDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dateStr = dateParam ?? todayStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  const workoutData = await getWorkoutsForUserOnDate(userId, date);

  return (
    <div className="w-3/4 mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Workout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Column 1: date picker */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <DatePicker selected={dateStr} />
        </div>

        {/* Column 2: workouts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          {workoutData.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No workouts logged for this date.
            </p>
          ) : (
            <div className="space-y-6">
              {workoutData.map((workout) => (
                <Link key={workout.id} href={`/dashboard/workout/${workout.id}`} className="block">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-1">
                      <div className="flex items-baseline justify-between">
                        <CardTitle className="text-base font-bold">{workout.name ?? "Workout"}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          <WorkoutTime date={workout.startedAt} />
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {workout.exercises.length === 0 && (
                        <p className="text-sm text-muted-foreground">In progress</p>
                      )}
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.id}>
                          <p className="text-sm font-medium">{exercise.name}</p>
                          {exercise.sets.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No sets logged.</p>
                          ) : (
                            <div className="space-y-1">
                              {exercise.sets.map((set) => (
                                <p key={set.id} className="text-sm text-muted-foreground">
                                  Set {set.setNumber}
                                  {set.reps != null ? `: ${set.reps} reps` : ""}
                                  {set.weight != null ? ` @ ${set.weight}kg` : ""}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
