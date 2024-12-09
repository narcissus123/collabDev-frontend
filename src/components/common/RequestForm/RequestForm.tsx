import {
  Avatar,
  Box,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { RequestInputData } from "../../../configs/data/RequestFormData";
import { ProjectType } from "../../../configs/types/projectTypes";
import { RequestFormType } from "../../../configs/types/requestTypes";
import { createRequest } from "../../../core/services/api/manage-requests.api";
import { getItem } from "../../../core/services/storage/Storage";
import CustomButton from "../CustomButton/CustomButton";
import CustomModal from "../CustomModal/CustomModal";
import Input from "../Input/Input";

interface RequestFormProps {
  project: ProjectType;
  openRequestModal: boolean;
  handleClose: () => void;
}

const RequestForm = ({
  openRequestModal,
  handleClose,
  project,
}: RequestFormProps) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const user = JSON.parse(getItem("user"));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestFormType>({
    defaultValues: {},
  });

  const onSubmit = async (data: any) => {
    try {
      const requestInfo = {
        ...data,
        project: project._id,
        status: "pending",
        messageType: "collaboration_request",
        owner: {
          _id: project.owner._id,
          name: project.owner.name,
          avatar: project.owner.avatar,
        },
        contributor: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        },
      };

      const response = (await createRequest(requestInfo)) as any;

      if (response.status === 201) {
        toast.success("Request sent successfully!");
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("You are not signed in! Please sign in.");
        }
      }
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };
  return (
    <>
      {" "}
      <ToastContainer />
      <CustomModal
        open={openRequestModal}
        handleClose={() => handleClose()}
        framesx={{
          width: 600,
          borderRadius: "2rem",
          p: 0,
        }}
        headersx={{
          borderBottom: "",
          borderColor:
            theme.palette.mode === "dark"
              ? "secondary.main"
              : "border.secondary",
        }}
        cardsx={{
          borderRadius: "2rem",
        }}
        headerAvatar={
          <Stack
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={1}
            mt={1}
            ml={1}
          >
            <Typography
              variant="h5"
              sx={{ color: "primary.main", mr: 1, fontSize: "1.1rem" }}
            >
              To:
            </Typography>
            <Avatar
              sx={{ bgcolor: red[500], width: 39, height: 39 }}
              aria-label="project owner"
              src={`http://localhost:8080/public/userProfileImages/${project.owner.avatar}`}
            />
            <Typography
              sx={{ color: "primary.main", fontSize: "1.1rem", ml: 1 }}
            >
              {project.owner.name}
            </Typography>
          </Stack>
        }
        title=""
      >
        <Divider sx={{ mt: "-1rem", backgroundColor: "primary.main" }} />
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          {RequestInputData.map((data, index) => (
            <Input
              key={index}
              id={data.id}
              ty={data.type}
              placeholder={data.placeholder}
              labelText={data.labelText}
              sx={data.sx}
              minRows={8}
              margin={data.margin as "normal" | "dense"}
              inputSize={isMediumScreen ? "small" : "medium"}
              required={data.required}
              fullWidth={data.fullWidth}
              multiline={data.multiline}
              variant={data.variant as "standard" | "outlined" | "filled"}
              errors={errors}
              {...(register &&
                register("message", {
                  ...data.register.schema,
                }))}
            />
          ))}

          <CustomButton
            framesx={{
              bgcolor: "#F7F7F7",
              borderEndStartRadius: "1.5rem",
              borderEndEndRadius: "1.5rem",
              my: "-1rem",
            }}
            buttonRightsx={{
              my: 2,
              mx: 2,
            }}
            leftButtonsx={{
              borderTop: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "secondary.main"
                  : "border.secondary",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            righButtonText="Send"
          />
        </Box>
      </CustomModal>
    </>
  );
};

export default RequestForm;
