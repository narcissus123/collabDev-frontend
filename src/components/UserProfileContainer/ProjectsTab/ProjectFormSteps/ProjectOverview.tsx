import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { techStacks } from "../../../../configs/data/ProjectFilterFormData";
import { ProjectFormInputData } from "../../../../configs/data/ProjectFormData";
import { getDefaultValues } from "../../../../configs/defaultValues/defauleValues";
import { ProjectForm } from "../../../../configs/types/projectTypes";
import { useFormContext } from "../../../../context/FormContext/FormContext";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomDatePicker from "../../../common/CustomDatePicker/CustomDatePicker";
import Input from "../../../common/Input/Input";
import { InputStyles } from "../../../common/InputStyles/InputStyles";

interface StepperProps {
  handleActiveStep: (step: string) => void;
}

export const linksPlatforms = [
  "GitHub",
  "GitHub/frontend",
  "GitHub/backend",
  "GitLab/frontend",
  "GitLab/backend",
  "GitLab",
  "Demo",
  "Others",
];

export default function ProjectOverview({ handleActiveStep }: StepperProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { data, updateFormData } = useFormContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<ProjectForm>({
    defaultValues: getDefaultValues(data),
  });

  const {
    fields: linksFields,
    append: linksAppend,
    remove: linksRemove,
  } = useFieldArray<ProjectForm>({
    name: "links",
    control,
  });

  const onSubmit = (userInput: ProjectForm) => {
    updateFormData(userInput);
    handleActiveStep("Project Details");
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {ProjectFormInputData.map((project) => (
          <Box key={uuidv4()} sx={{ mb: 5 }}>
            <Input
              id={project.id}
              ty={project.type}
              placeholder={project.placeholder}
              labelText={project.labelText}
              formLabel={project.formLabel}
              inputSize="small"
              fullWidth={project.fullWidth}
              required={project.required}
              multiline={project.multiline}
              variant={project.variant as "standard" | "outlined" | "filled"}
              errors={errors}
              {...register(project?.register?.name as "title" | "description", {
                ...project?.register?.schema,
              })}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            width: "100%",
            color:
              theme.palette.mode === "dark" ? "primary.main" : "text.primary",
            fontSize: "0.875rem",
            position: "relative",
            marginBottom: 1,
            "&::after": {
              content: '"*"',
              marginLeft: "4px",
              position: "absolute",
              top: 0,
            },
          }}
          variant="h5"
        >
          Tech Stack
        </Typography>
        <Controller
          control={control}
          name="techStack"
          rules={{
            required: "This is required",
            validate: (value) =>
              (value && value.length > 0) ||
              "Please select at least one technology",
          }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
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
                      color: "text.secondary",
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
                  error={!!error}
                  helperText={error?.message}
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
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          )}
        />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            width: "100%",
            my: 1,
            color:
              theme.palette.mode === "dark" ? "primary.main" : "text.primary",
            fontSize: "0.875rem",
          }}
        >
          Project Links
        </Typography>
        <Stack spacing={2}>
          {linksFields.map((item, index) => {
            return (
              <Stack
                key={item.id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Controller
                  name={`links.${index}.platform`}
                  control={control}
                  rules={{ required: "Platform is required" }}
                  render={({ field }) => {
                    return (
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <Select
                          {...field}
                          labelId={`platform-label-${index}`}
                          error={!!errors.links?.[index]?.platform}
                          sx={{
                            color: "text.secondary",
                            borderColor:
                              theme.palette.mode === "dark"
                                ? "rgb(82, 82, 82)"
                                : "rgb(196, 196, 196)",
                          }}
                        >
                          {linksPlatforms.map((platform) => (
                            <MenuItem
                              key={platform}
                              value={platform}
                              sx={{
                                color: "text.secondary",
                                borderColor:
                                  theme.palette.mode === "dark"
                                    ? "rgb(82, 82, 82)"
                                    : "rgb(196, 196, 196)",
                              }}
                            >
                              {platform}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  }}
                />
                <TextField
                  {...register(`links.${index}.url`, {
                    required: "URL is required",
                  })}
                  placeholder="URL"
                  size="small"
                  error={!!errors.links?.[index]?.url}
                  sx={{
                    flexGrow: 1,
                    ...InputStyles(theme),
                    "& .MuiOutlinedInput-root": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "rgb(82, 82, 82)"
                            : "rgb(196, 196, 196)",
                      },
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgb(100, 100, 100)"
                          : "#000000",
                    },
                  }}
                />
                <IconButton
                  aria-label="delete"
                  onClick={() => linksRemove(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            );
          })}
          <Button
            variant="outlined"
            onClick={() => linksAppend({ platform: "", url: "" })}
          >
            Add New Link
          </Button>
        </Stack>
      </Box>
      <Stack
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
        sx={{
          mb: 8,
        }}
      >
        <CustomDatePicker control={control} name="Start Date" />
        <CustomDatePicker control={control} name="Due Date" />
      </Stack>
      <CustomButton
        leftButtonText="Back"
        leftButtonDisabled={true}
        righButtonText="Next"
      />
    </Box>
  );
}
