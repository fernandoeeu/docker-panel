import { getContainer, readLogs, type LogEntry } from "@/api/containers";
import { filtersAtom } from "@/features/container-manager";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtomValue } from "jotai";

export function ContainerDetail() {
  return (
    <div className="flex flex-col gap-4">
      <ContainerLogs />
    </div>
  );
}

const parsedEnvAtom = atom((get) => get(filtersAtom).env as "local" | "vps");

function ContainerLogs() {
  const { containerId } = useAtomValue(filtersAtom);
  const env = useAtomValue(parsedEnvAtom);

  const { data: logsData, isLoading: isLogsLoading } = useQuery({
    queryKey: ["logs", containerId, env],
    queryFn: () => readLogs({ id: containerId, env }),
    staleTime: 10,
    enabled: !!containerId,
    // 5 seconds
    refetchInterval: 5000,
  });

  const { data: containerData } = useQuery({
    queryKey: ["container", containerId],
    queryFn: () => getContainer({ id: containerId, env }),
    staleTime: 5 * 1000,
    refetchOnMount: false,
  });

  console.log({ containerData });

  if (!logsData || isLogsLoading) {
    return (
      <div className="text-sm text-gray-500 min-w-200 grid place-items-center">
        Select a container
      </div>
    );
  }

  const { id, text, timestamp } = logsData;

  return (
    <div className="flex flex-col gap-4 max-w-200 min-w-200">
      <div className="text-sm text-gray-500">
        Logs for {id} {timestamp}
      </div>

      <div className="flex flex-col column-reverse">
        <pre className="text-sm text-gray-500 whitespace-pre-wrap  max-h-96 whitespace-wrap overflow-y-auto overflow-x-hidden max-w-200">
          {text}
        </pre>
        <div className="anchor" />
      </div>
    </div>
  );
}
