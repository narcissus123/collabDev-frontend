import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Autocomplete,
  Box,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { techStacks } from "../../../configs/data/ProjectFilterFormData";
import { ProjectFormInputData } from "../../../configs/data/ProjectFormData";
import { getDefaultValues } from "../../../configs/defaultValues/defauleValues";
import { ProjectForm, ProjectType } from "../../../configs/types/projectTypes";
import CustomButton from "../../common/CustomButton/CustomButton";
import CustomModal from "../../common/CustomModal/CustomModal";
import Input from "../../common/Input/Input";
import ErrorMessages from "../../common/Messages/ErrorMessages/ErrorMessages";
import { updateProject } from "../../../core/services/api/manage-projects.api";

interface EditProjectModalProps {
  openEditProjectModal: boolean;
  handleClose: () => void;
  handleProjectInfo: (updatedProjectInfo: ProjectType) => void;
  project: any;
}

export default function EditProjectModal({
  openEditProjectModal,
  handleClose,
  handleProjectInfo,
  project,
}: EditProjectModalProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const mappedDeliverables = project.deliverables.map((del: string) => ({
    name: del,
  }));
  const mappedUserStories = project.userStories.map((story: string) => ({
    name: story,
  }));
  const mappedSitemap = project.sitemap.map((site: string) => ({
    name: site,
  }));

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<ProjectForm>({
    defaultValues: getDefaultValues({
      ...project,
      deliverables: mappedDeliverables,
      userStories: mappedUserStories,
      sitemap: mappedSitemap,
    }),
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

  const onSubmit = async (userInput: ProjectForm) => {
    try {
      const deliverables = userInput.deliverables.map((del) => del.name);
      const sitemap = userInput.sitemap.map((site) => site.name);
      const userStories = userInput.userStories.map((stories) => stories.name);
      const updateUserInput = {
        ...project,
        ...userInput,
        deliverables,
        sitemap,
        userStories,
      };

      const response = (await updateProject(
        updateUserInput._id,
        updateUserInput
      )) as any;
      if (response.status === 200) {
        toast.success("Your project info updated successfully!");
        handleProjectInfo(response.data);
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("You are not signed in! Please sign in.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };

  return (
    <CustomModal
      open={openEditProjectModal}
      handleClose={handleClose}
      cardsx={{
        width: "100vw",
        maxHeight: "100vh",
        height: "200vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToastContainer />
      <Stack
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {ProjectFormInputData.map((proj, index) => (
          <Input
            key={index}
            id={proj.id}
            ty={proj.type}
            placeholder={proj.placeholder}
            labelText={proj.labelText}
            formLabel={proj.formLabel}
            inputSize={isMediumScreen ? "small" : "medium"}
            fullWidth={proj.fullWidth}
            required={proj.required}
            multiline={proj.multiline}
            variant={proj.variant as "standard" | "outlined" | "filled"}
            errors={errors}
            {...register(proj.register.name as "title" | "description", {
              ...proj.register.schema,
            })}
          />
        ))}
        <Box>
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
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
                onChange={(event, value) => field.onChange(value)}
                value={field.value || []}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            )}
          />
        </Box>
        <Box sx={{ mt: "1.5rem" }}>
          <Typography
            sx={{
              width: "100%",
              py: 0.5,
              color: "#8C8C95",
              fontWeight: "400",
              fontSize: "0.8571428571428571rem",
              lineHeight: "1.4375em",
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
            sx={{ mt: 2, py: 1 }}
          >
            {deliverablesFields.map((deliverable, index) => (
              <Box
                key={deliverable.id}
                sx={{
                  position: "relative",
                  minHeight: "5rem",
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
                  }}
                  size="small"
                  helperText={
                    <ErrorMessages
                      name={`deliverables.${index}.name`}
                      errors={errors}
                      sx={{ height: "50%" }}
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
        <Box sx={{ mb: "1.5rem" }}>
          <Typography
            sx={{
              width: "100%",
              py: 0.5,
              color: "#8C8C95",
              fontWeight: "400",
              fontSize: "0.8571428571428571rem",
              lineHeight: "1.4375em",
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
            sx={{ mt: 2, py: 1 }}
          >
            {sitemapFields.map((sitemap, index) => (
              <Box
                key={sitemap.id}
                sx={{
                  position: "relative",
                  minHeight: "5rem",
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
        <Box sx={{ mb: "1.5rem" }}>
          <Typography
            sx={{
              width: "100%",
              my: "0.8rem",
              color: "#8C8C95",
              fontWeight: "400",
              fontSize: "0.8571428571428571rem",
              lineHeight: "1.4375em",
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
            sx={{ mt: 2, py: 1 }}
          >
            {fields.map((role, index) => (
              <Box
                key={role.id}
                sx={{
                  position: "relative",
                  minHeight: "5rem",
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
                  }}
                >
                  <TextField
                    id={`roles-name-${index}`}
                    placeholder="Role Name"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    {...register(`roles.${index}.name`, {
                      required: "This is required.",
                    })}
                    sx={{ height: "75%" }}
                    helperText={
                      <ErrorMessages
                        name={`roles.${index}.name`}
                        errors={errors}
                        sx={{ height: "25%", mt: "2rem" }}
                      />
                    }
                  />
                  <Controller
                    name={`roles.${index}.requiresCollaborator`}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
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
        <Box sx={{ my: "1.5rem" }}>
          <Typography
            sx={{
              width: "100%",
              my: 0.5,
              color: "#8C8C95",
              fontWeight: "400",
              fontSize: "0.8571428571428571rem",
              lineHeight: "1.4375em",
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
            sx={{ mt: 2, py: 1 }}
          >
            {UserStoryFields.length === 0 && (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                alignItems="flex-start"
                sx={{ width: "100%" }}
              >
                <TextField
                  error={!!errors?.userStories?.[0]}
                  {...register(`userStories.0` as const, {
                    required: "This is required.",
                  })}
                  fullWidth
                  variant="standard"
                  sx={{ width: "100%" }}
                />
                <ErrorMessages name={`userStories.0`} errors={errors} />
              </Box>
            )}
            {UserStoryFields.map((userStory, index) => (
              <Box
                key={userStory.id}
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                height="4.08rem"
                sx={{ width: "100%" }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <TextField
                    error={!!(errors as any)[`userStories.${index}.name`]}
                    {...register(`userStories.${index}.name` as const, {
                      required: "This is required.",
                    })}
                    fullWidth
                    variant="standard"
                    sx={{ width: "100%" }}
                  />
                  <IconButton
                    aria-label="delete"
                    onClick={() => UserStoryRemove(index)}
                    size="small"
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <ErrorMessages
                  name={`userStories.${index}.name`}
                  errors={errors}
                  sx={{ height: "50%", mt: "0.5rem" }}
                />
              </Box>
            ))}
            <IconButton
              type="button"
              onClick={() => UserStoryAppend({ name: "" })}
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

        <CustomButton righButtonText="Edit" />
      </Stack>
    </CustomModal>
  );
}
