import { AccountCircle } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { useMediaQuery, useTheme } from "@mui/material";

export const userProfileMenuItems = (userInfo: any) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  return [
    {
      text: " My Profile",
      divider: true,
      icon: <AccountCircle fontSize={isMediumScreen ? "small" : "medium"} />,
      to: `/profile/${userInfo?._id}`,
    },
    {
      text: " Settings",
      divider: false,
      icon: <Settings fontSize={isMediumScreen ? "small" : "medium"} />,
      to: "#",
    },
    {
      text: " Logout",
      divider: false,
      icon: <Logout fontSize={isMediumScreen ? "small" : "medium"} />,
      to: "/logout",
    },
  ];
};
