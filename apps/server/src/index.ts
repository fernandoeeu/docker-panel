import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import {
  listContainers,
  pauseContainer,
  restartContainer,
  resumeContainer,
  getContainerLogs,
  getContainer,
} from "./lib/containers";
import { readFile } from "./lib/read-file";
import z from "zod";

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

app.get("/containers/:id", async (c) => {
  const { id } = c.req.param();
  const container = await getContainer(id);
  return c.json({ container });
});

const logEntrySchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.string(),
});

app.get("/containers/:id/logs", async (c) => {
  const { id } = c.req.param();
  try {
    const logEntry = await readFile(id);

    // console.log({ logEntry });

    return c.json({ log: logEntrySchema.parse(logEntry) });
  } catch (error) {
    console.error(`Error fetching logs for container ${id}:`, error);
    return c.json(
      {
        error: `Failed to fetch logs for container ${id}`,
        message: error instanceof Error ? error.message : String(error),
      },
      404
    );
  }
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
