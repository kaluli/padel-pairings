import { useMemo } from "react";
import { PlayerInput } from "@/components/PlayerInput";
import { PadelCourt } from "@/components/PadelCourt";
import { buildCourts } from "@/lib/padel";
import { usePadelPlayers } from "@/context/PadelPlayersContext";
import { Trophy } from "lucide-react";

const Index = () => {
  const {
    players,
    orderedPlayers,
    isLevelOrdering,
    addPlayer,
    removePlayer,
    bumpShuffle,
    clear,
    shuffleSeed,
  } = usePadelPlayers();

  const namesInCourtOrder = useMemo(
    () => orderedPlayers.map((p) => p.displayName),
    [orderedPlayers],
  );

  const courtsRaw = useMemo(() => buildCourts(namesInCourtOrder), [namesInCourtOrder]);

  /** Con orden por nivel: las pistas inferiores (abajo en la cuadrícula) agrupan el nivel más bajo */
  const courts = useMemo(() => {
    if (!isLevelOrdering) return courtsRaw;
    return [...courtsRaw].reverse();
  }, [courtsRaw, isLevelOrdering]);

  const leftover = players.length % 4;
  const waitingNames = namesInCourtOrder.slice(namesInCourtOrder.length - leftover);

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
              <p className="text-xs sm:text-sm text-primary-foreground/70 mt-1">
                Organiza partidos y asigna jugadores a las pistas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Sidebar - Input */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PlayerInput
              players={players}
              onAdd={addPlayer}
              onRemove={removePlayer}
              onShuffle={bumpShuffle}
              onClear={clear}
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

                {isLevelOrdering && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Orden por nivel: arriba en la lista los de mayor nivel; abajo los de menor nivel. Pareja:
                    dos jugadores en la misma mitad de pista (mismo lado de la red); rivales en la otra mitad.
                  </p>
                )}

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {courts.map((c, i) => (
                    <PadelCourt
                      key={`court-${i}-${shuffleSeed}-${isLevelOrdering}`}
                      courtNumber={i + 1}
                      bottomHalfPlayers={c.left.map((name) => ({ name }))}
                      topHalfPlayers={c.right.map((name) => ({ name }))}
                      status={i === 0 ? "in-progress" : "ready"}
                    />
                  ))}
                </div>

                {waitingNames.length > 0 && (
                  <div className="mt-6 bg-card rounded-2xl border border-dashed border-border p-5 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <h3 className="font-bold text-sm">En espera ({waitingNames.length})</h3>
                      <span className="text-xs text-muted-foreground ml-auto">
                        Añade {4 - waitingNames.length} más para una pista nueva
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {waitingNames.map((name, i) => (
                        <span
                          key={`w-${name}-${i}`}
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

      <footer className="mt-auto border-t border-primary/20 bg-primary/[0.06] py-2">
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-primary sm:text-[11px]">
          by{" "}
          <a
            href="https://www.linkedin.com/in/karina-pangaro/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline-offset-4 hover:underline decoration-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:rounded-sm"
          >
            kalu
          </a>
        </p>
      </footer>
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
          ? "Importa un Excel/CSV o añade jugadores. Cada 4 jugadores se generará una pista nueva automáticamente."
          : `Tienes ${count} jugador${count === 1 ? "" : "es"}. Necesitas ${4 - count} más para crear la primera pista.`}
      </p>
    </div>
  </div>
);

export default Index;
