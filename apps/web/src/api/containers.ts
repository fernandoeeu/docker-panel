import z from "zod";

const logEntrySchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.string(),
});

export type LogEntry = z.infer<typeof logEntrySchema>;

const containerSchema = z.object({
  id: z.string(),
  names: z.array(z.string()),
  image: z.string(),
  state: z.string(),
  status: z.string(),
  createdAt: z.number(),
});

export type Container = z.infer<typeof containerSchema>;

const vpsUrl = "http://72.60.154.192:3002";
const localUrl = "http://localhost:3002";

const baseUse = localUrl;

export async function getContainers() {
  const response = await fetch(`${baseUse}/containers`);
  const data = await response.json();
  return containerSchema.array().parse(data.containers);
}

export async function restartContainer(id: string) {
  const response = await fetch(`${baseUse}/containers/${id}/restart`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

export async function resumeContainer(id: string) {
  const response = await fetch(`${baseUse}/containers/${id}/resume`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

export async function pauseContainer(id: string) {
  const response = await fetch(`${baseUse}/containers/${id}/pause`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

export async function readLogs(id: string) {
  const response = await fetch(`${baseUse}/containers/${id}/logs`, {
    method: "GET",
  });
  const data = await response.json();
  // console.log({ data });
  return logEntrySchema.parse(data.log);
}
