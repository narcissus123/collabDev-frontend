import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { isBefore, addDays, startOfDay } from "date-fns";
import { useParams } from "react-router-dom";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
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
import GitHubIcon from "@mui/icons-material/GitHub";
import LockIcon from "@mui/icons-material/Lock";

import { useAuth } from "../../context/AuthContext/AuthContext";
import { getProjectById } from "../../core/services/api/manage-projects.api";

import ErrorFallback from "../common/ErrorFallback/ErrorFallback";
import { EditProjectImageModal } from "./EditProjectImageModal/EditProjectImageModal";
import EditProjectModal from "./EditProjectModal/EditProjectModal";

export default function ProjectsDetailsContainer() {
  const user = useAuth();
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
    // queryClient.setQueryData(['project', projectId], updatedProjectInfo);
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
            minHeight: "100vh",
            mt: "4rem",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: "25rem",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={`http://localhost:8080/public/userProfileImages/${project.data.coverImage[0]}?w=600&h=400&fit=crop&auto=format`}
              srcSet={`http://localhost:8080/public/userProfileImages/${project.data.coverImage[0]}?w=600&h=400&fit=crop&auto=format&dpr=2 2x`}
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
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${process.env.PUBLIC_URL}/assets/images/ProjectCoverImagePlaceholder.webp`;
                e.currentTarget.srcset = `${`${process.env.PUBLIC_URL}/assets/images/ProjectCoverImagePlaceholder.webp`} 2x`;
              }}
            />

            {/* Project Details Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 40,
                right: 30,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: "16px",
                px: "26px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                maxWidth: "300px",
                zIndex: 20,
              }}
            >
              <Stack spacing={3}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  Start Date:{" "}
                  {new Date(project.data.startDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                  }}
                >
                  <EventIcon sx={{ fontSize: 16 }} />
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
                  }}
                >
                  <GavelIcon sx={{ fontSize: 16 }} />
                  License: {project.data.license}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  Location: {project.data.location}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 16 }} />
                  Category: {project.data.category}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: 14,
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  Status: {project.data.status}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GitHubIcon sx={{ fontSize: 16 }} />
                  {project.data.links[0] !== "" ? (
                    <Link
                      href={project.data.links[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        fontSize: 14,
                      }}
                    >
                      GitHub
                    </Link>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ fontSize: 14 }}
                      >
                        GitHub
                      </Typography>
                      <Tooltip
                        title="Private Repository"
                        arrow
                        sx={{ fontSize: 16 }}
                      >
                        <LockIcon
                          sx={{
                            fontSize: 16,
                            color: "error.main",
                          }}
                        />
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>

            <IconButton
              sx={{
                position: "absolute",
                left: 3,
                bottom: 10,
                backgroundColor: "#fff",
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
            {user.isUser && (
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
              sx={{ border: "1px solid white" }}
              gap={isLargeScreen ? 2 : 0}
            >
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color: "#15191b",
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
                  fontSize: isLargeScreen ? "0.875" : "1rem",
                  fontStretch: "normal",
                  color: "#424d54",
                  width: isLargeScreen ? "100%" : "70%",
                }}
              >
                {project.data?.description}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent={isSmallScreen ? "flex-start" : "space-between"}
              flexWrap="wrap"
            >
              <List>
                <ListItem>
                  <ListItemText
                    disableTypography
                    primary="TechStack"
                    sx={{
                      fontFamily:
                        '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                      fontWeight: "550",
                      fontStretch: "normal",
                      color: "#15191b",
                      fontSize: isLargeScreen ? "1rem" : "1.3rem",
                    }}
                  />
                </ListItem>
                {project.data?.techStack.length > 0 &&
                  project.data?.techStack.map(
                    (tech: { id: string; label: string; value: string }) => (
                      <ListItem
                        key={tech.id}
                        sx={{ fontSize: isLargeScreen ? "0.05" : "1.1rem" }}
                      >
                        <ListItemText
                          disableTypography
                          secondary={tech.value}
                          sx={{
                            fontFamily:
                              '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                            fontWeight: "normal",
                            fontStretch: "normal",
                            color: "#424d54",
                            fontSize: "1rem",
                          }}
                        />
                      </ListItem>
                    )
                  )}
              </List>

              <List sx={{ width: isSmallScreen ? "100%" : undefined }}>
                <ListItem>
                  <ListItemText
                    primary="Roles"
                    disableTypography
                    sx={{
                      fontFamily:
                        '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                      fontWeight: "550",
                      fontStretch: "normal",
                      color: "#15191b",
                      fontSize: isLargeScreen ? "1rem" : "1.3rem",
                    }}
                  />
                </ListItem>
                {project.data?.roles.map(
                  (role: { name: string; requiresCollaborator: boolean }) => (
                    <ListItem
                      key={role.name}
                      sx={{ fontSize: isLargeScreen ? "0.05" : "1.1rem" }}
                    >
                      <ListItemText
                        disableTypography
                        secondary={
                          <>
                            {role.requiresCollaborator ? (
                              <Tooltip title="This role requires a collaborator">
                                <span>{`${role.name} *`}</span>
                              </Tooltip>
                            ) : (
                              role.name
                            )}
                          </>
                        }
                        sx={{
                          fontFamily:
                            '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                          fontWeight: "normal",
                          fontStretch: "normal",
                          color: "#424d54",
                          fontSize: "1rem",
                        }}
                      />
                    </ListItem>
                  )
                )}
              </List>
              <List>
                <ListItem>
                  <ListItemText
                    disableTypography
                    primary="Deliverables"
                    sx={{
                      fontFamily:
                        '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", "sans-serif"',
                      fontWeight: "550",
                      fontStretch: "normal",
                      color: "#15191b",
                      fontSize: isLargeScreen ? "1rem" : "1.3rem",
                    }}
                  />
                </ListItem>
                {project.data?.deliverables.map(
                  (deliverable: string, index: number) => {
                    return (
                      <ListItem
                        key={index}
                        sx={{ fontSize: isLargeScreen ? "0.05" : "1.1rem" }}
                      >
                        <ListItemText
                          disableTypography
                          secondary={deliverable as any}
                          sx={{
                            fontFamily:
                              '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                            fontWeight: "normal",
                            fontStretch: "normal",
                            color: "#424d54",
                            fontSize: "1rem",
                          }}
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
              sx={{ border: "1px solid white" }}
              gap={isLargeScreen ? 2 : 0}
            >
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color: "#15191b",
                  fontSize: isLargeScreen ? "1.8rem" : "2.188rem",
                  lineHeight: "normal",
                  letterSpacing: "0.028125rem",
                  flex: 1,
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
                  fontSize: isLargeScreen ? "0.875" : "1rem",
                  fontStretch: "normal",
                  color: "#424d54",
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
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color: "#15191b",
                  fontSize: isLargeScreen ? "1.8rem" : "2.188rem",
                  lineHeight: "normal",
                  letterSpacing: "0.028125rem",
                  flex: 1,
                  width: isLargeScreen ? "100%" : "50%",
                }}
              >
                Features
              </Typography>
              <List sx={{ fontSize: isLargeScreen ? "0.05" : "1.1rem" }}>
                {project.data?.userStories.map(
                  (feature: string, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        paddingLeft: isSmallScreen ? "0rem" : "2rem",
                        marginTop: "-0.9rem",
                      }}
                    >
                      <ListItemText
                        disableTypography
                        primary={`\u2022 ${feature}`}
                        sx={{
                          fontFamily:
                            '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif"',
                          fontWeight: "normal",
                          color: "#424d54",
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
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color: "#15191b",
                  fontSize: isLargeScreen ? "1.8rem" : "2.188rem",
                  lineHeight: "normal",
                  letterSpacing: "0.028125rem",
                  flex: 1,
                  width: isLargeScreen ? "100%" : "50%",
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
                      fontSize: isLargeScreen ? "0.05" : "1.1rem",
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
