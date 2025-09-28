import { getContainerLogs } from "./containers";

type CacheEntry = {
  key: string;
  data: string | null;
  timestamp: number;
};

const cache: CacheEntry[] = [];

export async function readFile(id: string) {
  console.log("readFile", { id });
  const cacheEntry = cache.find((entry) => entry.key === id);

  if (cacheEntry && cacheEntry.timestamp > Date.now() - 1000) {
    console.log("cache hit", { id, cacheEntry });
    return cacheEntry.data;
  }
  const data = await getContainerLogs(id);
  const existingIndex = cache.findIndex((entry) => entry.key === id);
  const newEntry: CacheEntry = {
    key: id,
    timestamp: Date.now(),
    data: sanitizeLogText(data),
  };

  if (existingIndex >= 0) {
    cache[existingIndex] = newEntry;
  } else {
    cache.push(newEntry);
  }

  return newEntry.data;
}

function sanitizeLogText(raw: string) {
  // remove caracteres de controle que não são imprimíveis
  return raw.replace(/[^\x20-\x7E\n]/g, "");
}
