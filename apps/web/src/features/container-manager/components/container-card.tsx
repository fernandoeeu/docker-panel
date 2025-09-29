import type { Container } from "@/api/containers";
import { Button } from "@/components/ui/button";
import { ContainerItem } from "./containers-item";

type Props = {
  containers: Container[];
  onSelect: (id: string) => void;
  clearFilters: () => void;
};

export function ContainerCard({ containers, onSelect, clearFilters }: Props) {
  if (containers.length === 0) {
    return (
      <div className="text-sm text-gray-500 min-w-200 flex justify-center items-center flex-col gap-4 h-100">
        <span className="text-center">
          No containers found. Select a container to view logs.
        </span>
        <Button variant="outline" size="sm" onClick={() => clearFilters()}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-h-[85vh] overflow-y-auto">
      {containers.map((container) => (
        <ContainerItem
          key={container.id}
          container={container}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
