import { WebApp } from 'meteor/webapp';
import { IncomingMessage, ServerResponse } from 'http';

// Public environment variable keys exposed to the dashboard and /api/env
const PUBLIC_KEYS = ['APP_NAME', 'API_URL', 'ENVIRONMENT', 'VERSION'] as const;

function envValue(key: string): string {
  const val = (process.env[key] ?? '').trim();
  return val || 'Not set';
}

// ---------------------------------------------------------------------------
// GET /health — health check for container orchestration
// ---------------------------------------------------------------------------
WebApp.connectHandlers.use('/health', (_req: IncomingMessage, res: ServerResponse, _next: Function) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', service: 'servercompass-meteor-demo' }));
});

// ---------------------------------------------------------------------------
// GET /api/env — JSON list of public environment variables
// ---------------------------------------------------------------------------
WebApp.connectHandlers.use('/api/env', (_req: IncomingMessage, res: ServerResponse, _next: Function) => {
  const envs = PUBLIC_KEYS.map((key) => ({ key, value: envValue(key) }));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ envs }));
});

// ---------------------------------------------------------------------------
// GET / — HTML dashboard with Server Compass dark theme
// ---------------------------------------------------------------------------
WebApp.connectHandlers.use('/', (req: IncomingMessage, res: ServerResponse, next: Function) => {
  // Only intercept the exact root path; pass everything else down the chain
  if (req.url !== '/') return next();

  const envRows = PUBLIC_KEYS.map((key) => {
    const value = envValue(key);
    const valueClass = value === 'Not set' ? 'value not-set' : 'value';
    return `
        <div class="env-row">
          <span class="key">${key}</span>
          <span class="${valueClass}">${value}</span>
        </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Server Compass — Meteor Demo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg:      #0c1427;
      --surface: #121c33;
      --border:  #1f2c44;
      --text:    #e9efff;
      --muted:   #a8bad8;
      --accent:  #6ee7d3;
      --accent-2:#7fb7ff;
      --warning: #f5d06f;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Manrope', sans-serif;
      background: linear-gradient(160deg, #0a0f1f 0%, #0b1729 50%, #0b1224 100%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      padding: 28px 32px;
      border-bottom: 1px solid var(--border);
      background: rgba(12, 20, 39, 0.7);
      backdrop-filter: blur(8px);
    }

    .eyebrow {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 6px;
    }

    header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
    }

    .meta {
      margin-top: 4px;
      font-size: 13px;
      color: var(--muted);
    }

    main {
      flex: 1;
      padding: 40px 32px;
      max-width: 780px;
      width: 100%;
      margin: 0 auto;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    }

    .card-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-2);
      margin-bottom: 18px;
    }

    .env-grid {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .env-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 0;
      border-bottom: 1px solid var(--border);
    }

    .env-row:last-child { border-bottom: none; }

    .key {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--accent-2);
    }

    .value {
      font-size: 13px;
      color: var(--text);
      font-family: 'Manrope', monospace;
    }

    .value.not-set { color: var(--warning); }

    .private-section { margin-top: 8px; }

    .private-label {
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12px;
      font-weight: 500;
      background: rgba(31, 44, 68, 0.8);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 5px 14px;
      color: var(--muted);
      letter-spacing: 0.02em;
    }

    .api-hint {
      margin-top: 18px;
      font-size: 13px;
      color: var(--muted);
    }

    .api-hint code {
      font-family: 'Space Grotesk', monospace;
      color: var(--accent);
      background: rgba(110, 231, 211, 0.08);
      border: 1px solid rgba(110, 231, 211, 0.2);
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 12px;
    }

    footer {
      padding: 20px 32px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 12px;
      color: var(--muted);
    }

    footer a {
      color: var(--accent);
      text-decoration: none;
    }

    footer a:hover { text-decoration: underline; }

    @media (max-width: 600px) {
      header, main, footer { padding-left: 20px; padding-right: 20px; }
      .env-row { flex-direction: column; align-items: flex-start; gap: 4px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="eyebrow">Meteor demo</div>
    <h1>Server Compass — Environment Variables</h1>
    <div class="meta">Served by Meteor ${Meteor.release} + Node.js + New commit + test deployment history 2nd time! ${process.version}</div>
  </header>

  <main>
    <div class="card">
      <div class="card-title">Public Environment Variables</div>
      <div class="env-grid">
        ${envRows}
      </div>
      <div class="api-hint">
        JSON output available at <code>/api/env</code> &nbsp;&middot;&nbsp; Health check at <code>/health</code>
      </div>
    </div>

    <div class="card private-section">
      <div class="card-title">Private Variables</div>
      <div class="private-label">
        These variables are loaded server-side only and are never sent to the browser.
      </div>
      <div class="pill-list">
        <span class="pill">DATABASE_URL</span>
        <span class="pill">API_SECRET_KEY</span>
      </div>
    </div>
  </main>

  <footer>
    Deployed with <a href="https://servercompass.app/" target="_blank" rel="noopener">Server Compass</a>
    &nbsp;&middot;&nbsp; self-host anything, anywhere
  </footer>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});
