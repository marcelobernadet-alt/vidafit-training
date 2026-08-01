import { createClient } from "@/lib/supabase/server";
import { WorkoutBuilder } from "@/components/admin/WorkoutBuilder";

export default async function NuevoEntrenamientoPage() {
  const supabase = createClient();
  const { data: groups } = await supabase.from("groups").select("*").order("name");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-8">
        <p className="eyebrow mb-1">Nuevo</p>
        <p className="text-2xl font-display font-semibold">Crear entrenamiento</p>
      </header>
      <WorkoutBuilder groups={groups ?? []} />
    </main>
  );
}
