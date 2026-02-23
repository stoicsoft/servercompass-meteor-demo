# Meteor Demo - Server Compass

> A production-ready [Meteor](https://www.meteor.com/) 3.x application template for self-hosting with [Server Compass](https://servercompass.app/)

Deploy this Meteor application to any VPS in minutes. Server Compass is the modern way to self host Meteor applications — no Galaxy subscription required.

## About

This demo is a real Meteor 3.x project (not a fake Express server). It uses:

- **Meteor 3.1** with async/await support
- **TypeScript** via the `typescript` Meteor package
- **`WebApp.connectHandlers`** from Meteor's built-in `webapp` package for custom HTTP routes
- A minimal client (`client/main.html`) with all rendering happening server-side at `/`

## Quick Start

```bash
# Install Meteor (if not already installed)
curl https://install.meteor.com/ | sh

# Clone and configure
cp .env.example .env
# Edit .env with your values

# Install npm dependencies
meteor npm install

# Run in development mode
meteor run
```

Open http://localhost:3000

## Project Structure

```
.
├── .meteor/
│   ├── packages      # Meteor package list
│   ├── platforms     # Target platforms (browser, server)
│   ├── release       # Pinned Meteor release (METEOR@3.1)
│   └── versions      # Locked transitive package versions
├── server/
│   └── main.ts       # Server entry: WebApp.connectHandlers routes
├── client/
│   ├── main.html     # Minimal Meteor client shell
│   └── main.css      # Minimal client styles
├── .env.example
├── Dockerfile
└── package.json
```

## Endpoints

| Method | Path       | Description                            |
|--------|------------|----------------------------------------|
| GET    | `/`        | HTML dashboard showing public env vars |
| GET    | `/api/env` | JSON list of public env vars           |
| GET    | `/health`  | Health check (`{"status":"ok"}`)       |

## Environment Variables

| Variable         | Required | Description                                   |
|------------------|----------|-----------------------------------------------|
| `APP_NAME`       | No       | Display name shown on the dashboard           |
| `API_URL`        | No       | Base URL for the Server Compass API           |
| `ENVIRONMENT`    | No       | Runtime environment (e.g. `production`)       |
| `VERSION`        | No       | Application version string                    |
| `ROOT_URL`       | Yes      | Full URL the app is served from (Meteor requirement) |
| `PORT`           | No       | Port to listen on (default: `3000`)           |
| `DATABASE_URL`   | No       | MongoDB connection string (private, server-only) |
| `API_SECRET_KEY` | No       | Secret key for API auth (private, server-only)|

`DATABASE_URL` and `API_SECRET_KEY` are loaded from the environment but are **never** exposed to the browser or the `/api/env` endpoint.

## Docker

Build and run with Docker (multi-stage build: Meteor builder on Debian + lean Alpine runtime):

```bash
# Build
docker build -t servercompass-meteor-demo .

# Run
docker run -p 3000:3000 \
  -e ROOT_URL=http://localhost:3000 \
  --env-file .env \
  servercompass-meteor-demo
```

Open http://localhost:3000

### How the Docker Build Works

1. **Stage 1 (builder)** — `node:22-bookworm`: Installs Meteor via the official installer, runs `meteor npm install`, then `meteor build --server-only` to produce a standalone Node.js bundle in `/app/bundle`.
2. **Stage 2 (runtime)** — `node:22-alpine`: Copies only the compiled bundle. No Meteor toolchain, no source files — just the runnable Node.js app (~100 MB).

## Deploy to Your VPS

Deploy this Meteor application to any VPS in minutes with [Server Compass](https://servercompass.app/) — the modern way to install Meteor and self host Meteor applications without a Galaxy subscription.

1. Push this repo to GitHub
2. Connect your VPS in Server Compass
3. Point Server Compass at the repo — it detects the Dockerfile automatically
4. Set your environment variables in the Server Compass dashboard (including `ROOT_URL`)
5. Deploy

Server Compass handles TLS, reverse proxying, zero-downtime restarts, and log streaming so you can focus on your application.

---

Keywords: self host Meteor, deploy Meteor to VPS, install Meteor, Meteor docker deployment, Meteor Galaxy alternative, self-hosted Meteor MongoDB app
