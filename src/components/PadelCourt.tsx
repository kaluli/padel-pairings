import { PlayerAvatar } from "./PlayerAvatar";

export interface CourtPlayer {
  name: string;
}

export type CourtStatus = "ready" | "in-progress" | "waiting";

export interface PadelCourtProps {
  /** Court number / label shown in the header */
  courtNumber: number;
  /** Players on the left side of the net (max 2) */
  leftPlayers: CourtPlayer[];
  /** Players on the right side of the net (max 2) */
  rightPlayers: CourtPlayer[];
  /** Court status — easy to wire to real data later */
  status?: CourtStatus;
}

const statusConfig: Record<CourtStatus, { label: string; className: string }> = {
  ready: {
    label: "Lista",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  "in-progress": {
    label: "En juego",
    className: "bg-accent/15 text-accent border-accent/30 animate-pulse",
  },
  waiting: {
    label: "En espera",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export const PadelCourt = ({
  courtNumber,
  leftPlayers,
  rightPlayers,
  status = "ready",
}: PadelCourtProps) => {
  const statusInfo = statusConfig[status];

  return (
    <div className="group bg-card rounded-2xl shadow-card hover:shadow-court transition-smooth overflow-hidden border border-border/50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-hero">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-glow/20 text-primary-glow font-bold text-sm">
            {courtNumber}
          </div>
          <h3 className="text-primary-foreground font-bold text-base tracking-tight">
            Pista {courtNumber}
          </h3>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Court (cenital view) */}
      <div className="p-5 bg-muted/30">
        <div
          className="relative aspect-[4/3] rounded-xl bg-gradient-court shadow-court overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 22px, hsl(0 0% 100% / 0.04) 22px 23px)",
          }}
        >
          {/* Outer court lines */}
          <div className="absolute inset-3 border-2 border-court-line/90 rounded-md" />

          {/* Service line - left side */}
          <div className="absolute top-3 bottom-3 left-[28%] w-0.5 bg-court-line/80" />
          {/* Service line - right side */}
          <div className="absolute top-3 bottom-3 right-[28%] w-0.5 bg-court-line/80" />

          {/* Horizontal service line */}
          <div className="absolute left-[28%] right-[28%] top-1/2 h-0.5 bg-court-line/80 -translate-y-1/2" />

          {/* Net */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-court-net shadow-[0_0_12px_hsl(var(--court-net)/0.6)]">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, hsl(0 0% 100% / 0.4) 0 2px, transparent 2px 4px)",
              }}
            />
          </div>

          {/* Players - Left side */}
          <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col items-center justify-around py-6">
            {leftPlayers.map((p, i) => (
              <PlayerAvatar key={`L-${i}-${p.name}`} name={p.name} variant="primary" />
            ))}
          </div>

          {/* Players - Right side */}
          <div className="absolute inset-y-0 right-0 w-1/2 flex flex-col items-center justify-around py-6">
            {rightPlayers.map((p, i) => (
              <PlayerAvatar key={`R-${i}-${p.name}`} name={p.name} variant="accent" />
            ))}
          </div>
        </div>

        {/* Side labels */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-bold uppercase tracking-wider">
          <div className="text-center text-primary">◀ Izquierda</div>
          <div className="text-center text-accent">Derecha ▶</div>
        </div>
      </div>
    </div>
  );
};
