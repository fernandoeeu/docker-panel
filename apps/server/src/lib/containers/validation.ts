import type {
  ContainerInspectInfo,
  ContainerStats,
  NetworkInfo,
} from "dockerode";
import { z } from "zod";
import { calculateCPUPercent, memoryUsageString } from "./utils";

export const containerUnifiedSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  state: z.string(),
  startedAt: z.string(),

  cpu: z.object({
    usageInNanoseconds: z.number(),
    hostCPUs: z.number(),
    onlineCPUs: z.number(),
  }),

  memory: z.object({
    usageInBytes: z.number(),
    limitInBytes: z.number(),
    hostTotalInBytes: z.number(),
  }),

  network: z.object({
    ip: z.string().optional().nullable(),
    gateway: z.string().optional().nullable(),
    macAddress: z.string().optional().nullable(),
  }),

  volumes: z.object({
    attachedCount: z.number(),
    totalOnHostCount: z.number(),
  }),

  docker: z.object({
    totalContainersCount: z.number(),
    runningContainersCount: z.number(),
    imagesCount: z.number(),
    driver: z.string(),
    kernelVersion: z.string(),
    operatingSystem: z.string(),
    architecture: z.string(),
  }),
});

export type ContainerUnified = z.infer<typeof containerUnifiedSchema>;

export function unifyDockerData(data: {
  container: { inspect: ContainerInspectInfo; stats: ContainerStats };
  info: any;
}) {
  const { inspect, stats } = data.container;
  const info = data.info;

  // Pega a primeira network (se existir)
  const networks = inspect.NetworkSettings?.Networks || {};
  const firstNetwork = Object.values(networks)[0] as NetworkInfo | undefined;

  const unified: ContainerUnified = {
    id: inspect.Id,
    name: inspect.Name.replace(/^\//, ""),
    image: inspect.Config.Image,
    state: inspect.State.Status,
    startedAt: inspect.State.StartedAt,

    cpu: {
      usageInNanoseconds: stats.cpu_stats.cpu_usage.total_usage,
      hostCPUs: info.NCPU,
      onlineCPUs: stats.cpu_stats.online_cpus,
    },

    memory: {
      usageInBytes: stats.memory_stats.usage,
      limitInBytes: stats.memory_stats.limit,
      hostTotalInBytes: info.MemTotal,
    },

    network: {
      ip: inspect.NetworkSettings?.IPAddress || null,
      gateway: firstNetwork?.Gateway || null,
      macAddress: firstNetwork?.MacAddress || null,
    },

    volumes: {
      attachedCount: inspect.Mounts?.length ?? 0,
      totalOnHostCount: info.Containers ?? 0,
    },

    docker: {
      totalContainersCount: info.Containers,
      runningContainersCount: info.ContainersRunning,
      imagesCount: info.Images,
      driver: info.Driver,
      kernelVersion: info.KernelVersion,
      operatingSystem: info.OperatingSystem,
      architecture: info.Architecture,
    },
  };

  return containerUnifiedSchema.parse(unified);
}

export const containerSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  state: z.string(),
  startedAt: z.string(),

  cpu: z.object({
    usageInNanoseconds: z.string(),
    onlineCPUs: z.number(),
  }),

  memory: z.object({
    usageInBytes: z.string(),
    limitInBytes: z.number(),
  }),

  network: z.object({
    ip: z.string().optional().nullable(),
    gateway: z.string().optional().nullable(),
    macAddress: z.string().optional().nullable(),
  }),

  volumes: z.object({
    attachedCount: z.number(),
  }),
});

export type ContainerData = z.infer<typeof containerSchema>;

// -----------------------------
// Função que normaliza os dados

export function unifyContainer(data: { inspect: any; stats: any }) {
  const { inspect, stats } = data;

  const networks = inspect.NetworkSettings?.Networks || {};
  const firstNetwork = Object.values(networks)[0] as NetworkInfo | undefined;

  const unified: ContainerData = {
    id: inspect.Id,
    name: inspect.Name.replace(/^\//, ""),
    image: inspect.Config.Image,
    state: inspect.State.Status,
    startedAt: inspect.State.StartedAt,

    cpu: {
      usageInNanoseconds: calculateCPUPercent(
        stats.cpu_stats,
        stats.precpu_stats
      ),
      onlineCPUs: stats.cpu_stats.online_cpus,
    },

    memory: {
      usageInBytes: memoryUsageString(
        stats.memory_stats.usage,
        stats.memory_stats.limit
      ),
      limitInBytes: stats.memory_stats.limit,
    },

    network: {
      ip: inspect.NetworkSettings?.IPAddress || null,
      gateway: firstNetwork?.Gateway || null,
      macAddress: firstNetwork?.MacAddress || null,
    },

    volumes: {
      attachedCount: inspect.Mounts?.length ?? 0,
    },
  };

  return containerSchema.parse(unified);
}
