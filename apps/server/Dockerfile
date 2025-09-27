FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile --production

FROM base AS build
COPY package.json bun.lockb* ./

RUN bun build main.ts --compile --outfile server

FROM base AS production

ENV NODE_ENV=production
ENV PORT=3002

COPY --from=builder /app/server ./server

EXPOSE 3002

CMD ["./server"]
