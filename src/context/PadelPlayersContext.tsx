import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PlayerEntry } from "@/types/player";
import { shuffle, orderPlayersForCourts } from "@/lib/padel";

type PadelPlayersContextValue = {
  players: PlayerEntry[];
  /** Lista ya ordenada para pintar pistas (por nivel o aleatoria) */
  orderedPlayers: PlayerEntry[];
  /** Si true, las pistas siguen el orden por nivel (Excel) hasta que se pulse Sortear */
  isLevelOrdering: boolean;
  addPlayer: (name: string) => void;
  removePlayer: (index: number) => void;
  loadPlayersFromSpreadsheet: (entries: PlayerEntry[]) => void;
  clear: () => void;
  shuffleSeed: number;
  bumpShuffle: () => void;
};

const PadelPlayersContext = createContext<PadelPlayersContextValue | null>(null);

export function PadelPlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [isLevelOrdering, setIsLevelOrdering] = useState(false);

  const orderedPlayers = useMemo(() => {
    if (isLevelOrdering) {
      return orderPlayersForCourts(players);
    }
    void shuffleSeed;
    return shuffle([...players]);
  }, [players, isLevelOrdering, shuffleSeed]);

  const addPlayer = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayers((p) => [
      ...p,
      { id: crypto.randomUUID(), displayName: trimmed, nivel: null },
    ]);
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayers((p) => p.filter((_, i) => i !== index));
  }, []);

  const loadPlayersFromSpreadsheet = useCallback((entries: PlayerEntry[]) => {
    setPlayers(entries);
    setIsLevelOrdering(true);
    setShuffleSeed(0);
  }, []);

  const clear = useCallback(() => {
    setPlayers([]);
    setIsLevelOrdering(false);
    setShuffleSeed(0);
  }, []);

  const bumpShuffle = useCallback(() => {
    setIsLevelOrdering(false);
    setShuffleSeed((s) => s + 1);
  }, []);

  const value = useMemo(
    () => ({
      players,
      orderedPlayers,
      isLevelOrdering,
      addPlayer,
      removePlayer,
      loadPlayersFromSpreadsheet,
      clear,
      shuffleSeed,
      bumpShuffle,
    }),
    [
      players,
      orderedPlayers,
      isLevelOrdering,
      addPlayer,
      removePlayer,
      loadPlayersFromSpreadsheet,
      clear,
      shuffleSeed,
      bumpShuffle,
    ],
  );

  return <PadelPlayersContext.Provider value={value}>{children}</PadelPlayersContext.Provider>;
}

export function usePadelPlayers(): PadelPlayersContextValue {
  const ctx = useContext(PadelPlayersContext);
  if (!ctx) {
    throw new Error("usePadelPlayers debe usarse dentro de PadelPlayersProvider");
  }
  return ctx;
}
