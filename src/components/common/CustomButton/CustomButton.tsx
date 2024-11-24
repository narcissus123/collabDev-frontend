import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

interface CustomButtonProps {
  leftHandleClick?: () => void;
  rightHandleClick?: () => void;
  leftButtonDisabled?: boolean;
  righButtonDisabled?: boolean;
  framesx?: any;
  buttonRightsx?: any;
  leftButtonsx?: any;
  leftButtonText?: string;
  righButtonText?: string;
  variantLeft?: "contained" | "text" | "outlined" | undefined;
  variantRight?: "contained" | "text" | "outlined" | undefined;
}

const CustomButton = ({
  leftHandleClick,
  rightHandleClick,
  leftButtonDisabled = false,
  righButtonDisabled = false,
  framesx = {},
  buttonRightsx = {},
  leftButtonsx = {},
  leftButtonText,
  righButtonText,
  variantLeft,
  variantRight,
}: CustomButtonProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        ...framesx,
      }}
    >
      {leftButtonText && (
        <Button
          color="inherit"
          onClick={leftHandleClick}
          disabled={leftButtonDisabled}
          type="submit"
          variant={variantLeft}
          sx={{
            my: 1,
            mx: 1,
            py: { md: 1 },
            px: { md: 2 },
            fontSize: { md: "1rem" },
            color: "text.secondary",
            ...leftButtonsx,
          }}
        >
          {leftButtonText}
        </Button>
      )}
      <Box sx={{ flex: "1 1 auto" }} />
      {righButtonText && (
        <Button
          size={isLargeScreen ? "small" : "large"}
          onClick={rightHandleClick}
          type="submit"
          variant={variantRight}
          disabled={righButtonDisabled}
          sx={{
            my: 1,
            mx: 1,
            py: { md: 1 },
            px: { md: 2 },
            fontSize: { md: "1rem" },
            ...buttonRightsx,
          }}
        >
          {righButtonText}
        </Button>
      )}
    </Box>
  );
};

export default CustomButton;
