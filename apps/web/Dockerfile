FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

FROM base AS build
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY src ./src
COPY build.ts ./
RUN bun run build

FROM base AS production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY src/index.tsx ./src/
COPY src/index.html ./src/

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3333/ || exit 1

CMD ["bun", "run", "start"]