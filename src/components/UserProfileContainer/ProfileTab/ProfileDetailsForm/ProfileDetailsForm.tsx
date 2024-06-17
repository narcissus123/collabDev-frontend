import ClearIcon from "@mui/icons-material/Clear";
import {
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MuiChipsInput } from "mui-chips-input";
import { useFieldArray, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { ProfileDetailsInputData } from "../../../../configs/data/UserProfileInputData";
import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Input from "../../../common/Input/Input";
import { InputStyles } from "../../../common/InputStyles/InputStyles";

interface ProfileDetailsFormProps {
  openProfileDetailsModal: boolean;
  handleClose: () => void;
  profileTabInfo: User;
  handleProfileInfo: (userInfo: User) => void;
}

interface FormValues {
  about: string;
  socialMedia: { platform: string; url: string }[];
  skills: string[];
  languages: string[];
}

export default function ProfileDetailsForm({
  openProfileDetailsModal,
  handleClose,
  profileTabInfo,
  handleProfileInfo,
}: ProfileDetailsFormProps) {
  const theme = useTheme();

  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      about: profileTabInfo.about,
      socialMedia: profileTabInfo.socialMedia,
      skills: profileTabInfo.skills,
      languages: profileTabInfo.languages,
    },
  });

  const {
    fields: socialMediaFields,
    append: socialMediaAppend,
    remove: socialMediaRemove,
  } = useFieldArray<FormValues>({
    name: "socialMedia",
    control,
  });

  const onSubmit = async (data: any) => {
    try {
      const updatedProfileTabInfo = {
        ...profileTabInfo,
        socialMedia: data.socialMedia,
        skills: data.skills,
        languages: data.languages,
        about: data.about,
      };

      const formData = createFormData(updatedProfileTabInfo, undefined, {
        file: [updatedProfileTabInfo?.avatar],
        name: "avatar",
      });

      const response = (await updateUserInfo(
        updatedProfileTabInfo._id,
        formData
      )) as any;

      if (response) {
        toast.success("Your profile info updated successfully!");
        handleProfileInfo(response);
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("You are not signed in! Please sign in.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };

  return (
    <CustomModal
      open={openProfileDetailsModal}
      handleClose={() => handleClose()}
      framesx={{
        width: 600,
        border: "2px solid #000",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
      headersx={{
        borderBottom: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
      }}
      title="Profile Details"
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "space-between",
        }}
      >
        <ToastContainer />

        {ProfileDetailsInputData.map((data, index) => (
          <Input
            key={index}
            id={data.id}
            ty={data.type}
            placeholder={data.placeholder}
            labelText={data.labelText}
            sx={data.sx}
            margin={data.margin as "normal" | "dense"}
            inputSize={isMediumScreen ? "small" : "medium"}
            required={data.required}
            fullWidth={data.fullWidth}
            multiline={data.multiline}
            variant={data.variant as "standard" | "outlined" | "filled"}
            errors={errors}
            {...(register &&
              register(data.register.name as "about", {
                ...data.register.schema,
              }))}
          />
        ))}

        <Box>
          <Typography
            sx={{
              width: "100%",
              py: 0.5,
              color: "#8C8C95",
              fontWeight: "400",
              fontSize: "0.8571428571428571rem",
              lineHeight: "1.4375em",
            }}
            variant="h5"
          >
            Social Media Links
          </Typography>
          <Stack
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="flex-start"
            flexWrap="wrap"
            gap="1rem"
            sx={{ mt: 2, py: 1 }}
          >
            {socialMediaFields.map((item, index) => {
              return (
                <Box
                  key={item.id}
                  sx={{
                    position: "relative",
                    minHeight: "5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextField
                      id={`socialMedia-platform-${index}`}
                      error={!!(errors as any)[`socialMedia.${index}.platform`]}
                      {...register(`socialMedia.${index}.platform`, {
                        required: "This is required.",
                      })}
                      defaultValue={item.platform}
                      placeholder="Platform"
                      size="small"
                      sx={{
                        width: "10rem",
                        ...InputStyles(theme),
                      }}
                    />
                    <TextField
                      id={`socialMedia-url-${index}`}
                      error={!!(errors as any)[`socialMedia.${index}.url`]}
                      {...register(`socialMedia.${index}.url`, {
                        required: "This is required.",
                      })}
                      defaultValue={item.url}
                      placeholder="URL"
                      size="small"
                      sx={{ width: "20rem", ...InputStyles(theme) }}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() => socialMediaRemove(index)}
                      size="small"
                    >
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
            <Button
              variant="outlined"
              onClick={() => socialMediaAppend({ platform: "", url: "" })}
              sx={{ width: "9rem" }}
            >
              Add New Link
            </Button>
          </Stack>
        </Box>
        <Box>
          <Typography
            sx={{ width: "100%", my: 1, color: "text.secondary" }}
            variant="h5"
          >
            Skills
          </Typography>
          <Controller
            name="skills"
            control={control}
            render={({ field, fieldState }) => (
              <MuiChipsInput
                {...field}
                hideClearAll
                error={fieldState.invalid}
                sx={{
                  maxHeight: "8rem",
                  overflowY: "auto",
                  ...InputStyles(theme),
                }}
              />
            )}
          />
        </Box>
        <Box>
          <Typography
            sx={{ width: "100%", my: 1, color: "text.secondary" }}
            variant="h5"
          >
            Languages
          </Typography>
          <Controller
            name="languages"
            control={control}
            render={({ field, fieldState }) => (
              <MuiChipsInput
                {...field}
                hideClearAll
                error={fieldState.invalid}
                sx={{
                  maxHeight: "8rem",
                  overflowY: "auto",
                  ...InputStyles(theme),
                }}
              />
            )}
          />
        </Box>
        <CustomButton
          leftButtonsx={{
            borderTop: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "secondary.main"
                : "border.secondary",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          righButtonText="Edit"
        />
      </Box>
    </CustomModal>
  );
}
