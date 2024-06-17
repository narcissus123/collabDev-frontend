import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";

interface ProfileDetailsFormProps {
  openBadgesModal: boolean;
  handleClose: () => void;
  profileTabInfo: User;
  handleProfileInfo: (userInfo: User) => void;
}

interface FormValues {
  badges: string[];
}

export default function BadgesForm({
  openBadgesModal,
  handleClose,
  profileTabInfo,
  handleProfileInfo,
}: ProfileDetailsFormProps) {
  const theme = useTheme();

  const [multipleImages, setMultipleImages] = useState<File[]>([]);

  const changeMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray: File[] = Array.from(files);
      setMultipleImages((prevImages: File[]) => [...prevImages, ...fileArray]);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      badges: profileTabInfo.badges,
    },
  });

  const onSubmit = async () => {
    try {
      const updatedProfileTabInfo = {
        ...profileTabInfo,
      };
      const formData = createFormData(
        updatedProfileTabInfo,
        { files: multipleImages, name: "badges" },
        { file: [updatedProfileTabInfo?.avatar], name: "avatar" }
      );

      const response = (await updateUserInfo(
        updatedProfileTabInfo._id,
        formData
      )) as any;

      if (response) {
        toast.success("Your badges board updated successfully!");
        handleProfileInfo(response);
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
      open={openBadgesModal}
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
      title="Badges"
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <label>
          Badges form
          <input
            key="1"
            id="badges"
            type="file"
            accept="image/*"
            multiple={true}
            placeholder=""
            required={false}
            {...register("badges", { required: true })}
            onChange={changeMultipleFiles}
          />
        </label>
        {errors.badges && <p className="error">Please select an image</p>}
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
          righButtonText="Upload"
        />
      </Box>
    </CustomModal>
  );
}
