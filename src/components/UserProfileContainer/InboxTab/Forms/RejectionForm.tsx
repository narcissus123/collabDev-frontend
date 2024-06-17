/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { Request } from "../../../../configs/types/requestTypes";
import { rejectRequestById } from "../../../../core/services/api/manage-requests.api";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";

interface RejectionFormProps {
  openRejectModal: boolean;
  handleClose: () => void;
  req: Request;
}

export default function RejectionForm({
  openRejectModal,
  handleClose,
  req,
}: RejectionFormProps) {
  const theme = useTheme();

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      const response = (await rejectRequestById(req._id)) as any;

      if (response) {
        toast.success("Request rejected successfully!");
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("You are not signed in! Please sign in.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
    }
  };

  return (
    <CustomModal
      open={openRejectModal}
      handleClose={handleClose}
      framesx={{
        width: 600,
        border: "2px solid #000",
      }}
      headersx={{
        borderBottom: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
      }}
      title="Reject Request"
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <Typography>
          Are you sure that you want to reject{" "}
          {req.messageType === "invitation_request"
            ? req.owner.name
            : req.contributor.name}
          &apos;s request
        </Typography>
        <CustomButton
          leftButtonsx={{
            borderTop: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "red" : "red",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          righButtonText="Confirm"
        />
      </Box>
    </CustomModal>
  );
}
