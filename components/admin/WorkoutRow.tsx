"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Copy, Pencil, Trash2 } from "lucide-react";
import type { Workout } from "@/lib/types";

export function WorkoutRow({ workout }: { workout: Workout & { groups?: { name: string } } }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  async function duplicate() {
    setBusy(true);
    const { data: original } = await supabase
      .from("workouts")
      .select("*, workout_sections(*)")
      .eq("id", workout.id)
      .single();

    if (original) {
      const { data: newWorkout } = await supabase
        .from("workouts")
        .insert({
          title: `${original.title} (copia)`,
          scheduled_date: original.scheduled_date,
          group_id: original.group_id,
          status: "draft",
          created_by: original.created_by,
        })
        .select()
        .single();

      if (newWorkout && original.workout_sections?.length) {
        await supabase.from("workout_sections").insert(
          original.workout_sections.map((s: any) => ({
            workout_id: newWorkout.id,
            block_type: s.block_type,
            title: s.title,
            description: s.description,
            content: s.content,
            position: s.position,
          }))
        );
      }
    }
    setBusy(false);
    startTransition(() => router.refresh());
  }

  async function remove() {
    if (!confirm(`¿Eliminar "${workout.title}"? Esta acción no se puede deshacer.`)) return;
    setBusy(true);
    await supabase.from("workouts").delete().eq("id", workout.id);
    setBusy(false);
    startTransition(() => router.refresh());
  }

  async function togglePublish() {
    setBusy(true);
    await supabase
      .from("workouts")
      .update({ status: workout.status === "published" ? "draft" : "published" })
      .eq("id", workout.id);
    setBusy(false);
    startTransition(() => router.refresh());
  }

  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-display font-semibold">{workout.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
          <span>{workout.scheduled_date}</span>
          <span>·</span>
          <span>{workout.groups?.name}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={togglePublish}
          disabled={busy || isPending}
          className="mr-1"
          title="Cambiar estado de publicación"
        >
          <Badge tone={workout.status === "published" ? "lime" : "neutral"}>
            {workout.status === "published" ? "Publicado" : "Borrador"}
          </Badge>
        </button>
        <Link href={`/admin/entrenamientos/${workout.id}`} className="p-2 text-ink-muted hover:text-lime" title="Editar">
          <Pencil size={16} />
        </Link>
        <button onClick={duplicate} disabled={busy} className="p-2 text-ink-muted hover:text-lime" title="Duplicar">
          <Copy size={16} />
        </button>
        <button onClick={remove} disabled={busy} className="p-2 text-ink-muted hover:text-red-400" title="Eliminar">
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}
