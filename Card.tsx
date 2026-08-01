import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function AdminCalendarioPage() {
  const supabase = createClient();

  const today = new Date();
  const from = format(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd");
  const to = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), "yyyy-MM-dd");

  const { data: workouts } = await supabase
    .from("workouts")
    .select("*, groups(name)")
    .gte("scheduled_date", from)
    .lte("scheduled_date", to)
    .order("scheduled_date");

  const byDate = new Map<string, typeof workouts>();
  (workouts ?? []).forEach((w) => {
    const list = byDate.get(w.scheduled_date) ?? [];
    list.push(w);
    byDate.set(w.scheduled_date, list as any);
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <p className="eyebrow mb-1">Planificación</p>
        <p className="text-2xl font-display font-semibold capitalize">
          {format(today, "MMMM yyyy", { locale: es })}
        </p>
      </header>

      <div className="space-y-3">
        {[...byDate.entries()].map(([date, items]) => (
          <Card key={date}>
            <p className="mb-2 text-sm font-semibold text-ink-muted capitalize">
              {format(new Date(date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })}
            </p>
            <div className="space-y-2">
              {items!.map((w: any) => (
                <Link
                  key={w.id}
                  href={`/admin/entrenamientos/${w.id}`}
                  className="flex items-center justify-between rounded-lg border border-base-border px-3 py-2 text-sm hover:border-lime/40"
                >
                  <span>{w.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-faint">{w.groups?.name}</span>
                    <Badge tone={w.status === "published" ? "lime" : "neutral"}>
                      {w.status === "published" ? "Publicado" : "Borrador"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ))}

        {byDate.size === 0 && <p className="text-sm text-ink-muted">Sin entrenamientos programados este mes.</p>}
      </div>
    </main>
  );
}
