"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function CreateGroupForm() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("groups").insert({ name, description, created_by: user!.id });
    setName("");
    setDescription("");
    setSaving(false);
    router.refresh();
  }

  return (
    <Card>
      <p className="eyebrow mb-3">Nuevo grupo</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field sm:flex-1"
          placeholder="Nombre (ej: CROSSFIT RX)"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field sm:flex-1"
          placeholder="Descripción (opcional)"
        />
        <Button type="submit" disabled={saving || !name}>
          {saving ? "Creando..." : "Crear grupo"}
        </Button>
      </form>
    </Card>
  );
}
