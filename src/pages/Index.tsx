import { useMemo, useState } from "react";
import { PlayerInput } from "@/components/PlayerInput";
import { PadelCourt } from "@/components/PadelCourt";
import { MOCK_PLAYERS, buildCourts, shuffle } from "@/lib/padel";
import { Trophy } from "lucide-react";

const Index = () => {
  const [players, setPlayers] = useState<string[]>([]);
  // Bumping this seed re-randomizes positions on shuffle
  const [seed, setSeed] = useState(0);

  const orderedPlayers = useMemo(() => {
    // seed is intentionally a dependency to trigger reshuffle
    void seed;
    return shuffle(players);
  }, [players, seed]);

  const courts = useMemo(() => buildCourts(orderedPlayers), [orderedPlayers]);
  const leftover = players.length % 4;
  const waitingPlayers = orderedPlayers.slice(orderedPlayers.length - leftover);

  const handleAdd = (name: string) => setPlayers((p) => [...p, name]);
  const handleRemove = (i: number) => setPlayers((p) => p.filter((_, idx) => idx !== i));
  const handleShuffle = () => setSeed((s) => s + 1);
  const handleLoadMock = () => setPlayers(MOCK_PLAYERS.slice(0, 8));
  const handleClear = () => setPlayers([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero border-b border-border/50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-glow/20 backdrop-blur shadow-glow">
              <Trophy className="h-5 w-5 text-primary-glow" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground tracking-tight">
                Padel Match Builder
              </h1>
              <p className="text-xs sm:text-sm text-primary-foreground/70">
                Organiza partidos y asigna jugadores a las pistas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Sidebar - Input */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PlayerInput
              players={players}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onShuffle={handleShuffle}
              onLoadMock={handleLoadMock}
              onClear={handleClear}
            />
          </aside>

          {/* Courts grid */}
          <section>
            {courts.length === 0 ? (
              <EmptyState count={players.length} />
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-lg font-bold tracking-tight">
                    {courts.length} {courts.length === 1 ? "Pista" : "Pistas"} generadas
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {courts.length * 4} jugando
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {courts.map((c, i) => (
                    <PadelCourt
                      key={`court-${i}-${seed}`}
                      courtNumber={i + 1}
                      leftPlayers={c.left.map((name) => ({ name }))}
                      rightPlayers={c.right.map((name) => ({ name }))}
                      status={i === 0 ? "in-progress" : "ready"}
                    />
                  ))}
                </div>

                {waitingPlayers.length > 0 && (
                  <div className="mt-6 bg-card rounded-2xl border border-dashed border-border p-5 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <h3 className="font-bold text-sm">En espera ({waitingPlayers.length})</h3>
                      <span className="text-xs text-muted-foreground ml-auto">
                        Añade {4 - waitingPlayers.length} más para una pista nueva
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {waitingPlayers.map((name, i) => (
                        <span
                          key={`w-${i}`}
                          className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

const EmptyState = ({ count }: { count: number }) => (
  <div className="h-full min-h-[400px] flex items-center justify-center bg-card rounded-2xl border-2 border-dashed border-border p-8 text-center animate-fade-in">
    <div className="max-w-sm">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
        <Trophy className="h-7 w-7 text-primary-foreground" />
      </div>
      <h3 className="font-bold text-lg tracking-tight">Aún no hay pistas</h3>
      <p className="text-sm text-muted-foreground mt-1.5">
        {count === 0
          ? "Añade jugadores para empezar. Cada 4 jugadores se generará una pista nueva automáticamente."
          : `Tienes ${count} jugador${count === 1 ? "" : "es"}. Necesitas ${4 - count} más para crear la primera pista.`}
      </p>
    </div>
  </div>
);

export default Index;
