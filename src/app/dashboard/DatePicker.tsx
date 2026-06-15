"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

export function DatePicker({ selected }: { selected: Date }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const params = new URLSearchParams();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    params.set("date", `${y}-${m}-${day}`);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      className="rounded-md border w-fit"
    />
  );
}
