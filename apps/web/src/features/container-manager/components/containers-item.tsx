import type { Container } from "@/api/containers";
import { StatusDot } from "./status-dot";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getContainer,
  pauseContainer,
  restartContainer,
  resumeContainer,
} from "@/api/containers";
import { Eye, Pause, Play, RotateCcw } from "lucide-react";
import { useAtomValue } from "jotai";
import { filtersAtom } from "@/features/container-manager";

type Props = {
  container: Container;
  onSelect: (id: string) => void;
};

export function ContainerItem({ container, onSelect }: Props) {
  const { names, image, state, status } = container;

  const { env } = useAtomValue(filtersAtom);

  const queryClient = useQueryClient();

  function invalidateContainers() {
    queryClient.invalidateQueries({ queryKey: ["containers"] });
  }

  function onSuccess() {
    invalidateContainers();
  }

  const { mutate: restartContainerMutation, isPending: isRestartPending } =
    useMutation({
      mutationFn: (containerId: string) =>
        restartContainer({ id: containerId, env }),
      onSuccess,
    });

  const { mutate: pauseContainerMutation, isPending: isPausePending } =
    useMutation({
      mutationFn: (containerId: string) =>
        pauseContainer({ id: containerId, env }),
      onSuccess,
    });

  const { mutate: resumeContainerMutation, isPending: isResumePending } =
    useMutation({
      mutationFn: (containerId: string) =>
        resumeContainer({ id: containerId, env }),
      onSuccess,
    });

  function handleResumeContainer(containerId: string) {
    console.log("handleResumeContainer", containerId);
    resumeContainerMutation(containerId);
  }

  function handleRestartContainer(containerId: string) {
    console.log("handleRestartContainer", containerId);
    restartContainerMutation(containerId);
  }

  function handlePauseContainer(containerId: string) {
    console.log("handlePauseContainer", containerId);
    pauseContainerMutation(containerId);
  }

  const canPause = state === "running";
  const canResume = state === "paused";
  const canRestart = state === "running" || state === "paused";

  return (
    <div
      key={container.id}
      className="flex items-center justify-between p-4 border border-border rounded-lg w-full"
    >
      <div className="flex items-center gap-4">
        <StatusDot status={state} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{names[0]}</span>
            <StatusBadge status={state} label={status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{image}</span>
            <span>{state}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground mr-4">
          <span>CPU: {status}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={isRestartPending || !canRestart}
          onClick={() => handleRestartContainer(container.id)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isResumePending || !canResume}
          onClick={() => handleResumeContainer(container.id)}
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isPausePending || !canPause}
          onClick={() => handlePauseContainer(container.id)}
        >
          <Pause className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelect(container.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
