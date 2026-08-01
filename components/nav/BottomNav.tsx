"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { CalendarDays, Home, LineChart, User } from "lucide-react";

const items = [
  { href: "/hoy", label: "Hoy", icon: Home },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/progreso", label: "Progreso", icon: LineChart },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-base-border bg-base/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-1 py-3 text-[11px] font-medium tracking-wide transition-colors",
                  active ? "text-lime" : "text-ink-faint"
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {label.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
