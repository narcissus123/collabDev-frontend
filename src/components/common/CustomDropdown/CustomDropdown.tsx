import { useTheme } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";

import { InputStyles } from "../InputStyles/InputStyles";

interface CustomDropdownProps {
  name: string;
  control: Control<any>;
  options: string[];
}

export default function CustomDropdown({
  name,
  control,
  options,
}: CustomDropdownProps) {
  const theme = useTheme();
  return (
    <FormControl sx={{ m: 1, minWidth: 229 }} size="medium">
      <InputLabel id="demo-select-small-label" sx={{ color: "text.secondary" }}>
        {name}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="Category"
            {...field}
            value={field.value || ""}
            error={fieldState.invalid}
            sx={{ ...InputStyles(theme) }}
          >
            <MenuItem value="" sx={{ color: "text.secondary" }}>
              <em>None</em>
            </MenuItem>
            {options.map((option: string, index: number) => (
              <MenuItem
                key={index}
                value={option}
                sx={{ color: "text.secondary" }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
