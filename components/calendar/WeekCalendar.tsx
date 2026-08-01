"use client";

import { clsx } from "clsx";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Workout } from "@/lib/types";

interface DayEntry {
  date: Date;
  workout: Workout | null;
}

export function WeekCalendar({
  days,
  selectedDate,
  onSelect,
}: {
  days: DayEntry[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map(({ date, workout }) => {
        const active = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, new Date());
        const state = workout?.is_rest_day
          ? "rest"
          : workout
          ? "published"
          : "empty";

        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelect(date)}
            className={clsx(
              "flex flex-col items-center rounded-xl py-2.5 transition-colors",
              active ? "bg-lime text-black" : "bg-base-soft border border-base-border text-ink"
            )}
          >
            <span className={clsx("text-[10px] font-medium uppercase", active ? "text-black/60" : "text-ink-faint")}>
              {format(date, "EEEEE", { locale: es })}
            </span>
            <span className={clsx("mt-1 text-sm font-semibold", isToday && !active && "text-lime")}>
              {format(date, "d")}
            </span>
            <span
              className={clsx(
                "mt-1.5 h-1.5 w-1.5 rounded-full",
                state === "published" && (active ? "bg-black" : "bg-lime"),
                state === "rest" && (active ? "bg-black/40" : "bg-ink-faint"),
                state === "empty" && "bg-transparent"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
