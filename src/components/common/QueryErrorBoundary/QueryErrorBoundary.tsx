import { Stack, Button, Typography } from "@mui/material";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

interface props {
  children: React.ReactNode;
  sx?: any;
  message?: string;
}

export const QueryErrorBoundary = ({
  children,
  sx,
  message = "There was an error!",
}: props) => {
  console.log("hiiiiiiiiiii");
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => {
            console.log("error", error);
            return (
              <Stack
                sx={{
                  mt: "7rem",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%",
                  mx: "auto",
                  ...sx,
                }}
              >
                <Typography
                  sx={{
                    m: 0,
                    color: "red",
                    width: "100%",
                    fontSize: "1rem",
                  }}
                >
                  {message}
                </Typography>
                <Button
                  onClick={() => resetErrorBoundary()}
                  variant="contained"
                  color="error"
                  sx={{
                    color: "white",
                    whiteSpace: "nowrap",
                  }}
                >
                  Try again
                </Button>
              </Stack>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
