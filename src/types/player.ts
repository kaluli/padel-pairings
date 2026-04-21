export interface PlayerEntry {
  id: string;
  /** Nombre mostrado en pista */
  displayName: string;
  /** Nivel numérico (ej. 1.5); null si se añadió manualmente sin nivel */
  nivel: number | null;
  /** Mismo ID en el Excel → siempre pareja en la misma mitad de pista */
  parejaId?: number | null;
}
