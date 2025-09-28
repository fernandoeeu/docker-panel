import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { getContainers, readLogs } from "@/api/containers";
import { ContainerCard } from "./container-manager/components/container-card";
import { ContainersHeader } from "./container-manager/components/containers-header";

export function ContainerManager() {
  const [containerId, setContainerId] = useQueryState("");

  const { data: containersData, isLoading } = useQuery({
    queryKey: ["containers"],
    queryFn: () => getContainers(),
    staleTime: 10,
    // 5 seconds
    refetchInterval: 5000,
  });

  const { data: logsData, isLoading: isLogsLoading } = useQuery({
    queryKey: ["logs", containerId],
    queryFn: () => readLogs(containerId),
    staleTime: 10,
    enabled: !!containerId,
    // 5 seconds
    refetchInterval: 5000,
  });

  console.log({ text: logsData?.logs });

  if (isLoading || !containersData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ContainersHeader />
      <div className="flex gap-4">
        <ContainerCard containers={containersData} onSelect={setContainerId} />
        <ContainerLogs
          log={{
            id: containerId,
            text: logsData,
          }}
        />
      </div>
    </div>
  );
}

type ContainerLogsProps = {
  log: {
    id: string;
    text: string;
  };
};

function ContainerLogs({ log }: ContainerLogsProps) {
  if (!log.id) {
    return <div>Select a container</div>;
  }
  console.log({ log: log.text });
  return (
    <div className="flex flex-col gap-4 max-w-200">
      <div className="text-sm text-gray-500">Logs for {log.id}</div>

      <pre className="text-sm text-gray-500 whitespace-pre-wrap h-96 max-h-96 whitespace-wrap overflow-y-auto overflow-x-hidden">
        {log.text}
      </pre>
    </div>
  );
}
