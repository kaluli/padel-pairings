import { PlayerAvatar } from "./PlayerAvatar";

export interface CourtPlayer {
  name: string;
}

export type CourtStatus = "ready" | "in-progress" | "waiting";

export interface PadelCourtProps {
  /** Court number / label shown in the header */
  courtNumber: number;
  /** Mitad inferior de la pista (cenital): pareja junto a la red en tu lado típico de diagrama */
  bottomHalfPlayers: CourtPlayer[];
  /** Mitad superior (otro lado de la red) */
  topHalfPlayers: CourtPlayer[];
  /** Court status — easy to wire to real data later */
  status?: CourtStatus;
}

/** ViewBox = 10 m × 20 m (ancho × largo cenital); encaja con aspect del rectángulo interior */
const VB_W = 200;
const VB_H = 357;
const Y_SVC = (3 / 20) * VB_H;
const Y_NET = VB_H / 2;
const Y_SVC_BOT = VB_H - Y_SVC;
const CX = VB_W / 2;

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
  bottomHalfPlayers,
  topHalfPlayers,
  status = "ready",
}: PadelCourtProps) => {
  const statusInfo = statusConfig[status];

  return (
    <div className="group bg-card rounded-2xl shadow-card hover:shadow-court transition-smooth border border-border/50 animate-fade-in">
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

      {/* Court (cenital): proporción ~10×20 m → más alta que ancha; red horizontal */}
      <div className="px-6 py-7 sm:px-7 sm:py-8 bg-muted/30">
        {/* ~10×20 m cenital; largo reducido ~15 % respecto a 10/21 → 10/17.85 ≈ 200/357 */}
        <div className="relative mx-auto aspect-[200/357] w-full max-w-[min(100%,280px)] overflow-visible rounded-xl shadow-court sm:max-w-[300px]">
          {/* Capa decorativa */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-court-surround shadow-[inset_0_1px_0_hsl(0_0%_100%/0.14)]">
            <div
              className="absolute inset-[9px] overflow-hidden rounded-[11px] ring-1 ring-white/35"
              style={{
                backgroundImage: [
                  "repeating-linear-gradient(90deg, hsl(0 0% 0% / 0.12) 0 1px, transparent 1px 18px)",
                  "repeating-linear-gradient(0deg, hsl(0 0% 100% / 0.07) 0 2px, transparent 2px 22px)",
                  "var(--gradient-court)",
                ].join(", "),
                boxShadow:
                  "inset 0 3px 36px hsl(165 75% 5% / 0.42), inset 0 -2px 20px hsl(215 60% 15% / 0.25)",
              }}
            >
              {/* Perímetro (sin SVG aquí: la capa de líneas va encima de los jugadores) */}
              <div className="absolute inset-3 rounded-[7px] border-[2.5px] border-white shadow-[0_0_0_1px_hsl(0_0%_0%/0.22),inset_0_1px_0_hsl(0_0%_100%/0.35)]" />
            </div>
          </div>

          {/* Jugadores debajo del trazado SVG para que las líneas blancas se vean encima */}
          <div className="relative z-[3] grid h-full w-full grid-rows-2">
            <div className="flex items-center justify-around px-3 pt-4 sm:px-5 sm:pt-6">
              {topHalfPlayers.map((p, i) => (
                <PlayerAvatar key={`T-${i}-${p.name}`} name={p.name} variant="accent" />
              ))}
            </div>
            <div className="flex items-center justify-around px-3 pb-4 sm:px-5 sm:pb-6">
              {bottomHalfPlayers.map((p, i) => (
                <PlayerAvatar key={`B-${i}-${p.name}`} name={p.name} variant="primary" />
              ))}
            </div>
          </div>

          {/* Trazado reglamentario encima del verde y de los avatares (esquema); mismo inset que borde interior 9px+12px */}
          <svg
            className="pointer-events-none absolute inset-[21px] z-[4] overflow-visible rounded-[7px]"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="none"
            aria-hidden
            shapeRendering="geometricPrecision"
          >
            <g stroke="#ffffff" strokeOpacity={0.98} strokeLinecap="square">
              <line x1="0" y1={Y_SVC} x2={VB_W} y2={Y_SVC} strokeWidth={2} />
              <line x1="0" y1={Y_SVC_BOT} x2={VB_W} y2={Y_SVC_BOT} strokeWidth={2} />
              <line x1="0" y1={Y_NET} x2={VB_W} y2={Y_NET} strokeWidth={3} />
              <line x1={CX} y1={Y_SVC} x2={CX} y2={Y_NET} strokeWidth={2} />
              <line x1={CX} y1={Y_NET} x2={CX} y2={Y_SVC_BOT} strokeWidth={2} />
            </g>
          </svg>
        </div>

        {/* Leyenda (vista cenital: red horizontal) */}
        <div className="mx-auto mt-3 flex max-w-[300px] flex-col gap-1 text-center text-[10px] font-bold uppercase tracking-wider">
          <span className="text-accent">▲ Equipo A</span>
          <span className="text-primary">▼ Equipo B</span>
        </div>
      </div>
    </div>
  );
};
