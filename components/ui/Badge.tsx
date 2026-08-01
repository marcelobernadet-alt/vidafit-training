import { clsx } from "clsx";

type BadgeTone = "lime" | "neutral" | "warning";

const tones: Record<BadgeTone, string> = {
  lime: "bg-lime/15 text-lime border border-lime/30",
  neutral: "bg-base-border/40 text-ink-muted border border-base-border",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}
