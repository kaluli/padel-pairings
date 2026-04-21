import type { PlayerEntry } from "@/types/player";

/** Orden ascendente por nivel; sin nivel al final */
export function sortPlayersByNivel(players: PlayerEntry[]): PlayerEntry[] {
  return [...players].sort(comparePlayersByNivelAscending);
}

function comparePlayersByNivelAscending(a: PlayerEntry, b: PlayerEntry): number {
  const na = a.nivel;
  const nb = b.nivel;
  if (na === null && nb === null) return 0;
  if (na === null) return 1;
  if (nb === null) return -1;
  return na - nb;
}

/**
 * Promedio de nivel de los dos jugadores de la pareja (incluye parejas con distinto puntaje).
 * Ese valor decide en qué pista van (junto con las demás parejas, de menor a mayor).
 * Si solo uno tiene nivel, se usa ese; si ninguno, van al final del orden.
 */
function pairLevelPromedio(a: PlayerEntry, b: PlayerEntry): number {
  const na = a.nivel;
  const nb = b.nivel;
  if (na !== null && nb !== null) {
    return (na + nb) / 2;
  }
  if (na !== null) return na;
  if (nb !== null) return nb;
  return Number.POSITIVE_INFINITY;
}

/**
 * Promedio de nivel para pintar junto a Equipo A/B (dos jugadores por mitad de pista).
 * Coincide con la lógica del Excel: si solo uno tiene nivel, se muestra ese valor.
 */
export function averageNivelForCourtHalf(displayNames: string[], roster: PlayerEntry[]): number | null {
  const resolved = displayNames
    .slice(0, 2)
    .map((name) => roster.find((p) => p.displayName === name))
    .filter((p): p is PlayerEntry => Boolean(p));
  if (resolved.length === 0) return null;
  if (resolved.length === 1) return resolved[0].nivel;
  const na = resolved[0].nivel;
  const nb = resolved[1].nivel;
  if (na !== null && nb !== null) return (na + nb) / 2;
  if (na !== null) return na;
  if (nb !== null) return nb;
  return null;
}

type PairUnit = readonly [PlayerEntry, PlayerEntry];

function sortPairInternally(pair: PairUnit): PairUnit {
  const [x, y] = [...pair].sort(comparePlayersByNivelAscending);
  return [x, y];
}

/**
 * Orden para `buildCourts`: cada bloque de 4 es [pareja izq][pareja der].
 * Si hay `parejaId` en el Excel, esas dos personas no se separan.
 * Las parejas se ordenan por el promedio de nivel de sus dos jugadores (puntajes distintos → media).
 * Sin parejas fijas, equivale a `sortPlayersByNivel`.
 */
export function orderPlayersForCourts(players: PlayerEntry[]): PlayerEntry[] {
  const hasFixedPairs = players.some((p) => typeof p.parejaId === "number");
  if (!hasFixedPairs) {
    return sortPlayersByNivel(players);
  }

  const fixed = new Map<number, PlayerEntry[]>();
  const singles: PlayerEntry[] = [];

  for (const p of players) {
    if (typeof p.parejaId === "number") {
      const list = fixed.get(p.parejaId) ?? [];
      list.push(p);
      fixed.set(p.parejaId, list);
    } else {
      singles.push(p);
    }
  }

  const pairUnits: PairUnit[] = [];

  for (const [parejaId, arr] of fixed) {
    if (arr.length !== 2) {
      throw new Error(
        `ParejaID debe aparecer exactamente dos veces por número (ID ${parejaId}: ${arr.length} filas).`,
      );
    }
    pairUnits.push(sortPairInternally([arr[0], arr[1]]));
  }

  const sortedSingles = [...singles].sort(comparePlayersByNivelAscending);
  if (sortedSingles.length % 2 !== 0) {
    throw new Error(
      "Sin parejaID, hace falta un número par de jugadores sueltos para formar parejas.",
    );
  }
  for (let i = 0; i < sortedSingles.length; i += 2) {
    pairUnits.push(sortPairInternally([sortedSingles[i], sortedSingles[i + 1]]));
  }

  pairUnits.sort((pa, pb) => {
    const sa = pairLevelPromedio(pa[0], pa[1]);
    const sb = pairLevelPromedio(pb[0], pb[1]);
    return sa - sb;
  });

  const flat: PlayerEntry[] = [];
  let u = 0;
  while (u + 1 < pairUnits.length) {
    const left = pairUnits[u];
    const right = pairUnits[u + 1];
    flat.push(left[0], left[1], right[0], right[1]);
    u += 2;
  }
  if (u < pairUnits.length) {
    const rest = pairUnits[u];
    flat.push(rest[0], rest[1]);
  }

  return flat;
}

/** Fisher-Yates shuffle (immutable) */
export const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** left/right = parejas rivales; en UI cenital left → mitad inferior, right → mitad superior */
export interface CourtAssignment {
  left: string[];
  right: string[];
}

/**
 * Splits a list of players into courts of 4 (2 vs 2).
 * Leftover players (less than 4) are ignored from court generation.
 */
export const buildCourts = (players: string[]): CourtAssignment[] => {
  const courts: CourtAssignment[] = [];
  const fullCourts = Math.floor(players.length / 4);
  for (let i = 0; i < fullCourts; i++) {
    const slice = players.slice(i * 4, i * 4 + 4);
    courts.push({
      left: [slice[0], slice[1]],
      right: [slice[2], slice[3]],
    });
  }
  return courts;
};
