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
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { red } from "@mui/material/colors";
import * as React from "react";
import { useEffect, useState } from "react";

import JoinIcon from "../../../../assets/icons/join.png";
import JoinIconDark from "../../../../assets/icons/TeamDark.png";
import { User } from "../../../../configs/types/userTypes";
import { getUserById } from "../../../../core/services/api/manage-user.api";
import formatDate from "../../../../core/utils/DateFormatter/formatDate";

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

const ProjectCard = ({ project }: any) => {
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  const [developer, setDeveloper] = useState<User | undefined>();

  const getDeveloper = async () => {
    try {
      if (project.owner !== undefined) {
        const response = await getUserById(project.owner._id);

        if (response) {
          React.startTransition(() => {
            setDeveloper(response);
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getDeveloper();
  }, [project.owner]);

  return (
    <Grid item xs={12} md={5.8} lg={3.8} sx={{ Width: "100.33px" }}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500], width: 56, height: 56 }}
              aria-label="recipe"
              src={`http://localhost:8080/public/userProfileImages/${developer?.avatar}`}
            ></Avatar>
          }
          action={
            <div>
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
                <MenuItem onClick={handleClose}>
                  <Link
                    sx={{ textDecoration: "none" }}
                    href={project.links[0]}
                    target="_blank"
                  >
                    View on GitHub
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    sx={{ textDecoration: "none" }}
                    href={project.links[0]}
                    target="_blank"
                    rel="noopener"
                  >
                    Project details
                  </Link>
                </MenuItem>
              </Menu>
            </div>
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

        <CardContent sx={{ height: 131.29 }}>
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

            <Stack display="flex" flexDirection="row" sx={{ flexWrap: "wrap" }}>
              <Typography variant="body1" color="text.secondary">
                Tech Stack:
              </Typography>
              {project.techStack.map((data: any, i: number) => (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    pl: 0.5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    fontSize: { lg: "1.1rem" },
                  }}
                  key={i}
                >
                  {i > 0 && <Typography variant="body1">,</Typography>}
                  {data.value}
                </Typography>
              ))}
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap={2}
            >
              <Typography variant="body1" color="text.secondary">
                Contributors:
              </Typography>
              <AvatarGroup
                max={5}
                sx={{
                  width: "auto",
                }}
              >
                {project?.contributors.map(
                  (
                    contributor: { name: string; avatar: string },
                    i: string
                  ) => (
                    <React.Fragment key={i}>
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
                    </React.Fragment>
                  )
                )}
              </AvatarGroup>
              <Chip
                size="small"
                label={project.status}
                color={getStatusColor(project.status)}
                sx={{
                  width: "fit-content",
                  opacity: "0.8",
                  my: { xs: "0.3rem" },
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="Collaboration Request">
            <img
              src={theme.palette.mode === "dark" ? JoinIconDark : JoinIcon}
              alt="join project icon"
              style={{
                width: "27px",
                height: "27px",
                marginRight: "0.7rem",
                borderColor: theme.palette.mode === "dark" ? "white" : "black",
              }}
            />
          </IconButton>
          <IconButton aria-label="add to favorites">
            <ThumbUpOutlinedIcon />
            <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
              {project.likes}
            </Typography>
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProjectCard;
