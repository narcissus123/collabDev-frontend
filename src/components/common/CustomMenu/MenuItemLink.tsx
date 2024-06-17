import { ListItemIcon, MenuItem } from "@mui/material";
import React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

interface MenuItemLinkProps extends RouterLinkProps {
  to: string;
  onClick: () => void;
  primaryText: string;
  icon?: React.ReactNode;
}

const MenuItemLink: React.FC<MenuItemLinkProps> = ({
  to,
  onClick,
  primaryText,
  icon,
  ...props
}) => {
  return (
    <MenuItem onClick={onClick} component={RouterLink} to={to} {...props}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      {primaryText}
    </MenuItem>
  );
};

export default MenuItemLink;
