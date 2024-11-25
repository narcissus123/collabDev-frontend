import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { MUIThemeProvider } from "./context/MUIThemeContext/MUIThemeContext";
import { QueryErrorBoundary } from "./components/common/QueryErrorBoundary/QueryErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // staleTime: 0,
      refetchOnWindowFocus: false,
      throwOnError: true,
    },
    mutations: {
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const LazyApp = lazy(() =>
  import("./app/App").then((module) => ({ default: module.default }))
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <QueryErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <MUIThemeProvider>
              <LazyApp />
            </MUIThemeProvider>
          </BrowserRouter>
        </AuthProvider>
      </QueryErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);
