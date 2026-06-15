import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "./DatePicker";
import { getWorkoutsForUserOnDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const date = dateParam
    ? (() => { const [y, m, d] = dateParam.split("-").map(Number); return new Date(y, m - 1, d); })()
    : new Date();

  const workoutData = await getWorkoutsForUserOnDate(userId, date);

  return (
    <div className="w-3/4 mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Workout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Column 1: date picker */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <DatePicker selected={date} />
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
                <div key={workout.id} className="space-y-3">
                  {workout.name && (
                    <h3 className="font-medium">{workout.name}</h3>
                  )}
                  {workout.exercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
