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

interface StepperProps {
  handleActiveStep: (step: string) => void;
}

export default function ProjectImages({ handleActiveStep }: StepperProps) {
  const { data, updateFormData } = useFormContext();

  const { handleSubmit, setValue } = useForm<ProjectForm>({
    defaultValues: getDefaultValues(data),
  });

  // Saving image from the file system.
  const multipleImages = true;
  const [onScreenshotDrop, screenshotImages] = useDragAndDrop(
    multipleImages,
    setValue,
    "screenshots",
    data.screenshots
  );
  const [onCoverImageDrop, coverImageImages] = useDragAndDrop(
    !multipleImages,
    setValue,
    "coverImage",
    data.coverImage
  );

  const onSubmit = (userInput: ProjectForm) => {
    updateFormData({
      ...userInput,
      coverImage: coverImageImages,
      screenshots: screenshotImages,
    });

    handleActiveStep("Result");
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages: File[] = [...data["screenshots"]];
    updatedImages.splice(index, 1);
    updateFormData({ ...data, ["screenshots"]: updatedImages });
    screenshotImages.splice(index, 1);
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
        {screenshotImages?.map((image, index) => {
          return (
            <Box key={index} position="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={image.name}
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
                onClick={() => handleDeleteImage(index)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          );
        })}
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
      <CustomButton
        leftHandleClick={() => handleActiveStep("Project Details")}
        leftButtonText="Back"
        righButtonText="Next"
      />
    </Box>
  );
}
