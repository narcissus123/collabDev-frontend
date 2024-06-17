import AddIcon from "@mui/icons-material/Add";
import { useTheme, Grid, Typography, IconButton, Card } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Key, Suspense, startTransition, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";

import { ProjectType } from "../../../configs/types/projectTypes";
import { FormProvider } from "../../../context/FormContext/FormContext";
import { getAllProjects } from "../../../core/services/api/manage-projects.api";
import CustomModal from "../../common/CustomModal/CustomModal";
import CustomStepper from "../../common/CustomStepper/CustomStepper";
import { Loading } from "../../common/Loading/Loading";
import ProjectCard from "../../common/ProjectCard/ProjectCard";

import ProjectDetails from "./ProjectFormSteps/ProjectDetails";
import ProjectImages from "./ProjectFormSteps/projectImages";
import ProjectOverview from "./ProjectFormSteps/ProjectOverview";
import Result from "./ProjectFormSteps/Result";

const steps = [
  "Project Overview",
  "Project Details",
  "Project Images",
  "Result",
];

export default function ProjectsTab() {
  const theme = useTheme();
  const [myprojects, setMyProjects] = useState<ProjectType[]>([]);
  const [currentPage] = useState<number>(1);
  const [contProjects, setContProjects] = useState<ProjectType[]>([]);
  const { userId } = useParams();
  const [apiCallsCompleted, setApiCallsCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("Project Overview");

  const handleActiveStep = (step: string) => {
    setActiveStep(step);
  };

  useEffect(() => {
    setTimeout(() => {
      setApiCallsCompleted(true);
    }, 400);
  }, []);

  const getProject = async () => {
    try {
      const response: any = await getAllProjects(`/`);

      if (response) {
        startTransition(() => {
          startTransition(() => {
            const filteredMyProjects = response.projects.filter(
              (proj: any) => proj.owner._id === userId
            );
            setMyProjects(filteredMyProjects);

            const contributedProjects = response.projects.filter(
              (proj: any) => {
                const isOwnerContributor = proj.contributors.some(
                  (contributor: { name: string; avatar: string }) =>
                    contributor.name === proj.owner.name
                );
                return isOwnerContributor && proj.owner._id !== userId;
              }
            );
            setContProjects(contributedProjects);
          });
        });
      }
    } catch (error) {
      toast.error("Sorry. Something went wrong.");
      console.error(error);
    }
  };

  const handleProjectInfo = (updatedInfo: ProjectType) => {
    setMyProjects((prev) => [...prev, updatedInfo]);
  };

  useEffect(() => {
    getProject();
  }, [currentPage]);
  const [addProject, setAddProject] = useState<boolean>(false);

  const handleAddProjClick = () => {
    setAddProject((prev) => !prev);
    setActiveStep("Project Overview");
  };

  return (
    <FormProvider>
      <Grid
        container
        sx={{
          width: "100%",
          bgcolor:
            theme.palette.mode === "dark"
              ? "background.secondary"
              : "background.default",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          paddingBottom: "10px",
          boxSizing: "border-box",
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h3" sx={{ py: 3, ml: 2 }} color="text.secondary">
            My Projects
          </Typography>
          <Suspense fallback={<Loading />}>
            <Stack
              display="flex"
              flexDirection="row"
              gap={2}
              sx={{ flexWrap: "wrap", ml: 2 }}
            >
              {myprojects?.map((project: ProjectType, index: Key) => (
                <ProjectCard project={project} key={index} index={index} />
              ))}

              {apiCallsCompleted && (
                <Grid item xs={12} md={5.8} lg={3.8} sx={{ width: "100%" }}>
                  <Card
                    sx={{
                      height: 274.29,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "none",
                      backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='3' ry='3' stroke='%23BFBFBF' stroke-width='6' stroke-dasharray='7%2c 14' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e")`,
                      borderRadius: "3px",
                    }}
                    onClick={handleAddProjClick}
                  >
                    <IconButton>
                      <AddIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <Typography variant="h5" color="text.secondary">
                      New Project
                    </Typography>
                  </Card>
                </Grid>
              )}
              {addProject && (
                <CustomModal
                  open={addProject}
                  handleClose={handleAddProjClick}
                  cardsx={{
                    width: "100vw",
                    maxHeight: "100vh",
                    height: "100%",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CustomStepper
                    handleActiveStep={handleActiveStep}
                    steps={steps}
                    activeStep={steps.indexOf(activeStep)}
                  >
                    {activeStep === "Project Overview" ? (
                      <ProjectOverview handleActiveStep={handleActiveStep} />
                    ) : activeStep === "Project Details" ? (
                      <ProjectDetails handleActiveStep={handleActiveStep} />
                    ) : activeStep === "Project Images" ? (
                      <ProjectImages handleActiveStep={handleActiveStep} />
                    ) : (
                      <Result
                        handleActiveStep={handleActiveStep}
                        handleProjectInfo={handleProjectInfo}
                      />
                    )}
                  </CustomStepper>
                </CustomModal>
              )}
            </Stack>
          </Suspense>
        </Grid>
        <Grid item xs={12} sx={{ my: 3, pb: 10 }}>
          <Typography variant="h3" sx={{ py: 3, ml: 2 }} color="text.secondary">
            Contributed Projects
          </Typography>
          <Suspense fallback={<Loading />}>
            <Stack
              display="flex"
              flexDirection="row"
              gap={2}
              sx={{ flexWrap: "wrap" }}
            >
              {contProjects.length === 0 ? (
                <Typography sx={{ ml: 3 }}>No projects found</Typography>
              ) : (
                contProjects?.map((project: ProjectType, index: Key) => (
                  <ProjectCard project={project} key={index} index={index} />
                ))
              )}
            </Stack>
          </Suspense>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
