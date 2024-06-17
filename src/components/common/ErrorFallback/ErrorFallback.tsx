import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FallbackProps } from "react-error-boundary";
import "./ErrorFallback.scss";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Alert
        severity="error"
        role="alert"
        icon={<ErrorOutlineIcon fontSize="medium" />}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={resetErrorBoundary}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        <AlertTitle>
          <Typography variant="h5">Oops, something went wrong</Typography>
        </AlertTitle>
        <Typography variant="h6"> {error.message}</Typography>
      </Alert>
    </Box>
  );
}
