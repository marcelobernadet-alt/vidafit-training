import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WorkoutRow } from "@/components/admin/WorkoutRow";
import { PlusCircle } from "lucide-react";

export default async function EntrenamientosPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  const q = searchParams.q ?? "";

  let query = supabase
    .from("workouts")
    .select("*, workout_sections(*), groups(name)")
    .order("scheduled_date", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);

  const { data: workouts } = await query;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Biblioteca</p>
          <p className="text-2xl font-display font-semibold">Entrenamientos</p>
        </div>
        <Link href="/admin/entrenamientos/nuevo" className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          Nuevo
        </Link>
      </header>

      <form className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar entrenamiento por título..."
          className="input-field"
        />
      </form>

      <div className="space-y-3">
        {(workouts ?? []).length === 0 && <p className="text-sm text-ink-muted">No se encontraron entrenamientos.</p>}
        {(workouts ?? []).map((w: any) => (
          <WorkoutRow key={w.id} workout={w} />
        ))}
      </div>
    </main>
  );
}
