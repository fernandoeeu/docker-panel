import z from "zod";
import { api } from ".";

const containerSchema = z.object({
  id: z.string(),
  names: z.array(z.string()),
  image: z.string(),
  state: z.string(),
  status: z.string(),
  createdAt: z.number(),
});

export type Container = z.infer<typeof containerSchema>;

const baseUrl = "http://72.60.154.192:3002";
// const baseUrl = "http://localhost:3002";

export async function getContainers() {
  console.log("getContainers");
  const response = await fetch(`${baseUrl}/containers`);
  const data = await response.json();
  console.log({ data });
  return containerSchema.array().parse(data.containers);
}

export async function restartContainer(id: string) {
  const response = await fetch(
    `http://localhost:3002/containers/${id}/restart`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data;
}

export async function resumeContainer(id: string) {
  const response = await fetch(
    `http://localhost:3002/containers/${id}/resume`,
    {
      method: "POST",
    }
  );
  const data = await response.json();
  return data;
}

export async function pauseContainer(id: string) {
  const response = await fetch(`http://localhost:3002/containers/${id}/pause`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
}
