import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import {
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useFieldArray, useForm } from "react-hook-form";

import {
  categoryOptions,
  licenseOptions,
  statusOptions,
} from "../../../../configs/data/ProjectFormData";
import { getDefaultValues } from "../../../../configs/defaultValues/defauleValues";
import { ProjectForm } from "../../../../configs/types/projectTypes";
import { useFormContext } from "../../../../context/FormContext/FormContext";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomDropdown from "../../../common/CustomDropdown/CustomDropdown";
import { InputStyles } from "../../../common/InputStyles/InputStyles";
import ErrorMessages from "../../../common/Messages/ErrorMessages/ErrorMessages";

interface StepperProps {
  handleActiveStep: (step: string) => void;
}

export default function ProjectDetails({ handleActiveStep }: StepperProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { data, updateFormData } = useFormContext();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ProjectForm>({
    defaultValues: getDefaultValues(data),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles",
  });

  const {
    fields: deliverablesFields,
    append: deliverablesAppend,
    remove: deliverablesRemove,
  } = useFieldArray<ProjectForm, "deliverables", "id">({
    control,
    name: "deliverables",
  });

  const {
    fields: UserStoryFields,
    append: UserStoryAppend,
    remove: UserStoryRemove,
  } = useFieldArray<ProjectForm, "userStories", "id">({
    control,
    name: "userStories",
  });

  const {
    fields: sitemapFields,
    append: sitemapAppend,
    remove: sitemapRemove,
  } = useFieldArray<ProjectForm, "sitemap", "id">({
    control,
    name: "sitemap",
  });

  const onSubmit = (userInput: ProjectForm) => {
    updateFormData(userInput);

    handleActiveStep("Project Images");
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Stack
        display="flex"
        flexDirection="row"
        flexWrap={isMediumScreen ? "wrap" : "nowrap"}
        sx={{ mt: isMediumScreen ? "0rem" : "1.5rem", ml: "-0.5rem" }}
      >
        <CustomDropdown
          options={categoryOptions}
          control={control}
          name="category"
        />
        <CustomDropdown
          options={statusOptions}
          control={control}
          name="status"
        />
        <CustomDropdown
          options={licenseOptions}
          control={control}
          name="license"
        />
      </Stack>
      <Box
        sx={{
          mt: 4,
        }}
      >
        <Typography
          sx={{
            width: "100%",
            py: 0.5,
            color: "#8C8C95",
            fontWeight: "400",
            fontSize: "0.8571428571428571rem",
            lineHeight: "1.4375em",
            mt: 2,
          }}
          variant="h5"
        >
          Deliverables
        </Typography>
        <Stack
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
          flexWrap="wrap"
          gap="1rem"
          sx={{ py: 1 }}
        >
          {deliverablesFields.map((deliverable, index) => (
            <Box
              key={deliverable.id}
              sx={{
                position: "relative",
                minHeight: "3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                error={!!(errors as any)[`deliverables.${index}.name`]}
                {...register(`deliverables.${index}.name` as const, {
                  required: "This is required.",
                })}
                placeholder="Deliverable"
                sx={{
                  width: "auto",
                  ...InputStyles(theme),
                  "& input": {
                    fontSize: "1rem",
                  },
                }}
                size="small"
                helperText={
                  <ErrorMessages
                    name={`deliverables.${index}.name`}
                    errors={errors}
                  />
                }
              />
              {index > 0 && (
                <IconButton
                  aria-label="delete"
                  onClick={() => deliverablesRemove(index)}
                  size="small"
                  sx={{ position: "absolute", right: -1, top: 5 }}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          ))}
          <IconButton
            type="button"
            onClick={() => deliverablesAppend({ name: "" })}
            sx={{ borderRadius: 0, p: 0 }}
          >
            <AddBoxIcon
              sx={{
                fontSize: "2.4rem",
                color: "#8C8C95",
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Box>
        <Typography
          sx={{
            width: "100%",
            py: 0.5,
            color: "#8C8C95",
            fontWeight: "400",
            fontSize: "0.8571428571428571rem",
            lineHeight: "1.4375em",
            mt: 2,
          }}
          variant="h5"
        >
          Sitemap
        </Typography>
        <Stack
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
          flexWrap="wrap"
          gap="1rem"
          sx={{ py: 1 }}
        >
          {sitemapFields.map((sitemap, index) => (
            <Box
              key={sitemap.id}
              sx={{
                position: "relative",
                minHeight: "3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                error={!!(errors as any)[`sitemap.${index}.name`]}
                {...register(`sitemap.${index}.name` as const, {
                  required: "This is required.",
                })}
                sx={{
                  width: "auto",
                  ...InputStyles(theme),
                  "& input": {
                    fontSize: "1rem",
                  },
                }}
                placeholder="Sitemap"
                size="small"
                helperText={
                  <ErrorMessages
                    name={`sitemap.${index}.name`}
                    errors={errors}
                  />
                }
              />
              {index > 0 && (
                <IconButton
                  aria-label="delete"
                  onClick={() => sitemapRemove(index)}
                  size="small"
                  sx={{ position: "absolute", right: -1, top: 5 }}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          ))}
          <IconButton
            type="button"
            onClick={() => sitemapAppend({ name: "" })}
            sx={{ borderRadius: 0, p: 0 }}
          >
            <AddBoxIcon
              sx={{
                fontSize: "2.4rem",
                color: "#8C8C95",
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Box>
        <Typography
          sx={{
            width: "100%",
            py: 0.5,
            color: "#8C8C95",
            fontWeight: "400",
            fontSize: "0.8571428571428571rem",
            lineHeight: "1.4375em",
            mt: 2,
          }}
          variant="h5"
        >
          Project Roles
        </Typography>
        <Stack
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
          flexWrap="wrap"
          gap="1rem"
          sx={{ py: 1 }}
        >
          {fields.map((role, index) => (
            <Box
              key={role.id}
              sx={{
                position: "relative",
                minHeight: "4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  width: "14.625rem",
                  px: "0.5rem",
                  height: "2.65rem",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "background.secondary"
                      : "background.default",
                }}
              >
                <TextField
                  id={`roles-name-${index}`}
                  placeholder="Role Name"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  defaultValue={role.name}
                  {...register(`roles.${index}.name`, {
                    required: "This is required.",
                  })}
                  sx={{
                    height: "75%",
                    ...InputStyles(theme),
                    "& input": {
                      fontSize: "1rem",
                    },
                  }}
                  helperText={
                    <ErrorMessages
                      name={`roles.${index}.name`}
                      errors={errors}
                      sx={{ height: "25%", mt: "2rem" }}
                    />
                  }
                />
                <Switch
                  id={`roles-requiresCollaborator-${index}`}
                  defaultChecked={role.requiresCollaborator}
                  {...register(`roles.${index}.requiresCollaborator`, {
                    required: false,
                  })}
                />
              </Box>
              {index > 0 && (
                <IconButton
                  aria-label="delete"
                  onClick={() => remove(index)}
                  sx={{ position: "absolute", right: -1, top: 5 }}
                  size="small"
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          ))}
          <IconButton
            type="button"
            onClick={() => append({ name: "", requiresCollaborator: true })}
            sx={{ borderRadius: 0, p: 0 }}
          >
            <AddBoxIcon
              sx={{
                fontSize: "2.4rem",
                color: "#8C8C95",
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            width: "100%",
            py: 0.5,
            color: "#8C8C95",
            fontWeight: "400",
            fontSize: "0.8571428571428571rem",
            lineHeight: "1.4375em",
            mt: 2,
          }}
          variant="h5"
        >
          User Stories
        </Typography>
        <Stack
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          flexWrap="wrap"
          sx={{ mt: 1, py: 1, width: "100%" }}
        >
          {UserStoryFields.map((userStory, index) => (
            <Box
              key={userStory.id}
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "100%",
                mb: 2,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "background.secondary"
                    : "background.default",
              }}
            >
              <TextField
                error={!!(errors as any)[`userStories.${index}.name`]}
                {...register(`userStories.${index}.name` as const, {
                  required: "This is required.",
                })}
                fullWidth
                variant="standard"
                sx={{
                  width: "95%",
                  ...InputStyles(theme),
                  "& input": {
                    fontSize: "1.1rem",
                    ...InputStyles(theme),
                  },
                }}
                placeholder="Userstory"
                size="medium"
                helperText={
                  <ErrorMessages
                    name={`userStories.${index}.name`}
                    errors={errors}
                  />
                }
              />
              {index > 0 && (
                <IconButton
                  aria-label="delete"
                  onClick={() => UserStoryRemove(index)}
                  sx={{ position: "absolute", right: -1, top: 5 }}
                >
                  <ClearIcon sx={{ fontSize: 22 }} />
                </IconButton>
              )}
            </Box>
          ))}
          <IconButton
            type="button"
            onClick={() => UserStoryAppend({ name: "" })}
            sx={{ mb: "2.5rem" }}
          >
            <AddBoxIcon
              sx={{
                fontSize: "2.4rem",
                color: "#8C8C95",
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <CustomButton
        leftHandleClick={() => handleActiveStep("Project Overview")}
        leftButtonText="Back"
        righButtonText="Next"
      />
    </Box>
  );
}
