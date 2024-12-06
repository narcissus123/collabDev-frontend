import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { userProfileMenuItems } from "../../../configs/data/HeaderData";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useMode } from "../../../context/MUIThemeContext/MUIThemeContext";

const navLinkItems = [
  { title: "Projects", url: "/projects" },
  { title: "About Us", url: "/about-us" },
];

export default function Header() {
  const { isAuthenticated, user: userInfo } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { toggleColorMode } = useMode();

  // Search state
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleExpand = () => {
    setIsFocused(!isFocused);
    inputRef.current?.focus();
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  // menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuItems = userProfileMenuItems(userInfo);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [location]);

  return (
    <AppBar
      component="header"
      sx={{
        position: "fixed",
        background: theme.palette.mode === "dark" ? "" : "white",
        opacity: "95%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
        px: isMediumScreen ? 2 : 5,
      }}
    >
      <Avatar
        sx={{
          m: { sm: 1, md: 1 },
          bgcolor: "secondary.main",
          width: theme.palette.mode === "dark" ? "40px" : "47px",
          height: theme.palette.mode === "dark" ? "47px" : "47px",
          cursor: "pointer",
        }}
        variant="square"
        alt="CollabDev"
        onClick={() => navigate("/")}
      >
        <img
          src={
            theme.palette.mode === "dark"
              ? `/assets/logo/logo-dark.webp`
              : `/assets/logo/logo-light.webp`
          }
          alt="CollabDev"
          width={theme.palette.mode === "dark" ? "140" : "125"}
          height={theme.palette.mode === "dark" ? "38" : "35"}
        />
      </Avatar>
      <Toolbar
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: isMediumScreen ? 1 : 2,
          alignItems: "center",
          p: 1,
        }}
        disableGutters={isMediumScreen ? true : false}
      >
        {navLinkItems.map((section) => (
          <Link
            key={section.title}
            to={section.url}
            style={{
              color: theme.palette.mode === "dark" ? "white" : "#000000",
              fontWeight: "600",
              textDecoration: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: isMediumScreen ? "0.8rem" : "1rem",
              width: "auto",
            }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
      {!isMediumScreen && (
        // Search button
        <TextField
          placeholder="Find Collaborator (Coming Soon)"
          variant="outlined"
          size="small"
          style={{
            color: theme.palette.mode === "dark" ? "white" : "grey",
            flex: 1,
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                onClick={handleExpand}
                style={{
                  cursor: "pointer",
                  color: "inherit",
                  marginRight: 4,
                }}
              />
            ),
            style: {
              color: "inherit",
              paddingLeft: "0.5rem",
              backgroundColor: alpha("#FFFFFF", 0.15),
              borderRadius: "20px",
              height: "2.3rem",
              transition: "width 0.5s",
              width: isFocused ? "15.5rem" : "2.3rem",
            },
          }}
          onBlur={handleBlur}
          inputRef={inputRef}
        />
      )}
      {/* dark/light mode button */}
      <IconButton
        sx={{
          ml: isMediumScreen ? 4 : 1,
          color: "black",
          flex: isMediumScreen ? 1 : 0,
        }}
        onClick={toggleColorMode}
        aria-label={
          theme.palette.mode === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon sx={{ color: "white", fontSize: 30 }} />
        ) : (
          <Brightness4Icon color="primary" sx={{ fontSize: 30 }} />
        )}
      </IconButton>
      {isAuthenticated ? (
        <>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: isMediumScreen ? 0 : 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: isMediumScreen ? "2.1rem" : "2.3rem",
                height: isMediumScreen ? "2.1rem" : "2.3rem",
                color: "white",
              }}
              src={`https://collabdev-resume-storage-2024.s3.us-east-2.amazonaws.com/${userInfo?.avatar}`}
            >
              {userInfo?.name[0]}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.paper, 0.9)
                    : alpha(theme.palette.background.paper, 0.95),
                backdropFilter: "blur(8px)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.1)
                    : alpha(theme.palette.common.black, 0.1)
                }`,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.9)
                      : alpha(theme.palette.background.paper, 0.95),
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                  borderLeft: `1px solid ${
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.1)
                  }`,
                  borderTop: `1px solid ${
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.1)
                  }`,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {menuItems.map((item, index) => (
              <Box key={index}>
                <Link
                  to={item.to}
                  style={{
                    color:
                      theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
                    textDecoration: "none",
                    width: "100%",
                  }}
                  onClick={handleClose}
                >
                  <MenuItem
                    onClick={handleClose}
                    sx={{
                      py: isMediumScreen ? "0.2rem" : "0.25rem",
                      width: "100%",
                    }}
                  >
                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                    <Typography
                      sx={{
                        mt: 0.5,
                        ml: -1,
                        fontSize: isMediumScreen ? "0.75rem" : "0.9rem",
                        width: "100%",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </MenuItem>
                </Link>

                {item.divider && (
                  <Divider
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
                    }}
                  />
                )}
              </Box>
            ))}
          </Menu>
        </>
      ) : (
        <Button
          variant="outlined"
          size="small"
          sx={{ fontSize: "0.7rem", fontWeight: "600", ml: 0.9 }}
          onClick={() => navigate("/login")}
        >
          Sign up / Sign in
        </Button>
      )}
    </AppBar>
  );
}
