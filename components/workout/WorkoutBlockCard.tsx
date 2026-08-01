import { Card } from "@/components/ui/Card";
import { BLOCK_LABELS, type WorkoutSection } from "@/lib/types";
import { clsx } from "clsx";

export function WorkoutBlockCard({ section }: { section: WorkoutSection }) {
  const isNotes = section.block_type === "coach_notes";

  return (
    <Card className={clsx(isNotes && "bg-lime/[0.06] border-lime/25")}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className={clsx("eyebrow", isNotes && "text-lime")}>{BLOCK_LABELS[section.block_type]}</p>
        {section.description && (
          <p className="text-xs font-medium text-ink-muted text-right">{section.description}</p>
        )}
      </div>

      {section.title && !isNotes && (
        <p className="mb-2 text-lg font-display font-semibold text-ink">{section.title}</p>
      )}

      <div className="whitespace-pre-line text-sm leading-relaxed text-ink-muted">
        {section.content}
      </div>
    </Card>
  );
}
