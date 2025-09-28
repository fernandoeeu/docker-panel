import { useQuery } from "@tanstack/react-query";
import { getContainers, readLogs } from "@/api/containers";
import { ContainerCard } from "./container-manager/components/container-card";
import { ContainersHeader } from "./container-manager/components/containers-header";

export function ContainerManager() {
  const { data: containersData, isLoading } = useQuery({
    queryKey: ["containers"],
    queryFn: () => getContainers(),
    staleTime: 10,
    // 5 seconds
    refetchInterval: 5000,
  });

  const { data: logsData, isLoading: isLogsLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: () => readLogs(),
    // staleTime: 10,
    // 5 seconds
    // refetchInterval: 5000,
  });

  console.log({ logsData, isLogsLoading });

  if (isLoading || !containersData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ContainersHeader />
      <ContainerCard containers={containersData} />
    </div>
  );
}
