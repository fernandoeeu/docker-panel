import { Badge } from "@/components/ui/badge";

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  console.log({ status, label });
  function getStyles() {
    return (
      {
        running: "bg-green-600 hover:bg-green-700",
        stopped: "bg-yellow-600 hover:bg-yellow-700",
        exited: "bg-red-600 hover:bg-red-700",
      }[status] ?? "bg-gray-600 hover:bg-gray-700"
    );
  }
  return (
    <Badge variant="secondary" className={getStyles()}>
      {label}
    </Badge>
  );
}
