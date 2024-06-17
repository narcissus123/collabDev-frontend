import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { ProjectType } from "../../../configs/types/projectTypes";
import { updateProject } from "../../../core/services/api/manage-projects.api";
import { createFormData } from "../../../core/utils/CreateFormData/createFormData";
import { useDragAndDrop } from "../../../hooks/useDragAndDrop";
import CustomButton from "../../common/CustomButton/CustomButton";
import CustomModal from "../../common/CustomModal/CustomModal";
import { DropBox } from "../../common/DropBox/DropBox";

interface FormValues {
  coverImage: File[] | [];
}

interface Props {
  openEditImageModal: boolean;
  handleClose: () => void;
  handleProjectImage: (updatedProjectInfo: ProjectType) => void;
  project: ProjectType;
}

export const EditProjectImageModal = ({
  openEditImageModal,
  handleClose,
  handleProjectImage,
  project,
}: Props) => {
  const theme = useTheme();

  const { handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      coverImage: [],
    },
  });

  const multipleImages = false;
  const [onCoverImageDrop, coverImageImages] = useDragAndDrop(
    multipleImages,
    setValue,
    "coverImage",
    []
  );

  const onSubmit = async () => {
    try {
      const updatedInfo = {
        ...project,
        coverImage: coverImageImages[0] || project.coverImage,
      };

      const formData = createFormData(updatedInfo, undefined, {
        file: [updatedInfo?.coverImage],
        name: "coverImage",
      });

      const response = (await updateProject(updatedInfo._id, formData)) as any;

      if (response.status === 200) {
        handleProjectImage(response.data);

        toast.success("Your project images updated successfully!");
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
      open={openEditImageModal}
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
      title="Project Cover Image"
    >
      <ToastContainer />
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" sx={{ mb: 2, mt: 4, color: "text.secondary" }}>
          Project Cover Image
        </Typography>
        <Box
          sx={{
            border: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "#33c0ee" : "#B9B9BF",
          }}
        >
          <DropBox onDrop={onCoverImageDrop} />
        </Box>
        <Stack
          direction={"row"}
          justifyContent="flex-start"
          spacing={2}
          sx={{
            p: 1,
            overflowX: "auto",
          }}
        >
          {coverImageImages?.map((image, index) => {
            return (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={image.name}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                }}
              />
            );
          })}
        </Stack>
        <CustomButton righButtonText="Edit" />
      </Box>
    </CustomModal>
  );
};
