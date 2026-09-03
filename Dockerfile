# Stage 1: Build Frontend and Server Bundle
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build Vite client and bundle TypeScript server into dist/server.cjs
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Security: Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
