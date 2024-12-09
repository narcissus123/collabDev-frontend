import CloseIcon from "@mui/icons-material/Close";
import { CardContent, CardHeader, IconButton, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
  title?: string;
  modalsx?: any;
  framesx?: any;
  headersx?: any;
  cardsx?: any;
  headerAvatar?: any;
}

export default function CustomModal({
  open,
  handleClose,
  children,
  title = "",
  modalsx = {},
  framesx = {},
  headersx = {},
  cardsx = {},
  headerAvatar = null,
}: Props) {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 0,
        ...modalsx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "none",
          boxShadow: 24,
          p: 0,
          ...framesx,
        }}
      >
        <Card
          sx={{
            p: 0,
            bgColor:
              theme.palette.mode === "dark"
                ? "neutral.main"
                : "background.default",

            ...cardsx,
          }}
        >
          <CardHeader
            sx={{
              borderBottom: "none",
              color:
                theme.palette.mode === "dark"
                  ? "secondary.main"
                  : "border.secondary",
              fontWeight: 600,
              fontSize: "1rem",
              zIndex: 1,
              backgroundColor: "background.paper",
              ...headersx,
            }}
            avatar={headerAvatar}
            action={
              <IconButton aria-label="close" onClick={() => handleClose()}>
                <CloseIcon />
              </IconButton>
            }
            title={title}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              flex: 1,
            }}
          >
            {children}
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
}
