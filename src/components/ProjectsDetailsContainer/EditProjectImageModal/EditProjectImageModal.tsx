import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Stack, useTheme } from "@mui/material";
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
  handleProjectImage: () => void;
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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updateProjectInfo: { id: string; data: any }) =>
      updateProject(updateProjectInfo.id, updateProjectInfo.data),
    onSuccess: (data: any) => {
      toast.success("Your project info updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["updateProject", data._id] });
      handleProjectImage();
    },
    onError: (error: any) => {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    },
  });
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

      mutation.mutate({ id: updatedInfo._id, data: formData });
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <CustomModal
        open={openEditImageModal}
        handleClose={() => handleClose()}
        framesx={{
          width: 600,
        }}
        headersx={{
          borderBottom: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "secondary.main"
              : "border.secondary",
        }}
        title="Project Cover Image"
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark" ? "#33c0ee" : "#B9B9BF",
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
          <CustomButton righButtonText="UPload" />
        </Box>
      </CustomModal>
    </>
  );
};
