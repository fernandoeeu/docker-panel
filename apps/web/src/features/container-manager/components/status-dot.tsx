export function StatusDot({ status }: { status: string }) {
  const getColor = (status: string) => {
    return (
      {
        running: "bg-green-500",
        stopped: "bg-yellow-500",
        exited: "bg-red-500",
        default: "bg-gray-500",
      }[status] ?? "bg-gray-500"
    );
  };
  return <div className={`h-3 w-3 rounded-full ${getColor(status)}`} />;
}
