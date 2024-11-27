import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface PtClassName {
  deleteColor?: React.CSSProperties;
}

export default function ResponsiveDialog({
  openDeleteModal,
  setOpenDeleteModal,
  message,
  title,
  handleDelete,
  handleCancel,
  rightButtonColor,
  ptClassName,
}: {
  openDeleteModal: boolean;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  title: string;
  handleCancel?: () => void;
  handleDelete: () => void;
  ptClassName?: PtClassName;
  rightButtonColor?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpenDeleteModal(true);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              handleCancel ? handleCancel() : setOpenDeleteModal(false)
            }
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color={rightButtonColor}
            sx={{ ...ptClassName?.deleteColor }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
