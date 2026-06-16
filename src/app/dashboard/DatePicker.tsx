"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

export function DatePicker({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [y, m, d] = selected.split("-").map(Number);
  const selectedDate = new Date(y, m - 1, d);

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const params = new URLSearchParams();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    params.set("date", `${year}-${month}-${day}`);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={handleSelect}
      className="rounded-md border w-fit"
    />
  );
}
