# syntax=docker/dockerfile:1
# Bioxcin Kenya website: Next.js 16, built as a self-contained (standalone) server. No database.

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1

# ---- dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- build ----
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public values are baked into the browser bundle at build time.
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_SITE_ENV=staging
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    NEXT_PUBLIC_SITE_ENV=$NEXT_PUBLIC_SITE_ENV
RUN npm run build

# ---- runtime ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN useradd --system --uid 1001 --home /app nextjs
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs /app/.next/static ./.next/static
# Image processing (sharp) needs its native libvips libraries, which the bundler can miss.
COPY --from=build /app/node_modules/@img ./node_modules/@img
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
