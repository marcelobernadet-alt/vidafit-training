import { createClient } from "@/lib/supabase/server";
import { WorkoutBlockCard } from "@/components/workout/WorkoutBlockCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Workout } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function HoyPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const today = format(new Date(), "yyyy-MM-dd");

  // Grupos del alumno
  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("profile_id", user!.id);

  const groupIds = (memberships ?? []).map((m) => m.group_id);

  let workout: Workout | null = null;

  if (groupIds.length > 0) {
    const { data } = await supabase
      .from("workouts")
      .select("*, workout_sections(*), groups(id, name, color)")
      .in("group_id", groupIds)
      .eq("scheduled_date", today)
      .eq("status", "published")
      .limit(1)
      .maybeSingle();

    workout = data as Workout | null;
  }

  const sortedSections = workout?.workout_sections
    ? [...workout.workout_sections].sort((a, b) => a.position - b.position)
    : [];

  return (
    <main className="mx-auto max-w-md px-5 pt-8">
      <header className="mb-6">
        <p className="text-xl font-display font-bold tracking-tight">
          VIDA<span className="text-lime">FIT</span> TRAINING
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-2xl font-display font-semibold text-ink">
            Hola, {profile?.full_name?.split(" ")[0] ?? "atleta"}
          </p>
        </div>
        <p className="mt-1 text-sm text-ink-muted capitalize">
          {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </header>

      {!workout && (
        <Card className="text-center py-10">
          <p className="text-lg font-display font-semibold mb-1">Sin entrenamiento hoy</p>
          <p className="text-sm text-ink-muted">
            Todavía no hay un entrenamiento publicado para hoy en tu grupo. Revisá el calendario para ver los próximos.
          </p>
        </Card>
      )}

      {workout && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge tone="lime">{workout.groups?.name ?? "General"}</Badge>
            <p className="text-lg font-display font-semibold text-ink">{workout.title}</p>
          </div>

          {sortedSections.map((section) => (
            <WorkoutBlockCard key={section.id} section={section} />
          ))}
        </div>
      )}
    </main>
  );
}
