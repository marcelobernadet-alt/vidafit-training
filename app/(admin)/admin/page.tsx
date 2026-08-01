import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { Dumbbell, PlusCircle, Users, LayoutGrid } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const [{ count: workoutsCount }, { count: studentsCount }, { count: groupsCount }, { data: todayWorkouts }] =
    await Promise.all([
      supabase.from("workouts").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("groups").select("*", { count: "exact", head: true }),
      supabase.from("workouts").select("*, groups(name)").eq("scheduled_date", today),
    ]);

  const stats = [
    { label: "Entrenamientos", value: workoutsCount ?? 0, icon: Dumbbell },
    { label: "Alumnos", value: studentsCount ?? 0, icon: Users },
    { label: "Grupos", value: groupsCount ?? 0, icon: LayoutGrid },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Panel del coach</p>
          <p className="text-2xl font-display font-semibold">Dashboard</p>
        </div>
        <Link href="/admin/entrenamientos/nuevo" className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          Crear entrenamiento
        </Link>
      </header>

      <div className="mb-8 grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <Icon size={18} className="mb-3 text-lime" />
            <p className="text-2xl font-display font-bold">{value}</p>
            <p className="text-xs text-ink-faint">{label}</p>
          </Card>
        ))}
      </div>

      <p className="eyebrow mb-3">Publicados hoy</p>
      <div className="space-y-3">
        {(todayWorkouts ?? []).length === 0 && (
          <Card>
            <p className="text-sm text-ink-muted">Todavía no creaste ningún entrenamiento para hoy.</p>
          </Card>
        )}
        {(todayWorkouts ?? []).map((w: any) => (
          <Card key={w.id} className="flex items-center justify-between">
            <div>
              <p className="font-display font-semibold">{w.title}</p>
              <p className="text-xs text-ink-faint">{w.groups?.name}</p>
            </div>
            <Badge tone={w.status === "published" ? "lime" : "neutral"}>
              {w.status === "published" ? "Publicado" : "Borrador"}
            </Badge>
          </Card>
        ))}
      </div>
    </main>
  );
}
