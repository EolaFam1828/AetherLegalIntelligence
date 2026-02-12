# =============================================================================
# Aether Legal — Multi-stage Docker Build
# =============================================================================

# =====================================
# STAGE 1: Build React Frontend
# =====================================
FROM node:20-slim AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =====================================
# STAGE 2: Build TypeScript Server
# =====================================
FROM node:20-slim AS server-builder

WORKDIR /app

COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci

COPY server/ ./
RUN npm run build

# =====================================
# STAGE 3: Setup Prisma + Production Deps
# =====================================
FROM node:20-slim AS deps-builder

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Root deps + prisma generate
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate && npm prune --omit=dev

# Server deps + prisma generate
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci && npx prisma generate --schema=../prisma/schema.prisma && \
    rm -rf /app/server/node_modules/.prisma && \
    cp -r /app/node_modules/.prisma /app/server/node_modules/.prisma && \
    npm prune --omit=dev

# =====================================
# STAGE 4: Production Runtime
# =====================================
FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

RUN mkdir -p /app/data /tmp/aether-uploads && chown -R nodejs:nodejs /app/data /tmp/aether-uploads

# Copy production node_modules
COPY --from=deps-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps-builder --chown=nodejs:nodejs /app/server/node_modules ./server/node_modules

# Copy Prisma schema and generated client
COPY --from=deps-builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy compiled server
COPY --from=server-builder --chown=nodejs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nodejs:nodejs /app/server/package.json ./server/

# Copy built frontend
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./dist

# Copy package.json
COPY --chown=nodejs:nodejs package.json ./

ENV NODE_ENV=production \
    PORT=3000

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node server/dist/src/index.js"]
