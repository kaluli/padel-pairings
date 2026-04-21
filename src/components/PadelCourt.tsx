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
  /** Mitad superior = Equipo A — promedio de nivel de esa pareja (opcional) */
  promedioEquipoA?: number | null;
  /** Mitad inferior = Equipo B — promedio de nivel de esa pareja (opcional) */
  promedioEquipoB?: number | null;
  /** Court status — easy to wire to real data later */
  status?: CourtStatus;
}

const nivelFmt = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function PromedioChip({ value }: { value: number }) {
  return (
    <span className="ml-1.5 inline-flex items-baseline gap-0.5 tabular-nums normal-case tracking-normal font-semibold opacity-95">
      <span aria-hidden className="font-bold opacity-75">
        ·
      </span>
      <span>{nivelFmt.format(value)}</span>
    </span>
  );
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
  promedioEquipoA,
  promedioEquipoB,
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
          {/* Marco exterior + pista con proporción fija 200:357 (evita deformar mitades A/B al estirar el SVG) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-court-surround shadow-[inset_0_1px_0_hsl(0_0%_100%/0.14)]">
            <div className="absolute inset-[9px] flex items-center justify-center overflow-hidden rounded-[11px] ring-1 ring-white/35">
              <div className="relative aspect-[200/357] h-full max-h-full w-auto max-w-full min-h-0 min-w-0">
                {/* Superficie */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-[11px]"
                  style={{
                    backgroundImage: [
                      "repeating-linear-gradient(90deg, hsl(0 0% 0% / 0.12) 0 1px, transparent 1px 18px)",
                      "repeating-linear-gradient(0deg, hsl(0 0% 100% / 0.07) 0 2px, transparent 2px 22px)",
                      "var(--gradient-court)",
                    ].join(", "),
                    boxShadow:
                      "inset 0 3px 36px hsl(165 75% 5% / 0.42), inset 0 -2px 20px hsl(215 60% 15% / 0.25)",
                  }}
                />
                <div className="absolute inset-3 rounded-[7px] border-[2.5px] border-white shadow-[0_0_0_1px_hsl(0_0%_0%/0.22),inset_0_1px_0_hsl(0_0%_100%/0.35)]" />

                {/* Líneas debajo de avatares y textos */}
                <div className="pointer-events-none absolute inset-3 z-[2] overflow-hidden rounded-[7px]">
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox={`0 0 ${VB_W} ${VB_H}`}
                    preserveAspectRatio="none"
                    aria-hidden
                    shapeRendering="geometricPrecision"
                  >
                    <g stroke="#ffffff" strokeOpacity={0.98} strokeLinecap="butt">
                      <line x1="0" y1={Y_SVC} x2={VB_W} y2={Y_SVC} strokeWidth={2} />
                      <line x1="0" y1={Y_SVC_BOT} x2={VB_W} y2={Y_SVC_BOT} strokeWidth={2} />
                      <line x1={CX} y1={Y_SVC} x2={CX} y2={Y_NET} strokeWidth={2} />
                      <line x1={CX} y1={Y_NET} x2={CX} y2={Y_SVC_BOT} strokeWidth={2} />
                    </g>
                    {/* Red: aspecto malla — sombra suave + doble trazo punteado gris (vista cenital) */}
                    <g strokeLinecap="round">
                      <line
                        x1="0"
                        y1={Y_NET}
                        x2={VB_W}
                        y2={Y_NET}
                        stroke="hsl(210 25% 8% / 0.45)"
                        strokeWidth={5}
                        opacity={0.5}
                      />
                      <line
                        x1="0"
                        y1={Y_NET}
                        x2={VB_W}
                        y2={Y_NET}
                        stroke="hsl(210 14% 42%)"
                        strokeWidth={2.5}
                        strokeDasharray="5 8"
                      />
                      <line
                        x1="0"
                        y1={Y_NET}
                        x2={VB_W}
                        y2={Y_NET}
                        stroke="hsl(210 20% 78%)"
                        strokeWidth={1.2}
                        strokeDasharray="5 8"
                        strokeDashoffset={4}
                        opacity={0.75}
                      />
                    </g>
                  </svg>
                </div>

                {/* Jugadores por encima del trazado; pointer-events-auto porque el padre lleva pointer-events-none */}
                <div className="relative z-[4] grid h-full w-full grid-rows-2 pointer-events-auto">
                  <div className="flex items-center justify-around px-3 py-4 sm:px-5 sm:py-5">
                    {topHalfPlayers.map((p, i) => (
                      <PlayerAvatar key={`T-${i}-${p.name}`} name={p.name} variant="accent" />
                    ))}
                  </div>
                  <div className="flex items-center justify-around px-3 py-4 sm:px-5 sm:py-5">
                    {bottomHalfPlayers.map((p, i) => (
                      <PlayerAvatar key={`B-${i}-${p.name}`} name={p.name} variant="primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leyenda (vista cenital: red horizontal) */}
        <div className="mx-auto mt-3 flex max-w-[300px] flex-col gap-1 text-center text-[10px] font-bold uppercase tracking-wider">
          <span className="text-accent">
            ▲ Equipo A
            {promedioEquipoA != null && <PromedioChip value={promedioEquipoA} />}
          </span>
          <span className="text-primary">
            ▼ Equipo B
            {promedioEquipoB != null && <PromedioChip value={promedioEquipoB} />}
          </span>
        </div>
      </div>
    </div>
  );
};
