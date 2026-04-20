import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Shuffle, Users, Sparkles } from "lucide-react";

interface PlayerInputProps {
  players: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onShuffle: () => void;
  onLoadMock: () => void;
  onClear: () => void;
}

export const PlayerInput = ({
  players,
  onAdd,
  onRemove,
  onShuffle,
  onLoadMock,
  onClear,
}: PlayerInputProps) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const courts = Math.floor(players.length / 4);
  const leftover = players.length % 4;

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-bold text-base tracking-tight">Jugadores</h2>
          <p className="text-xs text-muted-foreground">Añade nombres y se generarán las pistas</p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nombre del jugador..."
          className="flex-1"
        />
        <Button onClick={handleAdd} className="bg-gradient-primary shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Añadir</span>
        </Button>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onLoadMock} className="text-xs">
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Cargar mock
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShuffle}
          disabled={players.length < 4}
          className="text-xs"
        >
          <Shuffle className="h-3.5 w-3.5 mr-1" />
          Sortear
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={players.length === 0}
          className="text-xs text-destructive hover:text-destructive"
        >
          Limpiar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Jugadores" value={players.length} />
        <Stat label="Pistas" value={courts} highlight />
        <Stat label="En espera" value={leftover} muted />
      </div>

      {/* Player chips */}
      {players.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {players.map((p, i) => (
              <Badge
                key={`${p}-${i}`}
                variant="secondary"
                className="pl-2.5 pr-1 py-1 gap-1 text-xs font-medium animate-fade-in"
              >
                {p}
                <button
                  onClick={() => onRemove(i)}
                  className="ml-0.5 hover:bg-destructive/20 hover:text-destructive rounded-full p-0.5 transition-smooth"
                  aria-label={`Eliminar ${p}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  muted?: boolean;
}) => (
  <div
    className={`rounded-xl p-3 text-center transition-smooth ${
      highlight
        ? "bg-gradient-primary text-primary-foreground shadow-glow"
        : muted
          ? "bg-muted text-muted-foreground"
          : "bg-secondary/40 text-foreground"
    }`}
  >
    <div className="text-xl font-bold leading-none">{value}</div>
    <div className="text-[10px] uppercase tracking-wider mt-1 font-semibold opacity-80">
      {label}
    </div>
  </div>
);
