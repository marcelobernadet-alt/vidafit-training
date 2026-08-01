"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { CalendarDays, Dumbbell, LayoutGrid, PlusCircle, Users } from "lucide-react";
import { SignOutButton } from "@/components/nav/SignOutButton";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/entrenamientos/nuevo", label: "Crear entrenamiento", icon: PlusCircle },
  { href: "/admin/entrenamientos", label: "Entrenamientos", icon: Dumbbell },
  { href: "/admin/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/admin/alumnos", label: "Alumnos", icon: Users },
  { href: "/admin/grupos", label: "Grupos", icon: LayoutGrid },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-base-border md:px-4 md:py-8">
      <p className="mb-8 px-2 text-lg font-display font-bold tracking-tight">
        VIDA<span className="text-lime">FIT</span>
        <span className="ml-1 block text-xs font-medium tracking-widest text-ink-faint">COACH</span>
      </p>

      <nav className="flex-1 space-y-1">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-lime text-black" : "text-ink-muted hover:bg-base-soft"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <SignOutButton />
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const mobileItems = items.slice(0, 5);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-base-border bg-base/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
      {mobileItems.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium",
              active ? "text-lime" : "text-ink-faint"
            )}
          >
            <Icon size={20} />
            {label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
