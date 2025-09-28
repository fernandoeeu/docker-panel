type Props = {
  length: number;
};

export function ContainersHeader({ length }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Containers
      </h1>
      <p className="text-muted-foreground">{length} containers found</p>
    </div>
  );
}
