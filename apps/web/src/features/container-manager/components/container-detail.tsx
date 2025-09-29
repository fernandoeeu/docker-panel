import { filtersAtom } from "@/features/container-manager";
import { useQuery } from "@tanstack/react-query";
import { getContainer, readLogs } from "@/api/containers";
import { atom, useAtomValue } from "jotai";
import { CopyToClipboardButton } from "@/components/ui/copy-to-clipboard-button";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const parsedEnvAtom = atom((get) => get(filtersAtom).env as "local" | "vps");

export function ContainerDetail() {
  return (
    <div className="flex flex-col gap-4">
      <ContainerStats />
      <ContainerLogs />
    </div>
  );
}

const now = new Date();

function ContainerStats() {
  const { containerId } = useAtomValue(filtersAtom);
  const env = useAtomValue(parsedEnvAtom);
  const [counter, setCounter] = useState(0);

  const { data: containerData } = useQuery({
    queryKey: ["container-detail", containerId],
    queryFn: () => getContainer({ id: containerId, env }),
    refetchInterval: 5000,
  });
  console.log({ startedAt: containerData?.startedAt });

  function getTimeRunningInSeconds() {
    const startedAt = new Date(containerData?.startedAt);

    return Math.floor((now.getTime() - startedAt.getTime()) / 1000);
  }

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 group">
            <h3
              className="text-lg font-semibold text-foreground"
              title={containerData?.name}
              aria-label={containerData?.name}
            >
              {containerData?.name} ({getTimeRunningInSeconds()}s) {counter}
            </h3>
            <CopyToClipboardButton text={containerData?.name} />
          </div>
          <div className="flex items-center gap-2 group">
            <p className="text-sm text-muted-foreground">{containerId}</p>
            <CopyToClipboardButton text={containerId} />
          </div>
        </div>

        <Button onClick={() => setCounter(counter + 1)}>Increment</Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                Uso de CPU:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.cpu.usageInNanoseconds}
              </span>
            </ContainerStatusItem>

            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                Uso de Memória:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.memory.usageInBytes}
              </span>
            </ContainerStatusItem>

            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                Limite de Memória:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.memory.limitInBytes}
              </span>
            </ContainerStatusItem>

            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                Volumes:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.volumes.attachedCount}
              </span>
            </ContainerStatusItem>
          </div>

          <div className="flex flex-col gap-3">
            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                Endereço IP:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.network.ip}
              </span>
            </ContainerStatusItem>

            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                Gateway:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.network.gateway}
              </span>
            </ContainerStatusItem>

            <ContainerStatusItem>
              <span className="text-sm font-medium text-foreground">
                MAC Address:
              </span>
              <span className="text-sm text-muted-foreground font-mono">
                {containerData?.network.macAddress}
              </span>
            </ContainerStatusItem>
          </div>
        </div>
      </div>
    </div>
  );
}

type ContainerStatusItemProps = {
  children: React.ReactNode;
};

function ContainerStatusItem({ children }: ContainerStatusItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
      {children}
    </div>
  );
}

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

  const { data: containerData, error } = useQuery({
    queryKey: ["container", containerId],
    queryFn: () => getContainer({ id: containerId, env }),
    staleTime: 5 * 1000,
    refetchOnMount: false,
    retry: false,
  });

  console.log({ containerData, error });

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
