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

const baseUse = vpsUrl;

type baseProps = {
  env: "local" | "vps";
};

function getBaseUrl(env: "local" | "vps") {
  return env === "local" ? localUrl : vpsUrl;
}

export async function getContainers(props: baseProps) {
  const response = await fetch(`${getBaseUrl(props.env)}/containers`);
  const data = await response.json();
  return containerSchema.array().parse(data.containers);
}

export async function restartContainer({
  id,
  env,
}: baseProps & { id: string }) {
  const response = await fetch(`${getBaseUrl(env)}/containers/${id}/restart`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

export async function resumeContainer({ id, env }: baseProps & { id: string }) {
  const response = await fetch(`${getBaseUrl(env)}/containers/${id}/resume`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

export async function pauseContainer({ id, env }: baseProps & { id: string }) {
  const response = await fetch(`${getBaseUrl(env)}/containers/${id}/pause`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}

export async function getContainer({ id, env }: baseProps & { id: string }) {
  const response = await fetch(`${getBaseUrl(env)}/containers/${id}`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

export async function readLogs({ id, env }: baseProps & { id: string }) {
  const response = await fetch(`${getBaseUrl(env)}/containers/${id}/logs`, {
    method: "GET",
  });
  const data = await response.json();
  // console.log({ data });
  return logEntrySchema.parse(data.log);
}
