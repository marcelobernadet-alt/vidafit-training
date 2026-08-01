import { Card } from "@/components/ui/Card";
import { LineChart, Trophy, Dumbbell } from "lucide-react";

export default function ProgresoPage() {
  return (
    <main className="mx-auto max-w-md px-5 pt-8">
      <header className="mb-6">
        <p className="eyebrow mb-1">Tu evolución</p>
        <p className="text-2xl font-display font-semibold">Progreso</p>
      </header>

      <Card className="text-center py-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lime/10 text-lime">
          <LineChart size={26} />
        </div>
        <p className="text-lg font-display font-semibold mb-1">Muy pronto</p>
        <p className="text-sm text-ink-muted max-w-xs mx-auto">
          Acá vas a poder ver tu historial de entrenamientos, PRs y evolución de cargas.
        </p>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card className="py-6 text-center opacity-50">
          <Trophy size={20} className="mx-auto mb-2 text-ink-faint" />
          <p className="text-xs text-ink-faint">Leaderboard</p>
        </Card>
        <Card className="py-6 text-center opacity-50">
          <Dumbbell size={20} className="mx-auto mb-2 text-ink-faint" />
          <p className="text-xs text-ink-faint">PRs</p>
        </Card>
      </div>
    </main>
  );
}
