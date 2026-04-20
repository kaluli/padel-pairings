export interface PlayerEntry {
  id: string;
  /** Nombre mostrado en pista */
  displayName: string;
  /** Nivel numérico (ej. 1.5); null si se añadió manualmente sin nivel */
  nivel: number | null;
}
