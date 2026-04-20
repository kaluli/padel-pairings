# Padel Match Builder

**Herramienta para organizar tus pozos de pádel.** Subes **un solo archivo Excel** (o CSV) con la lista de jugadores y sus niveles, y obtienes **todas las pistas asignadas** al momento: parejas rivales claras y distribución ordenada por nivel, sin hojas de cálculo manuales ni sorteos en papel.

Ideal para clubes, torneos abiertos o quedadas donde hay que repartir a todo el mundo en pistas de 4 jugadores de forma rápida y coherente.

---

## Qué hace esta app

1. **Importas** tu archivo con columnas **Nombre**, **Apellido** y **Nivel**.
2. La app **agrupa de 4 en 4** para formar pistas (2 parejas por pista).
3. **Ordena por nivel** para que la distribución refleje el nivel real de cada jugador en la vista (las pistas se organizan según ese criterio al venir del Excel).
4. Puedes **añadir o quitar jugadores** a mano, **sortear** el orden si quieres aleatoriedad, o **limpiar** y empezar de nuevo.

Todo ocurre en el navegador; no hace falta instalar nada más que el navegador para usar la versión desplegada.

---

## Formato del archivo de importación

La app lee **la primera hoja** del libro (por ejemplo `Hoja1`). La primera fila debe ser **cabecera** con nombres de columnas.

### Columnas obligatorias (nombre exacto recomendado)

| Columna    | Descripción |
|------------|-------------|
| **Nombre** | Nombre del jugador. |
| **Apellido** | Apellido(s). Si está vacío pero hay nombre, se usa solo el nombre. |
| **Nivel** | Valor numérico del nivel (ej. `1.5`, `2`, `3.25`). Se admiten **coma o punto** como decimal (`1,6` ≡ `1.6`). |

### Columnas opcionales

| Columna | Descripción |
|---------|-------------|
| **Nº** | Índice o número de orden; **no es obligatorio** para la importación. La app lo ignora para formar parejas y pistas. |

Cualquier otra columna extra en el archivo (por ejemplo una columna **Pista** para organización externa) **no afecta** al cálculo dentro de la aplicación.

### Ejemplo de filas válidas

| Nº | Nombre | Apellido | Nivel |
|----|--------|----------|-------|
| 1 | Carlos | Gómez | 1.5 |
| 2 | Marta | Ruiz | 1.6 |

### Reglas prácticas

- **Formatos**: `.xlsx`, `.xls`, `.csv`.
- Se omiten las filas **sin nombre ni apellido** (vacías).
- Debe haber **al menos un nivel válido** en el conjunto; si ninguna fila tiene **Nivel** interpretable como número, la importación falla.
- Los jugadores se muestran **ordenados por nivel** (menor nivel hacia las pistas “inferiores” en la vista al importar desde archivo). Cada **4 jugadores** completan una pista (4 jugadores por pista).

En el repo hay un ejemplo: **`Orden pistas.xlsx`**.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Por defecto Vite usa el puerto configurado en `vite.config.ts` (actualmente **8080** si está libre).

## Build

```bash
npm run build
```

Salida en la carpeta `dist/`.

## Despliegue

El proyecto incluye `vercel.json` pensado para **Vite + React Router** en [Vercel](https://vercel.com).
