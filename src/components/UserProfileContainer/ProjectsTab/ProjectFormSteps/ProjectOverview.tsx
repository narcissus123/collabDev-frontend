import {
  Autocomplete,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Controller, useForm } from "react-hook-form";
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

  const onSubmit = (userInput: ProjectForm) => {
    updateFormData(userInput);
    handleActiveStep("Project Details");
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {ProjectFormInputData.map((project) => (
          <Box key={uuidv4()} sx={{ mb: 3 }}>
            <Input
              id={project.id}
              ty={project.type}
              placeholder={project.placeholder}
              labelText={project.labelText}
              formLabel={project.formLabel}
              inputSize={isMediumScreen ? "small" : "medium"}
              fullWidth={project.fullWidth}
              required={project.required}
              multiline={project.multiline}
              variant={project.variant as "standard" | "outlined" | "filled"}
              errors={errors}
              {...register(project.register.name as "title" | "description", {
                ...project.register.schema,
              })}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            width: "100%",
            my: 1,
            color: "#8C8C95",
            fontWeight: "400",
            fontSize: "0.8571428571428571rem",
            lineHeight: "1.4375em",
          }}
          variant="h5"
        >
          Tech Stack
        </Typography>
        <Controller
          control={control}
          name="techStack"
          render={({ field }) => (
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
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "background.secondary"
                          : "#eeeeee",
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
                  sx={{
                    ...InputStyles(theme),
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
      <Stack
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
        sx={{ mb: 3 }}
      >
        <CustomDatePicker control={control} name="startDate" />
        <CustomDatePicker control={control} name="dueDate" />
      </Stack>
      <CustomButton
        leftButtonText="Back"
        leftButtonDisabled={true}
        righButtonText="Next"
      />
    </Box>
  );
}
