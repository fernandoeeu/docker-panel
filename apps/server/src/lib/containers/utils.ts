function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return `${value} ${units[i]}`;
}

function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function memoryUsageString(usage: number, limit: number): string {
  const percent = usage / limit;
  return `${formatBytes(usage)} / ${formatBytes(limit)} (${formatPercent(
    percent
  )})`;
}

export function calculateCPUPercent(cpuStats: any, precpuStats: any): string {
  const cpuDelta =
    cpuStats.cpu_usage.total_usage - precpuStats.cpu_usage.total_usage;
  const systemDelta = cpuStats.system_cpu_usage - precpuStats.system_cpu_usage;
  const onlineCPUs = cpuStats.online_cpus || 1;

  let cpuPercent = 0;
  if (systemDelta > 0 && cpuDelta > 0) {
    cpuPercent = (cpuDelta / systemDelta) * onlineCPUs * 100.0;
  }

  return `${cpuPercent.toFixed(2)}%`;
}
