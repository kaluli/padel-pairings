import type { PlayerEntry } from "@/types/player";

export const MOCK_PLAYERS = [
  "Karina",
  "Julieta",
  "Andrea",
  "Sam",
  "Alex",
  "Robin",
  "Noa",
  "Dani",
  "Cris",
  "Mika",
  "Lou",
  "Toni",
];

/** Orden ascendente por nivel; sin nivel al final */
export function sortPlayersByNivel(players: PlayerEntry[]): PlayerEntry[] {
  return [...players].sort((a, b) => {
    const na = a.nivel;
    const nb = b.nivel;
    if (na === null && nb === null) return 0;
    if (na === null) return 1;
    if (nb === null) return -1;
    return na - nb;
  });
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
