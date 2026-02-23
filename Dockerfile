# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Stage 1 — Install Meteor and build the application bundle
# Uses Debian Bookworm (required for Meteor installer which needs bash + curl)
# ---------------------------------------------------------------------------
FROM node:22-bookworm AS builder

# Install Meteor via the official installer
RUN curl -fsSL https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:$PATH"
ENV METEOR_ALLOW_SUPERUSER=1

WORKDIR /app

# Copy dependency manifests first so Meteor can cache the npm install layer
COPY package.json .
RUN meteor npm install --production=false

# Copy the full source (excluding items in .dockerignore)
COPY . .

# Build a standalone server bundle
RUN meteor build --directory /app/bundle --server-only --architecture os.linux.x86_64

# Install production npm deps for the built bundle
RUN cd /app/bundle/bundle/programs/server && npm install --production

# ---------------------------------------------------------------------------
# Stage 2 — Lean runtime image (Alpine)
# ---------------------------------------------------------------------------
FROM node:22-alpine

WORKDIR /app

# Copy only the built bundle from the builder stage
COPY --from=builder /app/bundle/bundle .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

ENV ROOT_URL=http://localhost:3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "main.js"]
