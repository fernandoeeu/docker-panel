import { AppLayout } from "./components/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import { ContainerManager } from "./features/container-manager";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppLayout>
          <ContainerManager />
          <ReactQueryDevtools />
        </AppLayout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
