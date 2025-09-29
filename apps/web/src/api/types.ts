import { z } from "zod";

export const containerDetailSchema = z.object({
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

export type ContainerDetail = z.infer<typeof containerDetailSchema>;
