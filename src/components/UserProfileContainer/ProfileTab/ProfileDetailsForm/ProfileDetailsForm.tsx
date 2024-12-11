import {
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MuiChipsInput } from "mui-chips-input";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { useMutation } from "@tanstack/react-query";
import {
  ProfileDetailsInputData,
  socialMediaPlatforms,
} from "../../../../configs/data/UserProfileInputData";
import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Input from "../../../common/Input/Input";
import { InputStyles } from "../../../common/InputStyles/InputStyles";

interface ProfileDetailsFormProps {
  openProfileDetailsModal: boolean;
  handleClose: () => void;
  profileTabInfo: User;
  onSuccess: () => void;
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
  onSuccess,
}: ProfileDetailsFormProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      about: profileTabInfo.about,
      socialMedia: profileTabInfo.socialMedia.map((item) => ({
        platform:
          socialMediaPlatforms.find(
            (platform) => platform.toLowerCase() === item.platform.toLowerCase()
          ) || "Other",
        url: item.url,
      })),
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

  const mutation = useMutation({
    mutationFn: (updatedUser: { id: string; data: any }) =>
      updateUserInfo(updatedUser.id, updatedUser.data),

    onSuccess: (response: any) => {
      if (response) {
        toast.success("Your account information updated successfully!");
        onSuccess();
      }
    },
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
      const userId = profileTabInfo._id;

      mutation.mutate({ id: userId, data: updatedProfileTabInfo });
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <CustomModal
        open={openProfileDetailsModal}
        handleClose={handleClose}
        framesx={{
          width: 600,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        headersx={{
          borderBottom: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "secondary.main"
              : "border.secondary",
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
            gap: 7,
            mt: "0rem",
            alignItems: "space-between",
          }}
        >
          {ProfileDetailsInputData.map((data, index) => (
            <Box key={uuidv4()}>
              <Typography
                sx={{
                  width: "100%",
                  color:
                    theme.palette.mode === "dark"
                      ? "text.secondary"
                      : "border.secondary",
                  fontSize: "0.9rem",
                }}
              >
                {data.labelText}
              </Typography>
              <Input
                key={index}
                id={data.id}
                ty={data.type}
                placeholder={data.placeholder}
                sx={data.sx}
                margin={data.margin as "normal" | "dense"}
                inputSize={isMediumScreen ? "small" : "medium"}
                required={data.required}
                fullWidth={data.fullWidth}
                multiline={data.multiline}
                variant={data.variant as "standard" | "outlined" | "filled"}
                errors={errors}
                {...(register &&
                  register(data?.register?.name as "about", {
                    ...data?.register?.schema,
                  }))}
              />
            </Box>
          ))}

          <Box>
            <Typography
              sx={{
                width: "100%",
                my: 1,
                color:
                  theme.palette.mode === "dark"
                    ? "text.secondary"
                    : "border.secondary",
              }}
            >
              Social Media Links
            </Typography>
            <Stack spacing={2}>
              {socialMediaFields.map((item, index) => {
                return (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Controller
                      name={`socialMedia.${index}.platform`}
                      control={control}
                      rules={{ required: "Platform is required" }}
                      render={({ field }) => {
                        return (
                          <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                              {...field}
                              labelId={`platform-label-${index}`}
                              error={!!errors.socialMedia?.[index]?.platform}
                              sx={{ color: "text.secondary" }}
                            >
                              {socialMediaPlatforms.map((platform) => (
                                <MenuItem
                                  key={platform}
                                  value={platform}
                                  sx={{ color: "text.secondary" }}
                                >
                                  {platform}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      }}
                    />
                    <TextField
                      {...register(`socialMedia.${index}.url`, {
                        required: "URL is required",
                      })}
                      placeholder="URL"
                      size="small"
                      error={!!errors.socialMedia?.[index]?.url}
                      sx={{ flexGrow: 1, ...InputStyles(theme) }}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() => socialMediaRemove(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}
              <Button
                variant="outlined"
                onClick={() => socialMediaAppend({ platform: "", url: "" })}
              >
                Add New Social Media
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography
              sx={{
                width: "100%",
                my: 1,
                color:
                  theme.palette.mode === "dark"
                    ? "text.secondary"
                    : "border.secondary",
                fontSize: "0.9rem",
              }}
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
                    width: "100%",
                    ...InputStyles(theme),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                width: "100%",
                my: 1,
                color:
                  theme.palette.mode === "dark"
                    ? "text.secondary"
                    : "border.secondary",
                fontSize: "0.9rem",
              }}
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
                    width: "100%",
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
            type="button"
          />
        </Box>
      </CustomModal>
    </>
  );
}
