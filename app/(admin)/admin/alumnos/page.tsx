import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AlumnosPage() {
  const supabase = createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, group_members(groups(name))")
    .eq("role", "student")
    .order("full_name");

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <p className="eyebrow mb-1">Comunidad</p>
        <p className="text-2xl font-display font-semibold">Alumnos</p>
      </header>

      <div className="space-y-3">
        {(students ?? []).length === 0 && <p className="text-sm text-ink-muted">Todavía no hay alumnos registrados.</p>}
        {(students ?? []).map((s: any) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/15 text-lime font-display font-semibold">
                {s.full_name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-medium">{s.full_name}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {s.group_members?.length === 0 && <span className="text-xs text-ink-faint">Sin grupo</span>}
              {s.group_members?.map((gm: any, i: number) => (
                <Badge key={i} tone="neutral">
                  {gm.groups?.name}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
