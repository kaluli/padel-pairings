import * as XLSX from "xlsx";
import type { PlayerEntry } from "@/types/player";

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return String(value).trim();
}

function parseNivel(raw: unknown): number | null {
  const s = normalizeCell(raw).replace(",", ".");
  if (!s) return null;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function rowDisplayName(nombre: string, apellido: string): string {
  return [nombre, apellido].filter(Boolean).join(" ").trim();
}

function parseParejaId(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const s = normalizeCell(raw);
  if (!s) return null;
  const n = Number.parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function validateParejaStructure(entries: PlayerEntry[]): void {
  const byId = new Map<number, PlayerEntry[]>();
  const singles: PlayerEntry[] = [];

  for (const e of entries) {
    if (typeof e.parejaId === "number") {
      const arr = byId.get(e.parejaId) ?? [];
      arr.push(e);
      byId.set(e.parejaId, arr);
    } else {
      singles.push(e);
    }
  }

  for (const [id, arr] of byId) {
    if (arr.length !== 2) {
      throw new SpreadsheetParseError(
        `ParejaID ${id} debe tener exactamente 2 jugadores (hay ${arr.length}).`,
      );
    }
  }

  const hasFixedPairs = byId.size > 0;
  if (hasFixedPairs && singles.length % 2 !== 0) {
    throw new SpreadsheetParseError(
      "Los jugadores sin ParejaID deben ser en número par para formar parejas.",
    );
  }
}

/** Lee la primera fila como cabeceras y devuelve filas como objetos */
function sheetToRows(sheet: XLSX.WorkSheet): Record<string, unknown>[] {
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });
}

function getCell(row: Record<string, unknown>, candidates: string[]): unknown {
  const keys = Object.keys(row);
  for (const cand of candidates) {
    const low = cand.toLowerCase();
    const hit = keys.find((k) => k.trim().toLowerCase() === low);
    if (hit !== undefined) return row[hit];
  }
  return "";
}

export class SpreadsheetParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpreadsheetParseError";
  }
}

/**
 * Parsea .xlsx o .csv con Nombre; Apellido(s); Nivel o Nivel Playtomic; ParejaID opcional.
 */
export async function parsePadelSpreadsheet(file: File): Promise<PlayerEntry[]> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "xlsx" && ext !== "csv") {
    throw new SpreadsheetParseError("El archivo debe ser .xlsx o .csv.");
  }

  const buf = await file.arrayBuffer();
  if (buf.byteLength === 0) {
    throw new SpreadsheetParseError("El archivo está vacío.");
  }

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buf, { type: "array" });
  } catch {
    throw new SpreadsheetParseError("No se pudo leer el archivo. Comprueba el formato.");
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new SpreadsheetParseError("El archivo no contiene hojas de datos.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = sheetToRows(sheet);

  if (rows.length === 0) {
    throw new SpreadsheetParseError("No hay filas de datos en el archivo.");
  }

  const entries: PlayerEntry[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const nombre = normalizeCell(getCell(row, ["Nombre"]));
    const apellido = normalizeCell(getCell(row, ["Apellido", "Apellidos"]));
    const nivelRaw = getCell(row, ["Nivel", "Nivel Playtomic"]);
    const parejaRaw = getCell(row, ["ParejaID", "Pareja Id", "Pareja"]);
    const displayName = rowDisplayName(nombre, apellido);

    if (!displayName) continue;

    const nivel = parseNivel(nivelRaw);
    const parejaId = parseParejaId(parejaRaw);
    entries.push({
      id: crypto.randomUUID(),
      displayName,
      nivel,
      ...(parejaId !== null ? { parejaId } : {}),
    });
  }

  if (entries.length === 0) {
    throw new SpreadsheetParseError(
      "No se encontraron jugadores con nombre. Revisa las columnas Nombre y Apellido.",
    );
  }

  const missingNivel = entries.filter((e) => e.nivel === null).length;
  if (missingNivel === entries.length) {
    throw new SpreadsheetParseError(
      'No se pudo leer la columna de nivel ("Nivel" o "Nivel Playtomic"); usa valores como 1,5 o 2.',
    );
  }

  validateParejaStructure(entries);

  return entries;
}
