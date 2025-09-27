import { AppSidebar } from "./app-sidebar";
import { ModeToggle } from "./mode-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
