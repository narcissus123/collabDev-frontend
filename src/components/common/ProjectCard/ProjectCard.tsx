import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useState } from "react";
import { Link } from "react-router-dom";

import { ProjectType } from "../../../configs/types/projectTypes";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { getItem } from "../../../core/services/storage/Storage";
import formatDate from "../../../core/utils/DateFormatter/formatDate";
import RequestModal from "../RequestForm/RequestForm";

interface ProjectCardProps {
  project: ProjectType;
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

function ProjectCard({ project }: ProjectCardProps) {
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  const [openRequestModal, setOpenRequestModal] = useState(false);

  const user = useAuth();
  const developer = user.isUser ? JSON.parse(getItem("user")) : undefined;
  // console.log("hi from card");
  return (
    <Grid item xs={12} md={5.8} lg={3.8} sx={{ Width: "100.33px" }}>
      <Card>
        <CardHeader
          avatar={
            <Link to={`/profile/${project.owner._id}`}>
              <Avatar
                sx={{ bgcolor: red[500], width: 56, height: 56 }}
                aria-label="recipe"
                src={`http://localhost:8080/public/userProfileImages/${project.owner.avatar}`}
              />
            </Link>
          }
          action={
            <Box>
              <IconButton
                aria-label="links"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Link style={{ textDecoration: "none" }} to={project.links[0]}>
                  <MenuItem
                    onClick={handleClose}
                    sx={{ color: "text.secondary" }}
                  >
                    View on GitHub
                  </MenuItem>
                </Link>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/projects/${project._id}`}
                >
                  <MenuItem
                    onClick={handleClose}
                    sx={{ color: "text.secondary" }}
                  >
                    Project details
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
          }
          title={
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ fontWeight: "600" }}
            >
              {" "}
              {project.title}
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              {" "}
              {formatDate(project.startDate)}
            </Typography>
          }
          sx={{ pb: 0, height: "82.66px" }}
        />

        <CardContent sx={{ height: 171.29 }}>
          <Stack display="flex" flexDirection="column" gap={0.5}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {project.description}
            </Typography>

            <Stack
              display="flex"
              flexDirection="row"
              sx={{ flexWrap: "wrap", mt: 1 }}
            >
              <Typography variant="body1" color="text.secondary">
                Tech Stack:
              </Typography>
              {project.techStack.map((data, i) => (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    pl: 0.5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  key={i}
                >
                  {i > 0 && (
                    <Typography variant="body1" component="span">
                      ,
                    </Typography>
                  )}
                  {data.value}
                </Typography>
              ))}
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap={2}
              sx={{ height: "2.5rem" }}
            >
              {project?.contributors?.length !== 0 && (
                <>
                  <Typography variant="body1" color="text.secondary">
                    Contributors:
                  </Typography>
                  <AvatarGroup
                    max={5}
                    sx={{
                      width: "auto",
                    }}
                  >
                    {project?.contributors.map((contributor, i) => (
                      <Box key={i}>
                        {contributor.avatar === "" ? (
                          <Avatar
                            sx={{ bgcolor: red[500], width: 36, height: 36 }}
                            aria-label="recipe"
                          >
                            {contributor.name[0]}
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{ bgcolor: red[500], width: 36, height: 36 }}
                            aria-label="recipe"
                            src={`http://localhost:8080/public/userProfileImages/${contributor?.avatar}`}
                          ></Avatar>
                        )}
                      </Box>
                    ))}
                  </AvatarGroup>
                </>
              )}
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              flexWrap="wrap"
              gap={2}
              sx={{ py: 1 }}
            >
              <Chip
                size="small"
                label={project.status}
                color={getStatusColor(project.status)}
                sx={{
                  width: "fit-content",
                  opacity: "0.8",
                  my: { xs: "0.3rem" },
                  fontSize: "0.7rem",
                }}
              />
              <Chip
                size="small"
                label={project.category}
                sx={{
                  width: "fit-content",
                  opacity: "0.8",
                  my: { xs: "0.3rem" },
                  border: "2px solid",
                  borderColor: "secondary.main",
                  color: "secondary.main",
                  fontSize: "0.7rem",
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
        <CardActions disableSpacing>
          {user.isUser && developer._id !== project.owner._id && (
            <IconButton
              aria-label="Collaboration Request"
              onClick={() => {
                setOpenRequestModal((prev) => !prev);
              }}
            >
              <img
                src={
                  theme.palette.mode === "dark"
                    ? `${process.env.PUBLIC_URL}/assets/icons/TeamDark.webp`
                    : `${process.env.PUBLIC_URL}/assets/icons/join.webp`
                }
                alt="join project icon"
                style={{
                  width: "32px",
                  height: "32px",
                  marginRight: "0.7rem",
                  borderColor:
                    theme.palette.mode === "dark" ? "white" : "black",
                }}
              />
            </IconButton>
          )}
          <IconButton aria-label="add to favorites">
            <ThumbUpOutlinedIcon />
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ ml: 1, mt: 1 }}
            >
              {project.likes}
            </Typography>
          </IconButton>
        </CardActions>
        {openRequestModal && developer._id !== project.owner._id && (
          <RequestModal
            project={project}
            openRequestModal={openRequestModal}
            handleClose={() => {
              setOpenRequestModal((prev) => !prev);
            }}
          />
        )}
      </Card>
    </Grid>
  );
}

export default ProjectCard;
