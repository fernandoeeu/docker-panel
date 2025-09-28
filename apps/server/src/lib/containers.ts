import z from "zod";

import Docker = require("dockerode");

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

function normalizeDockerName(name: string) {
  return name.startsWith("/") ? name.slice(1) : name;
}

const containerSchema = z.object({
  id: z.string(),
  names: z.array(z.string()),
  image: z.string(),
  state: z.string(),
  status: z.string(),
  createdAt: z.number(),
});

export async function listContainers() {
  const containers = await docker.listContainers({ all: true });
  const parsedContainers = containers.map((container) => {
    return {
      id: container.Id,
      names: container.Names.map(normalizeDockerName),
      image: container.Image,
      state: container.State,
      status: container.Status,
      createdAt: container.Created,
    };
  });

  return containerSchema.array().parse(parsedContainers);
}

export async function restartContainer(id: string) {
  console.log("restartContainer", id);
  const container = docker.getContainer(id);
  await container.restart();
}

export async function pauseContainer(id: string) {
  console.log("pauseContainer", id);
  const container = docker.getContainer(id);
  await container.pause();
}

export async function resumeContainer(id: string) {
  console.log("unpauseContainer", id);
  const container = docker.getContainer(id);
  await container.unpause();
}

export async function getContainerLogs(id: string) {
  try {
    const container = docker.getContainer(id);
    const stream = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100,
      timestamps: true,
    });
    return stream.toString();
  } catch (error) {
    throw new Error(`Failed to get logs for container ${id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
