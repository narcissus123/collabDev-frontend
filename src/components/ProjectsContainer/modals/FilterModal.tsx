import { memo } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Select,
  Slider,
  SliderValueLabelProps,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  categoryOptions,
  techStacks,
} from "../../../configs/data/ProjectFilterFormData";
import CustomButton from "../../common/CustomButton/CustomButton";
import CustomDatePicker from "../../common/CustomDatePicker/CustomDatePicker";
import { InputStyles } from "../../common/InputStyles/InputStyles";

function ValueLabelComponent(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

type TechStack = {
  label: string;
  value: string;
};

type Filters = {
  category?: string;
  dueDate?: Dayjs;
  likes?: number;
  startDate?: Dayjs;
  status?: string;
  techStack?: TechStack[];
};

interface FiltertModalProps {
  setQueryString: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}
function FiltertModal({ setQueryString, disabled }: FiltertModalProps) {
  const theme = useTheme();
  const { handleSubmit, control } = useForm();

  const formatFilters = (filters: Filters) => {
    const queryString = Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null) // Remove undefined and null values
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length !== 0) {
            return `${key}=${value.map((v) => v.value).join(",")}`;
          }
        } else if (dayjs.isDayjs(value)) {
          return `${key}=${value.format("YYYY-MM-DD")}`;
        } else if (typeof value === "string" || typeof value === "number") {
          if (value !== "All") {
            return `${key}=${encodeURIComponent(String(value))}`;
          }
        }
      })
      .join("&");

    return queryString;
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (userInput: any) => {
    const formatedData = formatFilters(userInput);

    setQueryString(formatedData);
  };

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Seeking Collaborators", label: "Seeking Collaborators" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={disabled}
        startIcon={<TuneIcon />}
      >
        Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          mt: "0.5rem",
          mr: "2rem",
          p: 0,
          maxHeight: "35rem",
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Card
            sx={{
              width: "22rem",
              maxWidth: { lg: "300px" },
              boxShadow: "none",

              bgcolor:
                theme.palette.mode === "dark"
                  ? "background.secondary"
                  : "background.default",
            }}
          >
            <CardHeader
              sx={{
                borderBottom: "1px solid #ccc",
                color:
                  theme.palette.mode === "dark"
                    ? "secondary.main"
                    : "border.secondary",
                fontWeight: 600,
                fontSize: "1rem",
              }}
              title="Filter"
            />
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Stack
                direction={{ xs: "column", lg: "column" }}
                sx={{
                  height: "30%",
                }}
                gap={4}
              >
                <FormControl>
                  <Stack
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    width="100%"
                  >
                    <CustomDatePicker
                      control={control}
                      name="startDate"
                      label="From"
                    />
                    <CustomDatePicker
                      control={control}
                      name="dueDate"
                      label="To"
                    />
                  </Stack>
                </FormControl>
                <FormControl>
                  <Typography
                    id="filter-status-label"
                    sx={{
                      width: "100%",
                      my: 1,
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "text.primary",
                      fontSize: "0.875rem",
                      fontWeight: "400",
                      lineHeight: "1.4375em",
                      mb: 1,
                    }}
                  >
                    Status
                  </Typography>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        labelId="filter-status-label"
                        id="filter-status"
                        value={field.value || "All"}
                        onChange={(e) => field.onChange(e.target.value)}
                        sx={{
                          color: "text.secondary",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgb(38, 39, 43)"
                              : theme.palette.background.default,
                          "& .MuiOutlinedInput-notchedOutline": {
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
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                          },
                          "& .MuiSelect-icon": {
                            color: theme.palette.text.secondary,
                          },
                        }}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "#ffffff"
                                  : theme.palette.text.secondary,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "black"
                                  : theme.palette.background.default,
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <Typography
                    sx={{
                      width: "100%",
                      my: 1,
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "text.primary",
                      fontSize: "0.875rem",
                      fontWeight: "400",
                      lineHeight: "1.4375em",
                      mb: 1,
                    }}
                  >
                    Category
                  </Typography>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        options={categoryOptions}
                        getOptionLabel={(option) => option.label}
                        filterOptions={(options, state) =>
                          options.filter((option) =>
                            option.label
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          )
                        }
                        renderOption={(props, option) => {
                          const { label } = option;
                          return (
                            <Typography
                              {...props}
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "white"
                                    : "text.secondary",
                              }}
                            >
                              {label}
                            </Typography>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            sx={{
                              ...InputStyles(theme),
                              "& .MuiFormHelperText-root": {
                                fontSize: "0.8rem",
                                marginLeft: 0,
                              },
                              "& .MuiOutlinedInput-root": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "dark"
                                      ? "rgb(82, 82, 82)"
                                      : "rgb(196, 196, 196)",
                                  borderWidth: "1px",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "dark"
                                      ? "rgb(100, 100, 100)"
                                      : "#000000",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor:
                                      theme.palette.mode === "dark"
                                        ? "primary.main"
                                        : "primary.main",
                                  },
                              },
                            }}
                          />
                        )}
                        onChange={(event, value) => field.onChange(value)}
                        value={field.value || []}
                        isOptionEqualToValue={(option, value) =>
                          option.label === value.label
                        }
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <Typography
                    sx={{
                      width: "100%",
                      my: 1,
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "text.primary",
                      fontSize: "0.875rem",
                      fontWeight: "400",
                      lineHeight: "1.4375em",
                      mb: 1,
                    }}
                  >
                    Technology
                  </Typography>
                  <Controller
                    control={control}
                    name="techStack"
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        sx={{ color: "text.secondary" }}
                        multiple
                        options={techStacks}
                        getOptionLabel={(option) => option.label}
                        filterOptions={(options, state) =>
                          options.filter((option) =>
                            option.label
                              .toLowerCase()
                              .includes(state.inputValue.toLowerCase())
                          )
                        }
                        renderOption={(props, option) => {
                          const { label } = option;
                          return (
                            <Typography
                              {...props}
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "white"
                                    : "text.secondary",
                              }}
                            >
                              {label}
                            </Typography>
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            sx={{
                              ...InputStyles(theme),
                              "& .MuiFormHelperText-root": {
                                fontSize: "0.8rem",
                                marginLeft: 0,
                              },
                              "& .MuiOutlinedInput-root": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "dark"
                                      ? "rgb(82, 82, 82)"
                                      : "rgb(196, 196, 196)",
                                  borderWidth: "1px",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor:
                                    theme.palette.mode === "dark"
                                      ? "rgb(100, 100, 100)"
                                      : "#000000",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor:
                                      theme.palette.mode === "dark"
                                        ? "primary.main"
                                        : "primary.main",
                                  },
                              },
                            }}
                          />
                        )}
                        onChange={(event, value) => field.onChange(value)}
                        value={field.value || []}
                        isOptionEqualToValue={(option, value) =>
                          option.label === value.label
                        }
                      />
                    )}
                  />
                </FormControl>
                <FormControl sx={{ width: 300, display: "none" }}>
                  <Typography sx={{ color: "text.secondary" }}>
                    likes
                  </Typography>
                  <Controller
                    name="likes"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        valueLabelDisplay="auto"
                        slots={{
                          valueLabel: ValueLabelComponent,
                        }}
                        aria-label="custom thumb label"
                        defaultValue={20}
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "secondary.main"
                              : "border.secondary",
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Stack>
            </CardContent>
            <CardActions sx={{ borderTop: "1px solid #ccc" }}>
              <CustomButton
                leftButtonsx={{
                  borderTop: "1px solid #ccc",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "secondary.main"
                      : "border.secondary",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                righButtonText="Apply"
              />
            </CardActions>
          </Card>
        </Box>
      </Menu>
    </Box>
  );
}

export default memo(FiltertModal);
