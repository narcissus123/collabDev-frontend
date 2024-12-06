import {
  Box,
  Divider,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { ReactNode, MouseEvent, cloneElement } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
interface MenuProps {
  anchorElement: JSX.Element;
  anchorEl: null | HTMLElement;
  menuItems: MenuItem[];
  onToggleOpen: (event: MouseEvent<HTMLElement>) => void;
  onToggleClose: () => void;
}

interface MenuItem {
  text: string;
  icon?: ReactNode;
  divider: boolean;
  to: string;
}

const CustomMenu = ({
  anchorElement,
  anchorEl,
  menuItems,
  onToggleOpen,
  onToggleClose,
}: MenuProps) => {
  return (
    <>
      {cloneElement(anchorElement, { onClick: onToggleOpen })}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={onToggleClose}
        onClick={onToggleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ border: "1px solid red" }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
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
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {menuItems.map((item, index) => {
          return (
            <Box key={index}>
              <MenuItem onClick={onToggleClose}>
                <Link component={ReactRouterLink} to={item.to} rel="noopener">
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  {item.text}
                </Link>
              </MenuItem>
              {item.divider && <Divider />}
            </Box>
          );
        })}
      </Menu>
    </>
  );
};

export default CustomMenu;
