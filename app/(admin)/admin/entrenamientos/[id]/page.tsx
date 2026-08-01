import { createClient } from "@/lib/supabase/server";
import { WorkoutBuilder } from "@/components/admin/WorkoutBuilder";
import { notFound } from "next/navigation";

export default async function EditarEntrenamientoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: groups }, { data: workout }] = await Promise.all([
    supabase.from("groups").select("*").order("name"),
    supabase.from("workouts").select("*, workout_sections(*)").eq("id", params.id).maybeSingle(),
  ]);

  if (!workout) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-8">
        <p className="eyebrow mb-1">Editar</p>
        <p className="text-2xl font-display font-semibold">{workout.title}</p>
      </header>
      <WorkoutBuilder groups={groups ?? []} existingWorkout={workout as any} />
    </main>
  );
}
