import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useMediaQuery,
  useTheme,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { getDefaultValues } from "../../../../configs/defaultValues/defauleValues";
import {
  ProjectType,
  ProjectForm,
} from "../../../../configs/types/projectTypes";
import { useFormContext } from "../../../../context/FormContext/FormContext";
import { addProject } from "../../../../core/services/api/manage-projects.api";
import { getItem } from "../../../../core/services/storage/Storage";
import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
import dateFormatter from "../../../../core/utils/DateFormatter/dateFormatter";
import CustomButton from "../../../common/CustomButton/CustomButton";
import LabeledTypography from "../../../common/LabeledTypography/LabeledTypography";

interface StepperProps {
  handleActiveStep: (step: string) => void;
  handleProjectInfo: (updatedInfo: ProjectType) => void;
}

const Result = ({ handleActiveStep, handleProjectInfo }: StepperProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [iseSuccessful, setIsSuccessful] = useState(false);
  const { data, updateFormData } = useFormContext();

  const { handleSubmit, reset } = useForm<ProjectForm>({
    defaultValues: getDefaultValues(data),
  });

  const onSubmit = async (userInput: ProjectForm) => {
    try {
      const owner = JSON.parse(getItem("user"));
      const deliverables = userInput.deliverables.map((del) => del.name);
      const sitemap = userInput.sitemap.map((site) => site.name);
      const userStories = userInput.userStories.map((stories) => stories.name);
      const updateUserInput = {
        ...userInput,
        contributionsGuidelines: "",
        owner: { _id: owner._id, name: owner.name, avatar: owner.avatar },
      };

      const formData = createFormData(
        { ...updateUserInput, deliverables, sitemap, userStories },
        {
          files: data?.screenshots || [],
          name: "screenshots",
        },
        {
          file: data?.coverImage || [],
          name: "coverImage",
        }
      );

      const response = (await addProject(formData)) as any;

      if (response.status === 201) {
        setIsSuccessful(true);
        handleProjectInfo(response.data);
        updateFormData(getDefaultValues());
        reset();
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("You are not signed in! Please sign in.");
        } else {
          toast.error("Something went wrong. Please try later!");
          console.error(response);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
      console.error(error);
    }
  };
  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        minHeight: "100vh",
        mt: "5rem",
      }}
    >
      {iseSuccessful ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            height: "20rem",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: "3rem", color: "green" }} />
          <Typography variant="h3" sx={{ color: "text.secondary" }}>
            Your project added successfully!
          </Typography>
        </Box>
      ) : (
        <>
          <ToastContainer />
          <Box>
            {data.coverImage.length !== 0 && (
              <img
                src={URL.createObjectURL(data.coverImage[0])}
                alt="project cover"
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            )}
            <Box
              sx={{
                m: isLargeScreen ? "2.5rem 1.75rem" : "5rem 6.25rem",
                display: "flex",
                flexDirection: "column",
                gap: isLargeScreen ? 4 : 9,
              }}
            >
              <LabeledTypography label="Project name" isLargeScreen>
                {data.title}
              </LabeledTypography>

              <LabeledTypography label="Description" isLargeScreen>
                {data.description}
              </LabeledTypography>
              <LabeledTypography label="The solution" isLargeScreen>
                {data.solution}
              </LabeledTypography>
              <LabeledTypography label="Features" isLargeScreen>
                {data.userStories.map((feature) => (
                  <Typography
                    key={uuidv4()}
                    sx={{
                      marginTop: "0.5rem",
                    }}
                  >{`\u2022 ${feature.name}`}</Typography>
                ))}
              </LabeledTypography>
              <LabeledTypography label="Roles" isLargeScreen>
                {data.roles.map((role) => (
                  <Box component="span" key={uuidv4()}>
                    {role.requiresCollaborator ? (
                      <Tooltip title="This role requires a collaborator">
                        <Typography>{`${role.name} *`}</Typography>
                      </Tooltip>
                    ) : (
                      `${role.name}, `
                    )}
                  </Box>
                ))}
              </LabeledTypography>
              <LabeledTypography label="Tech Stack" isLargeScreen>
                {data.techStack.map((tech) => tech.value).join(", ")}
              </LabeledTypography>
              <LabeledTypography label="Deliverables" isLargeScreen>
                {data.deliverables.map((del) => del.name).join(", ")}
              </LabeledTypography>
              <LabeledTypography label="Sitemap" isLargeScreen>
                {data.sitemap.map((site) => site.name).join(", ")}
              </LabeledTypography>
              <LabeledTypography label="Category: " isLargeScreen>
                {data.category}
              </LabeledTypography>
              <LabeledTypography label="Status: " isLargeScreen>
                {data.status}
              </LabeledTypography>
              <LabeledTypography label="License: " isLargeScreen>
                {data.license}
              </LabeledTypography>
              <LabeledTypography label="Start date: " isLargeScreen>
                {dateFormatter(data.startDate)}
              </LabeledTypography>
              <LabeledTypography label="Due date: " isLargeScreen>
                {dateFormatter(data.dueDate)}
              </LabeledTypography>
            </Box>
            {data.screenshots.length !== 0 && (
              <Stack
                display="flex"
                direction="row"
                justifyContent="flex-start"
                gap={2}
                sx={{ overflowX: "auto", mb: 10 }}
              >
                {data.screenshots.map((img) => {
                  return (
                    <img
                      key={uuidv4()}
                      src={URL.createObjectURL(img)}
                      alt="project screen shots"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  );
                })}
              </Stack>
            )}
          </Box>
          <CustomButton
            leftHandleClick={() => handleActiveStep("Project Images")}
            leftButtonText="Back"
            righButtonText="submit"
          />
        </>
      )}
    </Box>
  );
};

export default Result;
