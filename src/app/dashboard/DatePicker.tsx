"use client";

import { useRouter, usePathname } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";

export function DatePicker({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [y, m, d] = selected.split("-").map(Number);
  // react-day-picker v10 uses UTC dates internally, so pass UTC midnight
  const selectedDate = new Date(Date.UTC(y, m - 1, d));

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const params = new URLSearchParams();
    // Use UTC methods because react-day-picker v10 passes UTC-based dates to onSelect
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
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
