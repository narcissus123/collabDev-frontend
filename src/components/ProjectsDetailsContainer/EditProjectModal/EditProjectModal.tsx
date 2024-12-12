import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { InfoOutlined } from "@mui/icons-material";
import ErrorFallback from "../../common/ErrorFallback/ErrorFallback";
import { techStacks } from "../../../configs/data/ProjectFilterFormData";
import { ProjectFormInputData } from "../../../configs/data/ProjectFormData";
import { getDefaultValues } from "../../../configs/defaultValues/defauleValues";
import { ProjectForm } from "../../../configs/types/projectTypes";
import CustomButton from "../../common/CustomButton/CustomButton";
import CustomModal from "../../common/CustomModal/CustomModal";
import Input from "../../common/Input/Input";
import ErrorMessages from "../../common/Messages/ErrorMessages/ErrorMessages";
import { updateProject } from "../../../core/services/api/manage-projects.api";
import { InputStyles } from "../../common/InputStyles/InputStyles";

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

interface EditProjectModalProps {
  openEditProjectModal: boolean;
  handleClose: () => void;
  handleProjectInfo: () => void;
  project: any;
}

export default function EditProjectModal({
  openEditProjectModal,
  handleClose,
  handleProjectInfo,
  project,
}: EditProjectModalProps) {
  const theme = useTheme();

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

  const {
    fields: linksFields,
    append: linksAppend,
    remove: linksRemove,
  } = useFieldArray<ProjectForm>({
    name: "links",
    control,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (updatedProject: { id: string; data: ProjectForm }) =>
      updateProject(updatedProject.id, updatedProject.data),

    onSuccess: (data: any) => {
      toast.success("Your project info updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["updateProject", data._id] });
      handleProjectInfo();
    },
    onError: (error: any) => {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    },
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

      const projectId: string = updateUserInput._id;
      mutation.mutate({ id: projectId, data: updateUserInput });
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
        <Stack
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {ProjectFormInputData.map((proj, index) => (
            <Box key={uuidv4()} sx={{ mb: 5 }}>
              <Input
                key={index}
                id={proj.id}
                ty={proj.type}
                placeholder={proj.placeholder}
                labelText={proj.labelText}
                formLabel={proj.formLabel}
                inputSize="small"
                fullWidth={proj.fullWidth}
                required={proj.required}
                multiline={proj.multiline}
                variant={proj.variant as "standard" | "outlined" | "filled"}
                errors={errors}
                {...register(proj?.register?.name as "title" | "description", {
                  ...proj?.register?.schema,
                })}
              />
            </Box>
          ))}
          <Box sx={{ mb: 5 }}>
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
                  isOptionEqualToValue={(option, value) =>
                    option.label === value.label
                  }
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
                  theme.palette.mode === "dark"
                    ? "primary.main"
                    : "text.primary",
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
          <Box>
            <Typography
              sx={{
                width: "100%",
                color:
                  theme.palette.mode === "dark"
                    ? "primary.main"
                    : "text.primary",
                fontSize: "0.875rem",
                fontWeight: "400",
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
              sx={{ py: 1 }}
            >
              {deliverablesFields.map((deliverable, index) => (
                <Box
                  key={deliverable.id}
                  sx={{
                    position: "relative",
                    minHeight: "4rem",
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
                    inputProps={{
                      sx: {
                        color: "text.secondary",
                      },
                    }}
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
          <Box sx={{ mb: 5 }}>
            <Typography
              sx={{
                width: "100%",
                color:
                  theme.palette.mode === "dark"
                    ? "primary.main"
                    : "text.primary",
                fontSize: "0.875rem",
                fontWeight: "400",
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
              sx={{ py: 1 }}
            >
              {sitemapFields.map((sitemap, index) => (
                <Box
                  key={sitemap.id}
                  sx={{
                    position: "relative",
                    minHeight: "4rem",
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
                    inputProps={{
                      sx: {
                        color: "text.secondary",
                      },
                    }}
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
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="flex-start"
            >
              <Typography
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? "primary.main"
                      : "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: "400",
                  lineHeight: "1.4375em",
                }}
                variant="h5"
              >
                Project Roles
              </Typography>
              <Tooltip
                title="Toggle the switch if this role requires a project collaborator."
                arrow
                placement="right"
              >
                <InfoOutlined
                  sx={{
                    color: "#8C8C95",
                    fontSize: "1.1rem",
                  }}
                />
              </Tooltip>
            </Box>
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
                      borderRadius: "0.2rem",
                      width: "14.625rem",
                      px: "0.5rem",
                      height: "2.65rem",
                      "&:hover": {
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "rgb(100, 100, 100)"
                            : "#000000",
                      },
                      border: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "rgb(82, 82, 82)"
                          : "rgb(196, 196, 196)",
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
                      sx={{
                        height: "75%",
                      }}
                      inputProps={{
                        sx: {
                          color: "text.secondary",
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
                    <Tooltip
                      title="Toggle if this role requires a collaborator"
                      arrow
                    >
                      <Switch
                        id={`roles-requiresCollaborator-${index}`}
                        defaultChecked={role.requiresCollaborator}
                        {...register(`roles.${index}.requiresCollaborator`, {
                          required: false,
                        })}
                      />
                    </Tooltip>
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
          <Box>
            <Typography
              sx={{
                width: "100%",
                my: 0.5,
                color:
                  theme.palette.mode === "dark"
                    ? "primary.main"
                    : "text.primary",
                fontSize: "0.875rem",
                fontWeight: "400",
                lineHeight: "1.4375em",
                mb: 1,
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
              sx={{ py: 1 }}
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
                    inputProps={{
                      sx: {
                        color: "text.secondary",
                      },
                    }}
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
                    sx={{
                      width: "100%",
                    }}
                  >
                    <TextField
                      error={!!(errors as any)[`userStories.${index}.name`]}
                      {...register(`userStories.${index}.name` as const, {
                        required: "This is required.",
                      })}
                      fullWidth
                      variant="standard"
                      inputProps={{
                        sx: {
                          color: "text.secondary",
                          fontSize: "0.87rem",
                        },
                      }}
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
    </ErrorBoundary>
  );
}
