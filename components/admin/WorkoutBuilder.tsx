"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BLOCK_LABELS, type BlockType, type Group, type Workout, type WorkoutSection } from "@/lib/types";
import { GripVertical, Plus, Trash2 } from "lucide-react";

const BLOCK_TYPES: BlockType[] = [
  "warmup",
  "strength",
  "skill",
  "conditioning",
  "accessory",
  "cooldown",
  "coach_notes",
];

interface DraftSection {
  tempId: string;
  block_type: BlockType;
  title: string;
  description: string;
  content: string;
}

function emptySection(block_type: BlockType = "warmup"): DraftSection {
  return { tempId: crypto.randomUUID(), block_type, title: "", description: "", content: "" };
}

export function WorkoutBuilder({
  groups,
  existingWorkout,
}: {
  groups: Group[];
  existingWorkout?: Workout;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(existingWorkout?.title ?? "");
  const [date, setDate] = useState(existingWorkout?.scheduled_date ?? "");
  const [groupId, setGroupId] = useState(existingWorkout?.group_id ?? groups[0]?.id ?? "");
  const [sections, setSections] = useState<DraftSection[]>(
    existingWorkout?.workout_sections?.length
      ? [...existingWorkout.workout_sections]
          .sort((a, b) => a.position - b.position)
          .map((s) => ({
            tempId: s.id,
            block_type: s.block_type,
            title: s.title,
            description: s.description ?? "",
            content: s.content,
          }))
      : [emptySection()]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateSection(tempId: string, patch: Partial<DraftSection>) {
    setSections((prev) => prev.map((s) => (s.tempId === tempId ? { ...s, ...patch } : s)));
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }

  function removeSection(tempId: string) {
    setSections((prev) => prev.filter((s) => s.tempId !== tempId));
  }

  function moveSection(index: number, direction: -1 | 1) {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save(status: "draft" | "published") {
    setError(null);
    if (!title || !date || !groupId) {
      setError("Completá fecha, título y grupo.");
      return;
    }
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let workoutId = existingWorkout?.id;

    if (workoutId) {
      const { error: updateError } = await supabase
        .from("workouts")
        .update({ title, scheduled_date: date, group_id: groupId, status })
        .eq("id", workoutId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      await supabase.from("workout_sections").delete().eq("workout_id", workoutId);
    } else {
      const { data, error: insertError } = await supabase
        .from("workouts")
        .insert({ title, scheduled_date: date, group_id: groupId, status, created_by: user!.id })
        .select()
        .single();
      if (insertError || !data) {
        setError(insertError?.message ?? "No se pudo crear el entrenamiento.");
        setSaving(false);
        return;
      }
      workoutId = data.id;
    }

    const rows = sections.map((s, i) => ({
      workout_id: workoutId,
      block_type: s.block_type,
      title: s.title,
      description: s.description || null,
      content: s.content,
      position: i,
    }));

    if (rows.length > 0) {
      const { error: sectionsError } = await supabase.from("workout_sections").insert(rows);
      if (sectionsError) {
        setError(sectionsError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push("/admin/entrenamientos");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Título del entrenamiento</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Ej: Semana 3 - Día 2"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Grupo</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="input-field">
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={section.tempId}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-ink-faint" />
                <select
                  value={section.block_type}
                  onChange={(e) => updateSection(section.tempId, { block_type: e.target.value as BlockType })}
                  className="bg-transparent text-sm font-semibold text-lime uppercase tracking-wide focus:outline-none"
                >
                  {BLOCK_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-base text-ink">
                      {BLOCK_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveSection(index, -1)} className="p-1.5 text-ink-faint hover:text-ink" aria-label="Subir bloque">
                  ↑
                </button>
                <button onClick={() => moveSection(index, 1)} className="p-1.5 text-ink-faint hover:text-ink" aria-label="Bajar bloque">
                  ↓
                </button>
                <button onClick={() => removeSection(section.tempId)} className="p-1.5 text-red-400 hover:text-red-300" aria-label="Eliminar bloque">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <input
                value={section.title}
                onChange={(e) => updateSection(section.tempId, { title: e.target.value })}
                className="input-field"
                placeholder="Título (ej: Back Squat)"
              />
              <input
                value={section.description}
                onChange={(e) => updateSection(section.tempId, { description: e.target.value })}
                className="input-field"
                placeholder="Formato (ej: 3 rounds, AMRAP 15', 5 x 5 @ 75%)"
              />
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.tempId, { content: e.target.value })}
                className="input-field min-h-[100px] resize-y"
                placeholder={"Contenido del bloque, ej:\n10 Air Squats\n10 Push Ups\n200 m Run"}
              />
            </div>
          </Card>
        ))}

        <button
          onClick={addSection}
          className="flex w-full items-center justify-center gap-2 rounded-xl2 border border-dashed border-base-border py-4 text-sm text-ink-muted hover:border-lime hover:text-lime transition-colors"
        >
          <Plus size={16} />
          Agregar bloque
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" disabled={saving} onClick={() => save("draft")} className="flex-1">
          Guardar borrador
        </Button>
        <Button disabled={saving} onClick={() => save("published")} className="flex-1">
          {saving ? "Guardando..." : "Publicar"}
        </Button>
      </div>
    </div>
  );
}
