import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { isBefore, addDays, startOfDay } from "date-fns";
import { useParams } from "react-router-dom";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { GitHub, OndemandVideo, OpenInNew } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import GavelIcon from "@mui/icons-material/Gavel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext/AuthContext";
import {
  getProjectById,
  updateProject,
} from "../../core/services/api/manage-projects.api";

import ErrorFallback from "../common/ErrorFallback/ErrorFallback";
import { ProjectForm } from "../../configs/types/projectTypes";
import { getImageUrl } from "../../core/utils/ImageUtils/imageUtils";
import { EditProjectImageModal } from "./EditProjectImageModal/EditProjectImageModal";
import EditProjectModal from "./EditProjectModal/EditProjectModal";
import ProjectLogoGenerator from "./ProjectLogoGenerator";

export default function ProjectsDetailsContainer() {
  const { isProfileOwner } = useAuth();
  const { projectId } = useParams();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openEditProjectModal, setOpenEditProjectModal] =
    useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data: project } = useSuspenseQuery({
    queryKey: ["getProjectById", projectId],
    queryFn: () => getProjectById(projectId),
  });

  const handleProjectInfo = () => {
    queryClient.invalidateQueries({ queryKey: ["getProjectById", projectId] });
  };

  const [openEditImageModal, setOpenEditImageModal] = useState<boolean>(false);
  const handleProjectImage = () => {
    queryClient.invalidateQueries({ queryKey: ["getProjectById", projectId] });
  };

  if (!project.data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          mt: "5rem",
        }}
      >
        No project found
      </Box>
    );
  }

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

  const handleLogoStyleChange = async (style: number) => {
    try {
      if (projectId)
        mutation.mutate({
          id: projectId,
          data: { ...project.data, logoStyle: style },
        });
      queryClient.invalidateQueries({
        queryKey: ["getProjectById", projectId],
      });
    } catch (error) {
      console.error("Failed to update logo style:", error);
    }
  };

  const getDynamicPlaceholder = (name: string) => {
    if (!name) return "";

    let initials = name
      .split(" ")
      .map((word: any) => word[0])
      .slice(0, 2)
      .join("");

    if (initials.length === 1) {
      initials = name.length > 1 ? name[0] + name[1] : name[0];
    }
    return initials;
  };
  const [imageError, setImageError] = useState(false);

  const getIcon = (platform: string) => {
    if (!platform) return;
    if (platform?.toLowerCase().includes("github")) {
      return (
        <GitHub
          sx={{
            fontSize: "1.2rem",
            color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
          }}
        />
      );
    } else if (platform?.toLowerCase().includes("gitlab")) {
      return (
        <svg
          height="19"
          width="19"
          viewBox="0 0 24 24"
          fill={theme.palette.mode === "dark" ? " #A0A0A0" : ""}
        >
          <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
        </svg>
      );
    } else if (platform?.toLowerCase() === "demo") {
      return (
        <OndemandVideo
          sx={{
            fontSize: "1.2rem",
            color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
          }}
        />
      );
    } else {
      return (
        <OpenInNew
          sx={{
            fontSize: "1.2rem",
            color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
          }}
        />
      );
    }
  };

  const getPlatformLabel = (platform: string) => {
    if (!platform) return;
    if (platform?.includes("/")) {
      const [main, sub] = platform.split("/");
      return `${main} (${sub})`;
    }
    return platform;
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid red",
              mt: 24,
              bg: "red",
            }}
          >
            From projectsDetailsContainer
          </Box>
        }
      >
        <Box
          sx={{
            minHeight: "150vh",
            my: "4rem",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "30rem",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          >
            {project.data.coverImage[0] && !imageError ? (
              <Box
                component="img"
                src={getImageUrl(project.data.coverImage)}
                srcSet={getImageUrl(project.data.coverImage)}
                alt="project cover"
                loading="lazy"
                sx={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  maxHeight: "25rem",
                  objectFit: "cover",
                  borderBottom: "1px solid",
                  borderColor: "text.secondary",
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Box sx={{ my: 6 }}>
                <ProjectLogoGenerator
                  initial={getDynamicPlaceholder(project.data.title)}
                  initialStyle={project.data.logoStyle || 0}
                  onStyleChange={handleLogoStyleChange}
                  isOwner={isProfileOwner(project?.data.owner?._id)}
                />
              </Box>
            )}
            <Box
              sx={{
                position: "absolute",
                top: 38,
                right: { xs: 10, md: 30 },
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(30, 30, 30, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                padding: "16px",
                px: "26px",
                borderRadius: "12px",
                boxShadow: theme.shadows[4],
                maxWidth: { xs: "250px", md: "300px" },
                zIndex: 20,
                backdropFilter: "blur(8px)",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                    color: theme.palette.mode === "dark" ? "primary.main" : "",
                  }}
                >
                  <CalendarTodayIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                    }}
                  />
                  Start Date:
                  {new Date(project.data.startDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                    color: theme.palette.mode === "dark" ? "primary.main" : "",
                  }}
                >
                  <EventIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                    }}
                  />
                  Due Date:{" "}
                  {project.data.status === "In Progress" &&
                  isBefore(
                    new Date(project.data.startDate),
                    startOfDay(addDays(new Date(), 1))
                  )
                    ? "Present"
                    : new Date(project.data.dueDate).toLocaleDateString()
                      ? "Present"
                      : new Date(project.data.dueDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                    color: theme.palette.mode === "dark" ? "primary.main" : "",
                  }}
                >
                  <GavelIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                    }}
                  />
                  License: {project.data.license}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                    color: theme.palette.mode === "dark" ? "primary.main" : "",
                  }}
                >
                  <LocationOnIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                    }}
                  />
                  Location: {project.data.location}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                    color: theme.palette.mode === "dark" ? "primary.main" : "",
                  }}
                >
                  <CategoryIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                    }}
                  />
                  Category: {project.data.category}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                    color: theme.palette.mode === "dark" ? "primary.main" : "",
                  }}
                >
                  <AccessTimeIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                    }}
                  />
                  Status: {project.data.status}
                </Typography>
              </Stack>
            </Box>

            <IconButton
              sx={{
                position: "absolute",
                left: 3,
                bottom: 10,
                backgroundColor: theme.palette.mode === "dark" ? "#fff" : "",
                color: theme.palette.mode === "dark" ? " #A0A0A0" : "",
                zIndex: 30,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
              onClick={() => {
                setOpenEditImageModal((prev: boolean) => !prev);
              }}
            >
              <AddPhotoAlternateIcon />
            </IconButton>

            {openEditImageModal && (
              <EditProjectImageModal
                openEditImageModal={openEditImageModal}
                handleClose={() => {
                  setOpenEditImageModal((prev: boolean) => !prev);
                }}
                handleProjectImage={handleProjectImage}
                project={project.data}
              />
            )}
          </Box>
          <Box
            sx={{
              m: isLargeScreen ? "2.5rem 1.75rem" : "5rem 6.25rem",
              display: "flex",
              flexDirection: "column",
              gap: isLargeScreen ? 4 : 9,
              position: "relative",
            }}
          >
            {isProfileOwner(project?.data.owner?._id) && (
              <IconButton
                aria-label="edit"
                sx={{
                  position: "absolute",
                  top: isLargeScreen ? "0rem" : "-2rem",
                  right: isLargeScreen ? "0rem" : "-2rem",
                }}
                onClick={() => {
                  setOpenEditProjectModal((prev: boolean) => !prev);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {openEditProjectModal && (
              <EditProjectModal
                openEditProjectModal={openEditProjectModal}
                handleClose={() => {
                  setOpenEditProjectModal((prev: boolean) => !prev);
                }}
                handleProjectInfo={handleProjectInfo}
                project={project.data}
              />
            )}
            <Stack
              direction={isLargeScreen ? "column" : "row"}
              justifyContent={isLargeScreen ? "flex-start" : "space-between"}
              alignItems="flex-start"
              gap={isLargeScreen ? 2 : 0}
            >
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color:
                    theme.palette.mode === "dark" ? "primary.main" : "#15191b",
                  fontSize: isLargeScreen ? "2rem" : "3.375rem",
                  lineHeight: "normal",
                  letterSpacing: "0.028125rem",
                  flex: 1,
                  width: isLargeScreen ? "100%" : "30%",
                }}
              >
                {project.data?.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: "normal",
                  fontSize: isLargeScreen ? "0.875rem" : "1rem",
                  fontStretch: "normal",
                  color:
                    theme.palette.mode === "dark"
                      ? "text.secondary"
                      : "#424d54",
                  width: isLargeScreen ? "100%" : "70%",
                }}
              >
                {project.data?.description}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              flexWrap="wrap"
              spacing={2}
              sx={{
                my: 3,
                width: "100%",
                maxWidth: isLargeScreen ? "100%" : "70%",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                  fontWeight: "600",
                  color:
                    theme.palette.mode === "dark" ? "primary.main" : "#15191b",
                  fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                  width: "100%",
                }}
              >
                Project Links
              </Typography>

              {project.data.links.length > 0 &&
              Object.keys(project.data.links[0].length > 0) ? (
                project.data.links.slice(0, 10).map((link: any) => (
                  <Tooltip
                    key={link.platform + link.url}
                    title={`Visit ${getPlatformLabel(link.platform)}`}
                    placement="right"
                  >
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        color:
                          theme.palette.mode === "dark" ? "#fff" : "#424d54",
                        fontSize: isLargeScreen ? "0.875rem" : "1rem",
                        fontFamily:
                          '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                        padding: "8px 16px",
                        borderRadius: "8px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.08)",
                          transform: "translateY(-1px)",
                          "& svg": {
                            color:
                              theme.palette.mode === "dark" ? "#fff" : "#000",
                          },
                        },
                      }}
                    >
                      {getIcon(link.platform)}
                      <span>{getPlatformLabel(link.platform)}</span>
                    </Link>
                  </Tooltip>
                ))
              ) : (
                <>N/A</>
              )}
            </Stack>

            <Stack
              direction="row"
              justifyContent={isSmallScreen ? "flex-start" : "space-between"}
              flexWrap="wrap"
            >
              <List sx={{ P: 0 }}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemText
                    disableTypography
                    primary="TechStack"
                    sx={{
                      fontFamily:
                        '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                      fontWeight: "600",
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "#15191b",
                      fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                      mt: 3,
                    }}
                  />
                </ListItem>
                {project.data?.techStack.length > 0 &&
                  project.data?.techStack.map(
                    (tech: { id: string; label: string; value: string }) => (
                      <ListItem key={tech.id} sx={{ p: 0 }}>
                        <ListItemText
                          secondaryTypographyProps={{
                            fontSize: "0.9rem",
                            fontFamily:
                              '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                            fontWeight: "normal",
                            color:
                              theme.palette.mode === "dark"
                                ? "text.secondary"
                                : "#424d54",
                            lineHeight: 1.6,
                          }}
                          secondary={tech.value}
                        />
                      </ListItem>
                    )
                  )}
              </List>
              <List sx={{ width: isSmallScreen ? "100%" : undefined, p: 0 }}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemText
                    primary="Roles"
                    disableTypography
                    sx={{
                      fontFamily:
                        '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                      fontWeight: "600",
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "#15191b",
                      fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                      mt: 3,
                    }}
                  />
                </ListItem>
                {project.data?.roles.map(
                  (role: { name: string; requiresCollaborator: boolean }) => (
                    <ListItem key={role.name} sx={{ p: 0 }}>
                      <ListItemText
                        disableTypography
                        secondary={
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              fontFamily:
                                '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                              fontWeight: "normal",
                              color:
                                theme.palette.mode === "dark"
                                  ? "text.secondary"
                                  : "#424d54",
                              lineHeight: 1.6,
                            }}
                          >
                            {role.requiresCollaborator ? (
                              <Tooltip title="This role requires a collaborator">
                                <span>{`${role.name} *`}</span>
                              </Tooltip>
                            ) : (
                              role.name
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                  )
                )}
              </List>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemText
                    disableTypography
                    primary="Deliverables"
                    sx={{
                      fontFamily:
                        '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                      fontWeight: "600",
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "#15191b",
                      fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                      mt: 3,
                    }}
                  />
                </ListItem>
                {project.data?.deliverables.map(
                  (deliverable: string, index: number) => {
                    return (
                      <ListItem
                        key={index}
                        sx={{
                          fontSize: isLargeScreen ? "0.05" : "1.1rem",
                          p: 0,
                        }}
                      >
                        <ListItemText
                          secondaryTypographyProps={{
                            fontSize: "0.9rem",
                            fontFamily:
                              '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                            fontWeight: "normal",
                            color:
                              theme.palette.mode === "dark"
                                ? "text.secondary"
                                : "#424d54",
                            lineHeight: 1.6,
                          }}
                          secondary={deliverable as any}
                        />
                      </ListItem>
                    );
                  }
                )}
              </List>
            </Stack>
            <Stack
              direction={isLargeScreen ? "column" : "row"}
              justifyContent={isLargeScreen ? "flex-start" : "space-between"}
              alignItems="flex-start"
              gap={isLargeScreen ? 2 : 0}
            >
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                  fontWeight: "600",
                  color:
                    theme.palette.mode === "dark" ? "primary.main" : "#15191b",
                  fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                  width: isLargeScreen ? "100%" : "30%",
                }}
              >
                The Solution
              </Typography>
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: "normal",
                  fontSize: isLargeScreen ? "0.875rem" : "1rem",
                  fontStretch: "normal",
                  color:
                    theme.palette.mode === "dark"
                      ? "text.secondary"
                      : "#424d54",
                  width: isLargeScreen ? "100%" : "70%",
                }}
              >
                {project.data?.solution}
              </Typography>
            </Stack>
            <Stack spacing={4}>
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                  fontWeight: "600",
                  color:
                    theme.palette.mode === "dark" ? "primary.main" : "#15191b",
                  fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                  width: "100%",
                }}
              >
                Features
              </Typography>
              <List sx={{ p: 0 }}>
                {project.data?.userStories.map(
                  (feature: string, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        p: 0,
                        paddingLeft: isSmallScreen ? "0rem" : "2rem",
                        marginTop: "-0.9rem",
                      }}
                    >
                      <ListItemText
                        secondary={`\u2022 ${feature}`}
                        secondaryTypographyProps={{
                          fontFamily:
                            '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                          fontWeight: "normal",
                          color:
                            theme.palette.mode === "dark"
                              ? "text.secondary"
                              : "#424d54",
                        }}
                        sx={{
                          "& .MuiListItemText-secondary": {
                            fontSize: "0.9rem",
                            lineHeight: 2,
                          },
                        }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Stack>
            <Stack spacing={4}>
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                  fontWeight: "600",
                  color:
                    theme.palette.mode === "dark" ? "primary.main" : "#15191b",
                  fontSize: isLargeScreen ? "1.2rem" : "1.3rem",
                  width: "100%",
                }}
              >
                Sitemap
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {project.data?.sitemap.map((item: string, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flex: "1 1 auto",
                      minWidth: "150px",
                      maxWidth: "33%",
                      marginBottom: "8px",
                      justifyContent: "center",
                      fontSize: isLargeScreen ? "0.875rem" : "1rem",
                      color:
                        theme.palette.mode === "dark"
                          ? "text.secondary"
                          : "#424d54",
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
}
