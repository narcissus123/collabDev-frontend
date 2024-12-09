import { FormLabel, SxProps, Theme, useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { ForwardedRef } from "react";

import ErrorMessages from "../Messages/ErrorMessages/ErrorMessages";

interface LabelStyle extends React.CSSProperties {
  "&::after"?: {
    content?: string;
    marginLeft?: string;
    position?: "absolute" | "relative" | "fixed" | "sticky" | "static";
    top?: number;
  };
}

interface PtClassName {
  labelStyle?: LabelStyle;
}

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
  required?: boolean;
  fullWidth?: boolean;
  inputSize?: "medium" | "small";
  labelText?: string;
  multiline: boolean;
  variant: "standard" | "outlined" | "filled";
  formLabel?: boolean;
  minRows?: number;
  ptClassName?: PtClassName;
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
      ptClassName,
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const theme = useTheme();

    const labelSx: SxProps<Theme> = {
      width: "100%",
      color: theme.palette.mode === "dark" ? "primary.main" : "text.primary",
      fontSize: "0.875rem",
      position: required ? "relative" : undefined,
      "&::after": required
        ? {
            content: '"*"',
            marginLeft: "4px",
            position: "absolute",
            top: 0,
          }
        : undefined,
      ...(ptClassName?.labelStyle as any),
    };

    return (
      <>
        {formLabel && <FormLabel sx={labelSx}>{labelText}</FormLabel>}
        <TextField
          id={id}
          error={
            !!Object.keys(errors).length && Object.keys(errors).includes(name)
          }
          sx={{
            ...sx,
            p: 0,
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
              maxHeight: "15rem",
              overflowY: "auto",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
              Padding: 0,
              backgroundColor:
                theme.palette.mode === "dark" ? "" : "background.default",
              color: "text.secondary",
              "& .MuiOutlinedInput-notchedOutline": {
                Padding: 2,
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
