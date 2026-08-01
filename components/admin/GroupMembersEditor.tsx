"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "clsx";

interface Student {
  id: string;
  full_name: string;
}

export function GroupMembersEditor({
  groupId,
  allStudents,
  memberIds,
}: {
  groupId: string;
  allStudents: Student[];
  memberIds: string[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function toggle(studentId: string, isMember: boolean) {
    setPending(studentId);
    if (isMember) {
      await supabase.from("group_members").delete().eq("group_id", groupId).eq("profile_id", studentId);
    } else {
      await supabase.from("group_members").insert({ group_id: groupId, profile_id: studentId });
    }
    setPending(null);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {allStudents.map((s) => {
        const isMember = memberIds.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => toggle(s.id, isMember)}
            disabled={pending === s.id}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
              isMember
                ? "bg-lime text-black border-lime"
                : "bg-transparent text-ink-muted border-base-border hover:border-lime/50"
            )}
          >
            {s.full_name}
          </button>
        );
      })}
      {allStudents.length === 0 && <p className="text-xs text-ink-faint">No hay alumnos registrados todavía.</p>}
    </div>
  );
}
