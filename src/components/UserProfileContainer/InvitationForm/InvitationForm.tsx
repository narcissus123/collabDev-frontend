import {
  Avatar,
  Box,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";

import { RequestInputData } from "../../../configs/data/RequestFormData";
import { ProjectType } from "../../../configs/types/projectTypes";
import { RequestFormType } from "../../../configs/types/requestTypes";
import { getProjectByownerId } from "../../../core/services/api/manage-projects.api";
import { createRequest } from "../../../core/services/api/manage-requests.api";
import { getItem } from "../../../core/services/storage/Storage";
import useFetch from "../../../hooks/useFetch";
import CustomButton from "../../common/CustomButton/CustomButton";
import CustomModal from "../../common/CustomModal/CustomModal";
import Input from "../../common/Input/Input";

interface RequestFormProps {
  openInviteModal: boolean;
  handleClose: () => void;
}

const InvitationForm = ({ openInviteModal, handleClose }: RequestFormProps) => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const user = JSON.parse(getItem("user"));
  const { userId } = useParams();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RequestFormType>({
    defaultValues: {},
  });

  const { isLoading, data: projects } = useFetch<ProjectType[]>(
    getProjectByownerId,
    userId
  );

  const onSubmit = async (data: any) => {
    try {
      if (projects) {
        const request = {
          ...data,
          status: "pending",
          messageType: "invitation_request",
          owner: {
            _id: projects[0].owner._id,
            name: projects[0].owner.name,
            avatar: projects[0].owner.avatar,
          },
          contributor: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
          },
        };

        const response = (await createRequest(request)) as any;

        if (response.status === 201) {
          toast.success("Request sent successfully!");
        } else {
          if (response.status === 400 || response.status === 403) {
            toast.error("You are not signed in! Please sign in.");
          }
        }
      }
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };
  return (
    <CustomModal
      open={openInviteModal}
      handleClose={() => handleClose()}
      framesx={{
        width: 600,
        borderRadius: "2rem",
        p: 0,
      }}
      headersx={{
        borderBottom: "",
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
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
            sx={{
              mr: 1,
              color: "primary.main",
              fontSize: "1.1rem",
            }}
          >
            To:
          </Typography>
          <Avatar
            sx={{ bgcolor: red[500], width: 39, height: 39 }}
            aria-label="project owner"
            src={`http://localhost:8080/public/userProfileImages/${user.avatar}`}
          />
          <Typography
            sx={{
              color: "primary.main",
              fontSize: "1.1rem",
              ml: 1,
            }}
          >
            {user.name}
          </Typography>
        </Stack>
      }
      title=""
    >
      <Divider sx={{ mt: "-1rem", backgroundColor: "primary.main" }} />
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <InputLabel id="project-select-label">Select Project</InputLabel>
          <Controller
            name="project"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                {...field}
                value={field.value || ""}
                error={fieldState.invalid}
                sx={{ width: "12rem", my: 1, color: "text.secondary" }}
                size="small"
              >
                {!isLoading &&
                  projects &&
                  projects.map((project: ProjectType) => (
                    <MenuItem
                      key={project._id}
                      value={project._id}
                      sx={{ color: "text.secondary" }}
                    >
                      {project.title}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
        </Stack>
        {RequestInputData?.map((data, index) => (
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
          righButtonText="Send"
          righButtonDisabled={isLoading}
        />
      </Box>
    </CustomModal>
  );
};

export default InvitationForm;
