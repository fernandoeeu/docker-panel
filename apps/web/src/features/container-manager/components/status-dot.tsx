export function StatusDot({ status }: { status: string }) {
  const getColor = (status: string) => {
    return (
      {
        running: "bg-emerald-500",
        stopped: "bg-yellow-500",
        exited: "bg-amber-500",
        default: "bg-gray-500",
      }[status] ?? "bg-gray-500"
    );
  };
  return <div className={`size-2 rounded-full ${getColor(status)}`} />;
}
