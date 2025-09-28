import type { Container } from "@/api/containers";
import { ContainerItem } from "./containers-item";

type Props = {
  containers: Container[];
  onSelect: (id: string) => void;
};

export function ContainerCard({ containers, onSelect }: Props) {
  return (
    <div className="space-y-4 w-full">
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
