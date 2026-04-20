/** Genera un documento HTML descargable con las pistas y jugadores en espera. */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type CourtPairings = { left: string[]; right: string[] };

export interface ExportCourtsHtmlParams {
  courts: CourtPairings[];
  waitingNames: string[];
  isLevelOrdering: boolean;
}

export function buildCourtsHtmlDocument({
  courts,
  waitingNames,
  isLevelOrdering,
}: ExportCourtsHtmlParams): string {
  const title = `Padel Match Builder — ${courts.length} ${courts.length === 1 ? "pista" : "pistas"}`;
  const generatedAt = new Date().toLocaleString("es", { dateStyle: "medium", timeStyle: "short" });

  const courtBlocks = courts
    .map((c, i) => {
      const n = i + 1;
      const [b1, b2] = c.left;
      const [t1, t2] = c.right;
      return `
        <article class="court">
          <header class="court-head">
            <span class="court-num">${n}</span>
            <h2>Pista ${n}</h2>
          </header>
          <div class="court-body">
            <section class="half">
              <h3>Pareja arriba</h3>
              <ul>
                <li>${escapeHtml(t1)}</li>
                <li>${escapeHtml(t2)}</li>
              </ul>
            </section>
            <div class="net" role="presentation">Red</div>
            <section class="half">
              <h3>Pareja abajo</h3>
              <ul>
                <li>${escapeHtml(b1)}</li>
                <li>${escapeHtml(b2)}</li>
              </ul>
            </section>
          </div>
        </article>`;
    })
    .join("\n");

  const waitingSection =
    waitingNames.length === 0
      ? ""
      : `
        <section class="waiting">
          <h2>En espera (${waitingNames.length})</h2>
          <ul class="chips">
            ${waitingNames.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}
          </ul>
        </section>`;

  const levelNote = isLevelOrdering
    ? `<p class="note">Orden por nivel: las pistas listadas siguen la distribución por nivel del Excel.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="Padel Match Builder" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #f4faf7;
      --card: #ffffff;
      --text: #0f2920;
      --muted: #5c7269;
      --accent: #127a52;
      --border: #cfe8dc;
      --accent-soft: #e8f5ef;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.45;
      padding: 1.25rem;
      max-width: 42rem;
      margin-inline: auto;
    }
    header.doc {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border);
    }
    header.doc h1 {
      font-size: 1.25rem;
      margin: 0 0 0.35rem;
    }
    header.doc .meta {
      font-size: 0.8rem;
      color: var(--muted);
      margin: 0;
    }
    .note {
      font-size: 0.85rem;
      color: var(--muted);
      margin: 0 0 1.25rem;
    }
    .court {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(15, 41, 32, 0.06);
    }
    .court-head {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #127a52, #1a9d6a);
      color: #f0fdf7;
    }
    .court-num {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: rgba(255,255,255,0.2);
      font-weight: 700;
      font-size: 0.9rem;
    }
    .court-head h2 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
    }
    .court-body {
      padding: 1rem 1.1rem 1.15rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .half h3 {
      margin: 0 0 0.4rem;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      font-weight: 600;
    }
    .half ul {
      margin: 0;
      padding-left: 1.2rem;
    }
    .half li { margin: 0.15rem 0; }
    .net {
      text-align: center;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--muted);
      padding: 0.25rem;
      border-top: 3px solid var(--accent);
      border-bottom: 3px solid var(--accent);
      background: var(--accent-soft);
    }
    .waiting {
      margin-top: 1.5rem;
      padding: 1rem;
      border: 2px dashed var(--border);
      border-radius: 1rem;
      background: var(--card);
    }
    .waiting h2 {
      margin: 0 0 0.75rem;
      font-size: 0.95rem;
    }
    .chips {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }
    .chips li {
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: #eef3f0;
      color: var(--muted);
      font-size: 0.8rem;
    }
    footer.doc {
      margin-top: 2rem;
      font-size: 0.75rem;
      color: var(--muted);
      text-align: center;
    }
  </style>
</head>
<body>
  <header class="doc">
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">Generado el ${escapeHtml(generatedAt)} · ${courts.length * 4} jugando</p>
  </header>
  ${levelNote}
  ${courtBlocks}
  ${waitingSection}
  <footer class="doc">
    <p>Padel Match Builder · <a href="https://padel-pairings.vercel.app/">padel-pairings.vercel.app</a></p>
  </footer>
</body>
</html>`;
}

export function downloadCourtsHtml(params: ExportCourtsHtmlParams): void {
  const html = buildCourtsHtmlDocument(params);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `padel-pistas-${Date.now()}.html`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
