import { Avatar, Box, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

interface ClickableAvatarProps {
  userId: string;
  avatarUrl?: string;
  userName?: string;
  size?: number;
}

const ClickableAvatar = ({
  userId,
  avatarUrl,
  userName,
  size = 56,
}: ClickableAvatarProps) => {
  return (
    <Tooltip title="View profile" placement="top">
      <Link to={`/profile/${userId}`}>
        <Box
          sx={{
            position: "relative",
            cursor: "pointer",
            borderRadius: "50%",
            "&:hover .MuiAvatar-root": {
              transform: "scale(1.05)",
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
            },
            "&:hover .hover-overlay": {
              opacity: 0.1,
            },
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{
              width: size,
              height: size,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {!avatarUrl && userName?.[0]}
          </Avatar>
          <Box
            className="hover-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "primary.main",
              opacity: 0,
              transition: "opacity 0.2s",
            }}
          />
        </Box>
      </Link>
    </Tooltip>
  );
};

export default ClickableAvatar;
