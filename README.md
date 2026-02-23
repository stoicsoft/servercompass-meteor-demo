# Meteor Demo - Server Compass

> A production-ready Meteor application template for self-hosting with [Server Compass](https://servercompass.app/)

Deploy this Meteor application to any VPS in minutes. Server Compass is the modern way to self host Meteor applications - no Galaxy subscription required.

## Quick Start

```bash
cp .env.example .env
npm install
npm start
```

Open http://localhost:3000

## Endpoints

| Method | Path       | Description                       |
|--------|------------|-----------------------------------|
| GET    | `/`        | HTML page showing public env vars |
| GET    | `/api/env` | JSON list of public env vars      |
| GET    | `/health`  | Health check (`{"status":"ok"}`)  |

## Environment Variables

| Variable         | Required | Description                              |
|------------------|----------|------------------------------------------|
| `APP_NAME`       | No       | Display name shown on the home page      |
| `API_URL`        | No       | Base URL for the Server Compass API      |
| `ENVIRONMENT`    | No       | Runtime environment (e.g. production)    |
| `VERSION`        | No       | Application version string               |
| `PORT`           | No       | Port to listen on (default: 3000)        |
| `DATABASE_URL`   | No       | MongoDB connection string (private)      |
| `API_SECRET_KEY` | No       | Secret key for API auth (private)        |

`DATABASE_URL` and `API_SECRET_KEY` are loaded from the environment but are never exposed to the browser or the `/api/env` endpoint.

## Docker

Build and run with Docker:

```bash
# Build
docker build -t servercompass-meteor-demo .

# Run
docker run -p 3000:3000 --env-file .env servercompass-meteor-demo
```

Open http://localhost:3000

The image uses a two-stage build: dependencies are installed in a `deps` stage and only the final artifacts are copied into the lean runtime image, keeping the image small and builds fast.

## Deploy to Your VPS

Deploy this Meteor application to any VPS in minutes with [Server Compass](https://servercompass.app/) - the modern way to install Meteor and self host Meteor applications without a Galaxy subscription.

1. Push this repo to GitHub
2. Connect your VPS in Server Compass
3. Point Server Compass at the repo - it detects the Dockerfile automatically
4. Set your environment variables in the Server Compass dashboard
5. Deploy

Server Compass handles TLS, reverse proxying, zero-downtime restarts, and log streaming so you can focus on your application.

---

Keywords: self host Meteor, deploy Meteor to VPS, install Meteor, Meteor docker deployment, Meteor Galaxy alternative, self-hosted Meteor MongoDB app
