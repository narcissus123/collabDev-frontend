import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface InfoItemProps {
  label: string;
  children: ReactNode;
  isLargeScreen: boolean;
}

export default function LabeledTypography({
  label,
  children,
  isLargeScreen,
}: InfoItemProps) {
  return (
    <div>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          fontFamily:
            '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
          fontWeight: "550",
          fontStretch: "normal",

          fontSize: isLargeScreen ? "0.9rem" : "1.3rem",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Typography
        color="text.secondary"
        gutterBottom
        sx={{
          fontFamily:
            '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
          fontWeight: "normal",
          fontStretch: "normal",
          fontSize: "1rem",
        }}
      >
        {children}
      </Typography>
    </div>
  );
}
