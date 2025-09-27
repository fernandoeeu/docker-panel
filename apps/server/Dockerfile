FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

FROM base AS production
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/ || exit 1

CMD ["bun", "run", "src/index.ts"]
