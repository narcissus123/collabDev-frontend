import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";

import { getDefaultValues } from "../../../../configs/defaultValues/defauleValues";
import { ProjectForm } from "../../../../configs/types/projectTypes";
import { useFormContext } from "../../../../context/FormContext/FormContext";
import { useDragAndDrop } from "../../../../hooks/useDragAndDrop";
import CustomButton from "../../../common/CustomButton/CustomButton";
import { DropBox } from "../../../common/DropBox/DropBox";
import {
  deleteUploadedFile,
  uploadFile,
} from "../../../../core/services/api/manage-fileupload.api";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { getImageUrl } from "../../../../core/utils/ImageUtils/imageUtils";

interface StepperProps {
  handleActiveStep: (step: string) => void;
}

export default function ProjectImages({ handleActiveStep }: StepperProps) {
  const { data, updateFormData } = useFormContext();
  const { user } = useAuth();
  const { handleSubmit, setValue } = useForm<ProjectForm>({
    defaultValues: getDefaultValues(data),
  });

  // Saving image from the file system.
  const multipleImages = true;
  const [onScreenshotDrop, screenshotImages, setScreenshotImages] =
    useDragAndDrop(multipleImages, setValue, "screenshots", data.screenshots);
  const [onCoverImageDrop, coverImageImages, setCoverImageImages] =
    useDragAndDrop(!multipleImages, setValue, "coverImage", data.coverImage);

  const onSubmit = async (userInput: ProjectForm) => {
    try {
      if (!user) return;

      const updatedData = { ...userInput };
      // Only upload cover image if there's a new file
      if (coverImageImages?.length > 0 && coverImageImages[0] instanceof File) {
        const coverImageResponse = await uploadFile(
          user._id,
          coverImageImages[0],
          "coverImage"
        );
        updatedData.coverImage = [coverImageResponse.data[0]];
      } else {
        updatedData.coverImage = data.coverImage;
      }

      // Only upload new screenshot files
      if (screenshotImages?.length > 0 && screenshotImages[0] instanceof File) {
        const screenshotsResponse = await uploadFile(
          user._id,
          screenshotImages,
          "screenshots"
        );
        // Combine existing screenshots with new ones
        updatedData.screenshots = [
          ...(data.screenshots || []),
          ...screenshotsResponse.data,
        ];
      } else {
        updatedData.screenshots = data.screenshots;
      }
      updateFormData(updatedData);
      handleActiveStep("Result");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleDeleteS3Image = async (
    imageUrl: string,
    isScreenshot: boolean
  ) => {
    if (!user) {
      console.error("User is undefined. Cannot proceed with delete.");
      return;
    }

    try {
      if (isScreenshot) {
        await deleteUploadedFile(user._id, "screenshots", imageUrl);
        const updatedScreenshots = data.screenshots.filter(
          (url) => url !== imageUrl
        );
        updateFormData({ ...data, screenshots: updatedScreenshots });
        setScreenshotImages([]);
        setValue("screenshots", updatedScreenshots);
      } else {
        await deleteUploadedFile(user._id, "coverImage", imageUrl);
        updateFormData({ ...data, coverImage: [] });
        setCoverImageImages([]);
        setValue("coverImage", []);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteLocalImage = (index: number, isScreenshot: boolean) => {
    if (isScreenshot) {
      const updatedImages = [...screenshotImages];
      updatedImages.splice(index, 1);
      setScreenshotImages(updatedImages);
      setValue("screenshots", updatedImages);
    } else {
      setCoverImageImages([]);
      setValue("coverImage", []);
    }
  };

  const handleDeleteImage = (
    index: number,
    imageUrl?: string,
    isScreenshot: boolean = true
  ) => {
    if (imageUrl) {
      handleDeleteS3Image(imageUrl, isScreenshot);
    } else {
      handleDeleteLocalImage(index, isScreenshot);
    }
  };

  const renderImage = (
    imageSource: string | File,
    index: number,
    isScreenshot: boolean
  ) => {
    const imageUrl =
      imageSource instanceof File
        ? URL.createObjectURL(imageSource)
        : getImageUrl(imageSource);
    const isS3Image = typeof imageSource === "string";

    return (
      <Box key={index} position="relative">
        <img
          src={imageUrl}
          alt="Project"
          style={{
            maxWidth: "100px",
            maxHeight: "100px",
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            color: "#d32f2f",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
            borderRadius: "50%",
            padding: "4px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#d32f2f",
              color: "#ffffff",
            },
          }}
          onClick={() =>
            handleDeleteImage(
              index,
              isS3Image ? (imageSource as string) : undefined,
              isScreenshot
            )
          }
        >
          <CloseIcon />
        </IconButton>
      </Box>
    );
  };

  const theme = useTheme();
  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography
        sx={{
          width: "100%",
          my: 0.5,
          color:
            theme.palette.mode === "dark" ? "primary.main" : "text.primary",
          fontSize: "0.875rem",
          fontWeight: "400",
          lineHeight: "1.4375em",
        }}
        variant="h5"
      >
        Project Wireframes
      </Typography>
      <Box
        sx={{
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "#33c0ee" : "#B9B9BF",
        }}
      >
        <DropBox onDrop={onScreenshotDrop} />
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
        {!screenshotImages?.length &&
          data.screenshots?.map((url, index) => renderImage(url, index, true))}
        {screenshotImages?.map((file, index) => renderImage(file, index, true))}
      </Stack>
      <Typography
        sx={{
          width: "100%",
          my: 0.5,
          color:
            theme.palette.mode === "dark" ? "primary.main" : "text.primary",
          fontSize: "0.875rem",
          fontWeight: "400",
          lineHeight: "1.4375em",
          mt: 4,
        }}
        variant="h5"
      >
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
        {!coverImageImages?.length &&
          data.coverImage?.[0] &&
          renderImage(data.coverImage[0], 0, false)}
        {coverImageImages?.map((file, index) =>
          renderImage(file, index, false)
        )}
      </Stack>
      <CustomButton
        leftHandleClick={() => handleActiveStep("Project Details")}
        leftButtonText="Back"
        righButtonText="Next"
      />
    </Box>
  );
}
