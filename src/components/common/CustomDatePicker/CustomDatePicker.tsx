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
                  fontSize: "0.8571428571428571rem",
                  lineHeight: "1.4375em",
                  color: "text.secondary",
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
                        ? "text.secondary"
                        : theme.palette.text.secondary,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.background.default,
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "text.secondary"
                        : theme.palette.divider,
                  },
                }}
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? dayjs(date) : null)}
                onError={fieldState.invalid ? () => {} : undefined}
              />
            </DemoItem>
          )}
        />
      </Box>
    </LocalizationProvider>
  );
}
