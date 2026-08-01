import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { CreateGroupForm } from "@/components/admin/CreateGroupForm";
import { GroupMembersEditor } from "@/components/admin/GroupMembersEditor";

export default async function GruposPage() {
  const supabase = createClient();

  const [{ data: groups }, { data: students }, { data: memberships }] = await Promise.all([
    supabase.from("groups").select("*").order("name"),
    supabase.from("profiles").select("id, full_name").eq("role", "student").order("full_name"),
    supabase.from("group_members").select("group_id, profile_id"),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6">
        <p className="eyebrow mb-1">Organización</p>
        <p className="text-2xl font-display font-semibold">Grupos</p>
      </header>

      <div className="mb-6">
        <CreateGroupForm />
      </div>

      <div className="space-y-4">
        {(groups ?? []).map((g) => {
          const memberIds = (memberships ?? []).filter((m) => m.group_id === g.id).map((m) => m.profile_id);
          return (
            <Card key={g.id}>
              <div className="mb-3">
                <p className="font-display font-semibold">{g.name}</p>
                {g.description && <p className="text-xs text-ink-faint">{g.description}</p>}
              </div>
              <GroupMembersEditor groupId={g.id} allStudents={students ?? []} memberIds={memberIds} />
            </Card>
          );
        })}
        {(groups ?? []).length === 0 && <p className="text-sm text-ink-muted">Todavía no creaste ningún grupo.</p>}
      </div>
    </main>
  );
}
