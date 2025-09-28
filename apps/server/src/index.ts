import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import {
  listContainers,
  pauseContainer,
  restartContainer,
  resumeContainer,
} from "./lib/containers";
import { readFile } from "./lib/read-file";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/containers", async (c) => {
  const containers = await listContainers();
  return c.json({
    containers,
  });
});

app.post("/containers/:id/restart", async (c) => {
  const { id } = c.req.param();
  await restartContainer(id);
  return c.json({
    ok: true,
  });
});

app.post("/containers/:id/pause", async (c) => {
  const { id } = c.req.param();
  await pauseContainer(id);
  return c.json({
    ok: true,
  });
});

app.post("/containers/:id/resume", async (c) => {
  const { id } = c.req.param();
  await resumeContainer(id);
  return c.json({
    ok: true,
  });
});

app.get("/containers/:id", (c) => {
  return c.text("Containers");
});

app.get("/logs", async (c) => {
  console.log({ currentDir: __dirname, processCwd: process.cwd() });
  const logs = await readFile(
    "/var/lib/docker/volumes/minecraftserver-docker-x7ppwh_minecraft_data/_data/logs"
  );
  return c.json({
    logs,
  });
});

app.onError((err, c) => {
  console.error(err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json(
    {
      error: "Internal server error",
    },
    500
  );
});

export default app;
