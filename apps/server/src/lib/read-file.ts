type Cache = {
  data: string | null;
  timestamp: number;
};

let cache: Cache = {
  data: null,
  timestamp: 0,
};

export async function readFile(path: string) {
  if (cache.data && cache.timestamp > Date.now() - 1000) {
    return cache.data;
  }
  const data = await Bun.file(path).text();
  const newCache = {
    timestamp: Date.now(),
    data,
  };
  cache = newCache;
  return data;
}
