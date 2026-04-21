import { useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { usePadelPlayers } from "@/context/PadelPlayersContext";

export function SpreadsheetUpload() {
  const { loadPlayersFromSpreadsheet } = usePadelPlayers();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setLoading(true);
    const sheet = await import("@/lib/spreadsheet");
    try {
      const entries = await sheet.parsePadelSpreadsheet(file);
      loadPlayersFromSpreadsheet(entries);
    } catch (err) {
      const message =
        err instanceof sheet.SpreadsheetParseError
          ? err.message
          : "No se pudo procesar el archivo.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <FileSpreadsheet className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm tracking-tight">Subir Archivo</h3>
          <p className="text-xs text-muted-foreground">
            Columnas: Nombre, Apellidos, Nivel (o Nivel Playtomic), ParejaID opcional (.xlsx / .csv)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="padel-spreadsheet" className="sr-only">
          Cargar lista de jugadores
        </Label>
        <input
          ref={inputRef}
          id="padel-spreadsheet"
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 text-xs"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5 shrink-0" />
          {loading ? "Leyendo…" : "Importar Excel / CSV"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error al importar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
