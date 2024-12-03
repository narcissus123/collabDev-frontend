import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";

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
  link,
  hideButton = false,
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
  link?: string;
  hideButton?: boolean;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
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
          {!hideButton && (
            <>
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
            </>
          )}
          {link && (
            <Link
              to={link}
              style={{
                textDecoration: "none",
                marginLeft: "-0.5rem",
              }}
            >
              <Button endIcon={<LaunchIcon />} disabled>
                Go to Settings
              </Button>
            </Link>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
