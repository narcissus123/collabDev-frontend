import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, useState } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { UserAccounInputData } from "../../../../configs/data/UserAccounInputData";
import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Input from "../../../common/Input/Input";

interface AccountDetailsFormProps {
  open: boolean;
  handleClose: () => void;
  developer: User | undefined;
  handleProfileInfo: (userInfo: User) => void;
}

interface FormValues {
  name: string;
  bio: string;
  avatar: string;
  email: string;
}

export default function AccountDetailsForm({
  open,
  handleClose,
  developer,
  handleProfileInfo,
}: AccountDetailsFormProps) {
  const theme = useTheme();

  const [avatar, setAvatar] = useState<File[]>([]);
  const [previewURL, setPreviewURL] = useState(
    `http://localhost:8080/public/userProfileImages/${developer?.avatar}`
  );

  // Function to handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      setPreviewURL(URL.createObjectURL(file[0]));
      const fileArray: File[] = Array.from(file);
      setAvatar(fileArray);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: developer?.name,
      bio: developer?.bio,
      avatar: developer?.avatar,
      email: developer?.email,
    },
  });

  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onSubmit = async (data: any) => {
    try {
      const updatedProfileTabInfo = {
        ...developer,
        ...data,
        avatar: avatar[0] || data.avatar,
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
        toast.success("Your profile image updated successfully!");
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
      open={open}
      handleClose={() => handleClose()}
      framesx={{
        width: 600,
        border: "2px solid #000",
      }}
      headersx={{
        borderBottom: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
      }}
      title="Account Details"
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <Box>
          {/* Avatar image */}
          {developer?.avatar !== "" && (
            <>
              <label htmlFor="avatar" style={{ cursor: "pointer" }}>
                <Box
                  sx={{
                    width: "5.5rem",
                    height: "5.5rem",
                    borderRadius: "50%",
                    display: "inline-block",
                    overflow: "hidden",
                    position: "relative",
                    top: "-0.9rem",
                    left: "50%",
                    transform: "translatex(-50%)",
                    outline: "none",
                    backgroundColor: "grey",
                  }}
                >
                  <img
                    src={previewURL}
                    alt="Avatar"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      outline: "none",
                    }}
                  />
                  <input
                    id="avatar"
                    type="file"
                    style={{ display: "none", outline: "none" }}
                    required={false}
                    {...register("avatar", { required: true })}
                    onChange={(e) => handleFileChange(e)}
                    ref={fileInputRef}
                  />
                </Box>
              </label>
            </>
          )}
        </Box>
        {UserAccounInputData.map((data) => (
          <Box sx={{ mb: 3 }} key={uuidv4()}>
            <Input
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
                register(data.register.name as "email" | "name" | "bio", {
                  ...data.register.schema,
                }))}
            />
          </Box>
        ))}
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
