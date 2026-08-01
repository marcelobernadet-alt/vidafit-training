import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav, AdminMobileNav } from "@/components/nav/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "coach") redirect("/hoy");

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 pb-24 md:pb-0">{children}</div>
      <AdminMobileNav />
    </div>
  );
}
