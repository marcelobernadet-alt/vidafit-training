import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "@/components/nav/SignOutButton";

export default async function PerfilPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user!.id)
    .single();

  const { data: memberships } = await supabase
    .from("group_members")
    .select("groups(id, name)")
    .eq("profile_id", user!.id);

  return (
    <main className="mx-auto max-w-md px-5 pt-8">
      <header className="mb-6">
        <p className="eyebrow mb-1">Mi cuenta</p>
        <p className="text-2xl font-display font-semibold">Perfil</p>
      </header>

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-black text-lg font-display font-bold">
            {profile?.full_name?.charAt(0).toUpperCase() ?? "V"}
          </div>
          <div>
            <p className="text-lg font-display font-semibold">{profile?.full_name}</p>
            <p className="text-xs text-ink-faint">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <p className="eyebrow mb-3">Mis grupos</p>
        <div className="flex flex-wrap gap-2">
          {(memberships ?? []).length === 0 && (
            <p className="text-sm text-ink-muted">Todavía no pertenecés a ningún grupo.</p>
          )}
          {(memberships ?? []).map((m: any) => (
            <Badge key={m.groups?.id} tone="lime">
              {m.groups?.name}
            </Badge>
          ))}
        </div>
      </Card>

      <SignOutButton />
    </main>
  );
}
