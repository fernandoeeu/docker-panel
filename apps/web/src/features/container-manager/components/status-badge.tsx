import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { StatusDot } from "./status-dot";

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  return (
    <Badge variant="outline">
      <StatusDot status={status} />
      {label}
    </Badge>
  );
}
