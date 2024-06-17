import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import App from "./app/App";
import ErrorFallback from "./components/common/ErrorFallback/ErrorFallback";
import "./index.scss";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { MUIThemeProvider } from "./context/MUIThemeContext/MUIThemeContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* <Suspense fallback={<Loading />}> */}
        <BrowserRouter>
          {/* <Auth0ProviderWithNavigate> */}
          <MUIThemeProvider>
            <App />
          </MUIThemeProvider>
          {/* </Auth0ProviderWithNavigate> */}
        </BrowserRouter>
        {/* </Suspense> */}
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);
