"use client";

export function WorkoutTime({ date }: { date: Date }) {
  return (
    <>
      {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
    </>
  );
}
