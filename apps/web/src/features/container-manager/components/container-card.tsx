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
};

export function ContainerCard({ containers }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Container List</CardTitle>
        <CardDescription>{containers.length} containers found</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {containers.map((container) => (
            <ContainerItem key={container.id} container={container} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
