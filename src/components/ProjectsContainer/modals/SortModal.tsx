import SwapVertIcon from "@mui/icons-material/SwapVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SortModal() {
  const { handleSubmit } = useForm();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = () => {};

  return (
    <Box sx={{ display: "none", visibility: "hidden" }}>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<SwapVertIcon />}
      >
        Sort
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth></FormControl>
          <FormControl fullWidth></FormControl>
        </Box>
      </Menu>
    </Box>
  );
}
