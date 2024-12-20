import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import {
  Avatar,
  AvatarGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Box,
  Tooltip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenInNew } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProjectType } from "../../../configs/types/projectTypes";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import formatDate from "../../../core/utils/DateFormatter/formatDate";
import RequestModal from "../RequestForm/RequestForm";
import { deleteProjectById } from "../../../core/services/api/manage-projects.api";
import ResponsiveDialog from "../CustomModal/ConfirmationModal";
import { getImageUrl } from "../../../core/utils/ImageUtils/imageUtils";
import ClickableAvatar from "./ClickableAvatar";

interface PtClassName {
  cardMargin?: number;
  cardHeight?: string;
}

interface ProjectCardProps {
  project: ProjectType;
  ptClassName: PtClassName;
}

function getStatusColor(status: string) {
  switch (status) {
    case "In Progress":
      return "warning";
    case "Completed":
      return "success";
    case "Seeking Collaborators":
      return "primary";
    default:
      return "default";
  }
}

function ProjectCard({ project, ptClassName }: ProjectCardProps) {
  const ITEM_HEIGHT = 48;
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const { isAuthenticated, isProfileOwner, isProjectOwner } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProjectById(projectId),
    onSuccess: () => {
      toast.success("Project deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["getAllProjects"],
      });

      setOpenDeleteModal(false);
    },
    onError: (err) => {
      toast.error("Failed to delete project.");
      console.error("Error:", err);
    },
  });

  const handleDelete = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      item
      xs={12}
      md={5.8}
      lg={3.8}
      sx={{ mb: ptClassName?.cardMargin ? ptClassName?.cardMargin : 0 }}
    >
      <Card
        sx={{
          height: ptClassName?.cardHeight ? ptClassName?.cardHeight : "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0rem",
        }}
      >
        {/* Avatar & Title */}
        <CardHeader
          sx={{
            px: 2,
            pt: 2,
            pb: 1.5,
            "& .MuiCardHeader-content": {
              overflow: "hidden",
            },
          }}
          avatar={
            <ClickableAvatar
              userId={project.owner._id}
              avatarUrl={getImageUrl(project.owner.avatar)}
              userName={project.owner.name}
              size={56}
            />
          }
          action={
            <Box>
              {isProjectOwner(project.owner._id) && (
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    handleClose();
                    setOpenDeleteModal(true);
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
              {openDeleteModal && (
                <ResponsiveDialog
                  openDeleteModal={openDeleteModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                  title="Confirm Project Deletion"
                  message={
                    project.contributors && project.contributors.length === 0
                      ? "Are you sure you want to delete this project? This action is permanent and cannot be undone."
                      : "This project has active contributors. Please assign a new owner in project settings before deleting."
                  }
                  handleDelete={() => handleDelete(project._id)}
                  rightButtonColor="error"
                  link={
                    project.contributors && project.contributors.length > 0
                      ? "#"
                      : undefined
                  }
                  hideButton={
                    project.contributors && project.contributors.length > 0
                      ? true
                      : false
                  }
                />
              )}
            </Box>
          }
          title={
            <Link
              style={{ textDecoration: "none" }}
              to={`/projects/${project._id}`}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: "600",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.title}
                <OpenInNew sx={{ fontSize: "1rem" }} />
              </Typography>
            </Link>
          }
          subheader={
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {formatDate(project.startDate)}
            </Typography>
          }
        />

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            py: 0,
            px: 2,
          }}
        >
          {/* Description */}
          <Box sx={{ height: "48px" }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "24px",
              }}
            >
              {project.description}
            </Typography>
          </Box>

          {/* Tech Stack */}
          <Box sx={{ height: "48px", overflow: "hidden" }}>
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              <Typography variant="body1" color="text.secondary">
                Tech Stack:
              </Typography>
              {project.techStack.map((data, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  color="text.secondary"
                  component="span"
                >
                  {i > 0 ? `, ${data.value}` : data.value}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Contributors */}
          <Box sx={{ height: "40px" }}>
            <Stack direction="row" alignItems="center" gap={2}>
              {project?.contributors?.length > 0 && (
                <>
                  <Typography variant="body1" color="text.secondary">
                    Contributors:
                  </Typography>
                  <AvatarGroup
                    max={5}
                    sx={{
                      "& .MuiAvatar-root": { width: 36, height: 36 },
                    }}
                  >
                    {project?.contributors.map((contributor, i) => (
                      <Avatar
                        key={i}
                        sx={{ bgcolor: grey[500] }}
                        src={
                          contributor.avatar
                            ? getImageUrl(contributor.avatar)
                            : undefined
                        }
                      >
                        {!contributor.avatar && contributor.name[0]}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </>
              )}
            </Stack>
          </Box>

          {/* Tags */}
          <Box sx={{ height: "32px", pt: 1 }}>
            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
              <Chip
                size="small"
                label={project.status}
                color={getStatusColor(project.status)}
                sx={{
                  opacity: "0.8",
                  fontSize: "0.7rem",
                }}
              />
              <Chip
                size="small"
                label={project.category}
                sx={{
                  opacity: "0.8",
                  border: "2px solid",
                  borderColor: "secondary.main",
                  color: "secondary.main",
                  fontSize: "0.7rem",
                }}
              />
            </Stack>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ px: 2, pt: 0.5 }}>
          {isAuthenticated && !isProfileOwner(project.owner._id) && (
            <Tooltip title="Collaboration request" placement="right">
              <IconButton
                aria-label="Collaboration Request"
                sx={{
                  "&:hover": { bgcolor: "transparent" },
                }}
                onClick={() => setOpenRequestModal((prev) => !prev)}
              >
                <img
                  src={
                    theme.palette.mode === "dark"
                      ? getImageUrl("common/TeamDark.webp")
                      : getImageUrl("common/join.webp")
                  }
                  alt="join project icon"
                  style={{ width: "32px", height: "32px" }}
                />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            aria-label="add to favorites"
            sx={{
              display: "none",
              visibility: "hidden",
              alignItems: "center",
              "&:hover": { bgcolor: "transparent" },
            }}
            disabled
          >
            <ThumbUpOutlinedIcon />
            <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
              {project.likes}
            </Typography>
          </IconButton>
        </CardActions>

        {openRequestModal && !isProfileOwner(project.owner._id) && (
          <RequestModal
            project={project}
            openRequestModal={openRequestModal}
            handleClose={() => setOpenRequestModal((prev) => !prev)}
          />
        )}
      </Card>
    </Grid>
  );
}

export default ProjectCard;
