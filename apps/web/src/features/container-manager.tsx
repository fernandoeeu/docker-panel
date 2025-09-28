import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getContainers } from "@/api/containers";
import { useQuery } from "@tanstack/react-query";
import { atom, useSetAtom } from "jotai";
import { useQueryState } from "nuqs";
import { useEffect, useCallback, useMemo } from "react";
import { ContainerCard } from "./container-manager/components/container-card";
import { ContainerDetail } from "./container-manager/components/container-detail";
import { ContainersHeader } from "./container-manager/components/containers-header";

export type FilterState = {
  containerId: string;
  env: "local" | "vps";
  status: "all" | "running" | "stopped" | "exited";
};

export const filtersAtom = atom<FilterState>({
  containerId: "",
  env: "local",
  status: "all",
});

export function ContainerManager() {
  const [containerId, setContainerId] = useQueryState("containerId", {
    defaultValue: "",
    shallow: false,
  });
  const [env, setEnv] = useQueryState("env", {
    defaultValue: "local",
    shallow: false,
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
    shallow: false,
  });

  const setFilters = useSetAtom(filtersAtom);

  useEffect(() => {
    const parsedEnv = env as "local" | "vps";
    const parsedStatus = status as "all" | "running" | "stopped" | "exited";
    setFilters({ containerId, env: parsedEnv, status: parsedStatus });
  }, [containerId, env, status, setFilters]);

  const parsedEnv = useMemo(() => env as "local" | "vps", [env]);

  const clearFilters = useCallback(() => {
    setContainerId("");
    setEnv("local");
    setStatus("all");
  }, [setContainerId, setEnv, setStatus]);

  const { data: containersData, isLoading } = useQuery({
    queryKey: ["containers", parsedEnv],
    queryFn: () => getContainers({ env: parsedEnv }),
    staleTime: 5000, // 5 seconds
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  console.log({ isLoading });

  if (isLoading || !containersData) {
    return <div>Loading...</div>;
  }

  const filteredContainers = containersData.filter((container) => {
    if (status === "all") return true;
    return container.state === status;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
        <ContainersHeader length={containersData.length} />
        <Select value={env} onValueChange={setEnv}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="vps">VPS</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
            <SelectItem value="exited">Exited</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <ContainerCard
          containers={filteredContainers}
          onSelect={setContainerId}
          clearFilters={clearFilters}
        />
        <ContainerDetail />
      </div>
    </div>
  );
}
