import { CopyIcon } from "lucide-react";
import { Button } from "./button";

export function CopyToClipboardButton({ text }: { text: string }) {
  function copyToClipboard() {
    navigator.clipboard.writeText(text);
  }
  return (
    <Button
      variant="ghost"
      className="invisible group-hover:visible"
      onClick={copyToClipboard}
    >
      <CopyIcon className="size-2" />
    </Button>
  );
}
