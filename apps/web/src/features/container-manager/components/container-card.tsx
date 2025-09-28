import type { Container } from "@/api/containers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContainerItem } from "./containers-item";

type Props = {
  containers: Container[];
  onSelect: (id: string) => void;
};

export function ContainerCard({ containers, onSelect }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Container List</CardTitle>
        <CardDescription>{containers.length} containers found</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {containers.map((container) => (
            <ContainerItem
              key={container.id}
              container={container}
              onSelect={onSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
