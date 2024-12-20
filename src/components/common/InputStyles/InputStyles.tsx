export const InputStyles = (theme: any) => ({
  "& .MuiInputBase-root": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.secondary
        : theme.palette.background.default,
  },
  "& .MuiChip-root": {
    color: theme.palette.text.secondary,
    fontSize: "0.8rem",
    "& .MuiChip-deleteIcon": {
      color:
        theme.palette.mode === "dark"
          ? theme.palette.secondary.main
          : theme.palette.neutral.dark,
    },
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor:
      theme.palette.mode === "dark" ? "rgb(82, 82, 82)" : "rgb(196, 196, 196)",
  },
  "& .MuiAutocomplete-tag": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
  },
  "& .MuiAutocomplete-clearIndicator": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
  },
  "& .MuiSelect-select": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
  },
  "& .MuiSelect-icon": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
  },
  "& .MuiFormLabel-root": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
  },
});

export const getStepStyles = (theme: any, isActive: any, isCompleted: any) => ({
  // Style for the icon container
  "& .MuiStepIcon-root": {
    color: isActive
      ? theme.palette.primary.main
      : isCompleted
        ? theme.palette.success.main
        : theme.palette.text.secondary,
  },
  // Style for the label
  "& .MuiStepLabel-label": {
    color: isActive
      ? theme.palette.primary.main
      : isCompleted
        ? theme.palette.success.main
        : theme.palette.text.secondary,
    ...(isActive && {
      fontWeight: "bold",
    }),
  },
});
