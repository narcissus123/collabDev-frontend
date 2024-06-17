import { CircularProgress, Typography, Box } from "@mui/material";

export function Loading() {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress sx={{ marginRight: "5px" }} />
      <Typography variant="body1">Loading...</Typography>
    </Box>
  );
}
