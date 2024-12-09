import { Suspense } from "react";
import { Box } from "@mui/material";
import ProjectsContainer from "../../components/ProjectsContainer/ProjectsContainer";

export default function Projects() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid red",
            mt: 20,
            bg: "red",
          }}
        >
          Yes
        </Box>
      }
    >
      <ProjectsContainer />
    </Suspense>
  );
}
