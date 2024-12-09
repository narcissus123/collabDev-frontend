import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Control, Controller } from "react-hook-form";

interface CustomDatePickerProps {
  name: string;
  control: Control<any>;
  label?: string;
}

export default function CustomDatePicker({
  name,
  control,
  label,
}: CustomDatePickerProps) {
  const theme = useTheme();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mr: "1rem",
          width: "100%",
          mt: "1rem",
          color: "text.secondary",
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <DemoItem
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "text.secondary"
                    : theme.palette.text.secondary,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "400",
                  lineHeight: "1.4375em",
                  color:
                    theme.palette.mode === "dark"
                      ? "text.secondary"
                      : "border.secondary",
                  fontSize: "0.9rem",
                }}
              >
                {label ? label : name}
              </Typography>
              <DatePicker
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    color:
                      theme.palette.mode === "dark"
                        ? "#fff"
                        : theme.palette.text.secondary,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.background.default,
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgb(82, 82, 82)"
                        : "rgb(196, 196, 196)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "rgb(100, 100, 100)"
                        : "#000000",
                  },
                  // Calendar container
                  "& .MuiPaper-root": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fff",
                  },
                  // Calendar days
                  "& .MuiDayCalendar-weekDayLabel": {
                    color: "#fff",
                  },
                  "& .MuiPickersDay-root": {
                    color: "#fff",
                    "&:not(.Mui-selected)": {
                      backgroundColor: "transparent",
                    },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                    },
                  },
                  // Year/month selection
                  "& .MuiPickersYear-root, & .MuiPickersMonth-root": {
                    "& button": {
                      color: "#fff !important",
                    },
                  },
                  // Selected date
                  "& .Mui-selected": {
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: `${theme.palette.primary.contrastText} !important`,
                  },
                  // Calendar header
                  "& .MuiPickersCalendarHeader-label": {
                    color: theme.palette.mode === "dark" ? "#fff" : "inherit",
                  },
                  // Navigation arrows
                  "& .MuiPickersArrowSwitcher-button": {
                    color: "#fff",
                  },
                  "& .MuiPickersPopper-paper": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#121212" : "#fff",
                    color: "#fff !important",
                    "& .MuiPickersYear-yearButton": {
                      color: "#fff !important",
                    },
                    "& .MuiYearCalendar-root": {
                      "& button": {
                        color: "#fff !important",
                      },
                    },
                    backgroundImage:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))"
                        : "none",
                  },
                  // The popper paper
                  "& .css-17yyziu-MuiPaper-root-MuiPickersPopper-paper": {
                    backgroundColor: "#121212",
                    color: "#fff",
                    transition:
                      "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    borderRadius: "4px",
                    boxShadow:
                      "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                    backgroundImage:
                      "linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))",
                    outline: 0,
                    transformOrigin: "bottom center",
                  },
                  "& .MuiPaper-root.MuiPickersPopper-paper": {
                    color: "#fff",
                    backgroundColor: "#121212",
                  },
                  // Ensure hover and selected states are visible
                  "& .MuiPickersYear-yearButton:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                  },
                  "& .MuiPickersYear-yearButton.Mui-selected": {
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: `${theme.palette.primary.contrastText} !important`,
                  },
                }}
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? dayjs(date) : null)}
                onError={fieldState.invalid ? () => {} : undefined}
                slotProps={{
                  day: {
                    sx: {
                      color: "#fff !important",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      },
                    },
                  },
                  textField: { size: "small" },
                  toolbar: {
                    sx: {
                      color: "#fff !important",
                    },
                  },
                }}
              />
            </DemoItem>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
