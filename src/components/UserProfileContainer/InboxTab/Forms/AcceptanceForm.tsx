/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { Request } from "../../../../configs/types/requestTypes";
import { acceptRequestById } from "../../../../core/services/api/manage-requests.api";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";

interface AcceptanceFormProps {
  openAcceptModal: boolean;
  handleClose: () => void;
  req: Request;
}

export default function AcceptanceForm({
  openAcceptModal,
  handleClose,
  req,
}: AcceptanceFormProps) {
  const theme = useTheme();

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      const response = (await acceptRequestById(req._id, {
        ...req,
        status: "accepted",
      })) as any;

      if (response.status === 200) {
        toast.success("Request accepted successfully!");
      } else if (response.status === 400 || response.status === 403) {
        toast.error("You are not signed in! Please sign in.");
      } else {
        if (response.status === 404 || response.status === 403) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
    }
  };

  return (
    <CustomModal
      open={openAcceptModal}
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
      title="Accept Request"
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <Typography>
          Are you sure that you want to accept{" "}
          {req.messageType === "invitation_request"
            ? req.owner.name
            : req.contributor.name}
          &apos;s request
        </Typography>
        <CustomButton
          leftButtonsx={{
            borderTop: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "green" : "green",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          righButtonText="Confirm"
        />
      </Box>
    </CustomModal>
  );
}
