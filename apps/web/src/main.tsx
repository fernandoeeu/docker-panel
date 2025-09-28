import { AppLayout } from "./components/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import { ContainerManager } from "./features/container-manager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./index.css";

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppLayout>
          <NuqsAdapter>
            <ContainerManager />
          </NuqsAdapter>
          <ReactQueryDevtools />
        </AppLayout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
