"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WeekCalendar } from "@/components/calendar/WeekCalendar";
import { WorkoutBlockCard } from "@/components/workout/WorkoutBlockCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Workout } from "@/lib/types";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

export default function CalendarioPage() {
  const supabase = createClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const weekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberships } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("profile_id", user.id);

      const groupIds = (memberships ?? []).map((m) => m.group_id);
      if (groupIds.length === 0) {
        setWorkouts([]);
        setLoading(false);
        return;
      }

      const from = format(weekStart, "yyyy-MM-dd");
      const to = format(addDays(weekStart, 6), "yyyy-MM-dd");

      const { data } = await supabase
        .from("workouts")
        .select("*, workout_sections(*), groups(id, name, color)")
        .in("group_id", groupIds)
        .eq("status", "published")
        .gte("scheduled_date", from)
        .lte("scheduled_date", to);

      setWorkouts((data as Workout[]) ?? []);
      setLoading(false);
    }
    load();
  }, [weekStart]); // eslint-disable-line react-hooks/exhaustive-deps

  const dayEntries = weekDays.map((date) => ({
    date,
    workout: workouts.find((w) => w.scheduled_date === format(date, "yyyy-MM-dd")) ?? null,
  }));

  const selected = dayEntries.find((d) => format(d.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"));
  const sections = selected?.workout?.workout_sections
    ? [...selected.workout.workout_sections].sort((a, b) => a.position - b.position)
    : [];

  return (
    <main className="mx-auto max-w-md px-5 pt-8">
      <header className="mb-6">
        <p className="eyebrow mb-1">Calendario</p>
        <p className="text-2xl font-display font-semibold capitalize">
          {format(weekStart, "MMMM yyyy", { locale: es })}
        </p>
      </header>

      <WeekCalendar days={dayEntries} selectedDate={selectedDate} onSelect={setSelectedDate} />

      <div className="mt-6 space-y-4">
        {loading && <p className="text-sm text-ink-faint">Cargando...</p>}

        {!loading && selected?.workout?.is_rest_day && (
          <Card className="text-center py-8">
            <Badge tone="neutral">Descanso</Badge>
            <p className="mt-2 text-sm text-ink-muted">Día de descanso programado.</p>
          </Card>
        )}

        {!loading && selected?.workout && !selected.workout.is_rest_day && (
          <>
            <div className="flex items-center gap-2">
              <Badge tone="lime">{selected.workout.groups?.name ?? "General"}</Badge>
              <p className="text-lg font-display font-semibold">{selected.workout.title}</p>
            </div>
            {sections.map((section) => (
              <WorkoutBlockCard key={section.id} section={section} />
            ))}
          </>
        )}

        {!loading && !selected?.workout && (
          <Card className="text-center py-8">
            <p className="text-sm text-ink-muted">No hay entrenamiento publicado para este día.</p>
          </Card>
        )}
      </div>
    </main>
  );
}
