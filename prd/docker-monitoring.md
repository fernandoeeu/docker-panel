Código a ser implementado:

```
import { serve } from "bun";
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const DEFAULT_CONTAINER_NAME = Bun.env.CONTAINER_NAME;

function normalizeDockerName(name: string) {
  return name.startsWith("/") ? name.slice(1) : name;
}

async function getContainer(name: string) {
  const containers = await docker.listContainers({ all: true });
  const info = containers.find((c) =>
    c.Names.some((existing) => {
      const normalized = normalizeDockerName(existing);
      return (
        normalized === name || normalized.includes(name) || existing.includes(name)
      );
    }),
  );
  if (!info) return null;
  return docker.getContainer(info.Id);
}

async function listContainers() {
  const containers = await docker.listContainers({ all: true });
  return containers.map((container) => ({
    id: container.Id,
    names: container.Names.map(normalizeDockerName),
    image: container.Image,
    state: container.State,
    status: container.Status,
    createdAt: container.Created,
  }));
}

function resolveTargetName(url: URL) {
  return url.searchParams.get("name") ?? DEFAULT_CONTAINER_NAME ?? undefined;
}

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/status" && req.method === "GET") {
      try {
        const name = url.searchParams.get("name");
        if (!name) {
          const containers = await listContainers();
          return Response.json({ containers });
        }
        const container = await getContainer(name);
        if (!container) {
          return new Response(
            JSON.stringify({ status: "not found", name }),
            { status: 404 },
          );
        }
        const inspect = await container.inspect();
        return Response.json({
          id: inspect.Id,
          name: normalizeDockerName(inspect.Name),
          state: inspect.State,
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500,
        });
      }
    }

    if (url.pathname === "/start" && req.method === "POST") {
      const targetName = resolveTargetName(url);
      if (!targetName) {
        return new Response("Missing container name", { status: 400 });
      }
      const container = await getContainer(targetName);
      if (!container) return new Response("Not found", { status: 404 });
      await container.start();
      return Response.json({ ok: true, name: targetName });
    }

    if (url.pathname === "/stop" && req.method === "POST") {
      const targetName = resolveTargetName(url);
      if (!targetName) {
        return new Response("Missing container name", { status: 400 });
      }
      const container = await getContainer(targetName);
      if (!container) return new Response("Not found", { status: 404 });
      await container.stop();
      return Response.json({ ok: true, name: targetName });
    }

    if (url.pathname === "/restart" && req.method === "POST") {
      const targetName = resolveTargetName(url);
      if (!targetName) {
        return new Response("Missing container name", { status: 400 });
      }
      const container = await getContainer(targetName);
      if (!container) return new Response("Not found", { status: 404 });
      await container.restart();
      return Response.json({ ok: true, name: targetName });
    }

    return new Response("Not found", { status: 404 });
  },
});
```
