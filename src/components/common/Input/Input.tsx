import { FormLabel, SxProps, Theme, useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { ForwardedRef } from "react";

import ErrorMessages from "../Messages/ErrorMessages/ErrorMessages";

interface InputProps {
  id: string;
  sx?: SxProps<Theme>;
  ty: string;
  placeholder: string;
  errors: object;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  name: string;
  margin?: "normal" | "dense";
  required: boolean;
  fullWidth?: boolean;
  inputSize?: "medium" | "small";
  labelText: string;
  multiline: boolean;
  variant: "standard" | "outlined" | "filled";
  formLabel?: boolean;
  minRows?: number;
}

// This component renders the label and input tags in forms.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      sx = {},
      ty,
      placeholder,
      errors,
      onChange,
      onBlur,
      name,
      margin = "dense",
      required,
      fullWidth = true,
      inputSize = "medium",
      labelText,
      multiline = false,
      variant,
      formLabel = false,
      minRows = 3,
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const theme = useTheme();
    return (
      <>
        {formLabel && <FormLabel>{labelText}</FormLabel>}
        <TextField
          id={id}
          error={
            !!Object.keys(errors).length && Object.keys(errors).includes(name)
          }
          sx={{
            ...sx,
          }}
          label={formLabel ? null : labelText}
          type={ty}
          placeholder={placeholder}
          inputRef={ref}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          margin={margin}
          required={required}
          fullWidth={fullWidth}
          size={inputSize}
          autoComplete={name}
          multiline={multiline}
          variant={variant}
          minRows={minRows}
          inputProps={{
            sx: {
              maxHeight: "5rem",
              overflowY: "auto",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "background.secondary"
                  : "background.default",
              color: "text.secondary",
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? "text.secondary"
                    : theme.palette.divider,
              },
            },
          }}
        />
        <ErrorMessages name={name} errors={errors} />
      </>
    );
  }
);
Input.displayName = "Input";
export default Input;
