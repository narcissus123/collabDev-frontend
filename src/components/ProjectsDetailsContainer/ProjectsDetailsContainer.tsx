import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";

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
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={`http://localhost:8080/public/userProfileImages/${project.data.coverImage[0]}?w=600&h=400&fit=crop&auto=format`}
              srcSet={`http://localhost:8080/public/userProfileImages/${project.data.coverImage[0]}?w=600&h=400&fit=crop&auto=format&dpr=2 2x`}
              alt="project cover"
              loading="lazy"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "25rem",
                objectFit: "inherit",
                borderBottom: "1px solid ",
                borderColor: "text.secondary",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${process.env.PUBLIC_URL}/assets/images/ProjectCoverImagePlaceholder.webp`;
                e.currentTarget.srcset = `${`${process.env.PUBLIC_URL}/assets/images/ProjectCoverImagePlaceholder.webp`} 2x`;
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                left: 3,
                bottom: 10,
                backgroundColor: "#fff",
                zIndex: 30,
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
                sx={{ position: "absolute", top: "0", right: "0" }}
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
                  width: isLargeScreen ? "100%" : "50%",
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
                  width: isLargeScreen ? "100%" : "50%",
                }}
              >
                {project.data?.description}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent={isSmallScreen ? "flex-start" : "space-between"}
              spacing={2}
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
                  fontSize: isLargeScreen ? "2.188rem" : "2.5rem",
                  lineHeight: "normal",
                  letterSpacing: "0.028125rem",
                  flex: 1,
                  width: isLargeScreen ? "100%" : "50%",
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
                  width: isLargeScreen ? "100%" : "50%",
                }}
              >
                {project.data?.solution}
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color: "#15191b",
                  fontSize: isLargeScreen ? "2.188rem" : "2.5rem",
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
            <Stack>
              <Typography
                sx={{
                  fontFamily:
                    '"Helvetica Neue", Helvetica, "Segoe UI", Segoe, "Segoe WP", Arial, "Lucida Grande", sans-serif',
                  fontWeight: 500,
                  fontStretch: "normal",
                  color: "#15191b",
                  fontSize: isLargeScreen ? "2.188rem" : "2.5rem",
                  lineHeight: "normal",
                  letterSpacing: "0.028125rem",
                  flex: 1,
                  width: isLargeScreen ? "100%" : "50%",
                  mb: "2rem",
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
