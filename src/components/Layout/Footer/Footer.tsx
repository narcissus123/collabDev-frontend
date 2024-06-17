import Paper from "@mui/material/Box";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"Copyright © "}
      <Link color="inherit" href="#">
        CollabDev
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function StickyFooter() {
  return (
    <Paper
      component="footer"
      py={2}
      textAlign="center"
      bgcolor="#1D1D1E"
      color="primary.contrastText"
    >
      <Box
        sx={{
          flexGrow: 1,
          justifyContent: "center",
          display: "flex",
          mb: 2,
        }}
      >
        <Copyright />
      </Box>
    </Paper>
  );
}
