import {
  Key,
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { SelectChangeEvent } from "@mui/material";
import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { ToastContainer } from "react-toastify";
import ErrorFallback from "../common/ErrorFallback/ErrorFallback";
import { getAllProjects } from "../../core/services/api/manage-projects.api";
import { ProjectType } from "../../configs/types/projectTypes";

import ProjectCard from "../common/ProjectCard/ProjectCard";
import SortModal from "./modals/SortModal";
import FilterModal from "./modals/FilterModal";

type ProjectData = {
  data: {
    projects: ProjectType[];
    total: number;
  };
};

function ProjectsList({
  queryString,
  onDataChange,
}: {
  queryString: string;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDataChange: (data: ProjectData) => void;
}) {
  const { data: project } = useSuspenseQuery({
    queryKey: ["getAllProjects", queryString],
    queryFn: () => getAllProjects(queryString),
  });

  useEffect(() => {
    if (project) {
      onDataChange(project);
    }
  }, [project, onDataChange]);

  if (!project?.data?.projects) {
    return null;
  }

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "16px",
        "& > *": {
          flexGrow: 0,
          flexShrink: 0,
          width: "calc((100% - 32px) / 3)",
          "@media (max-width: 900px)": {
            width: "calc((100% - 16px) / 2)",
          },
          "@media (max-width: 600px)": {
            width: "100%",
          },
        },
      }}
    >
      {project.data.projects.length === 0 ? (
        <Stack
          alignItems="center"
          spacing={2}
          mt={4}
          sx={{ width: "100%", pt: "1rem" }}
        >
          <Typography color="text.secondary" sx={{ fontSize: "16px" }}>
            No projects found
          </Typography>
        </Stack>
      ) : (
        project.data.projects.map((prj: ProjectType, index: Key) => {
          return (
            <ProjectCard
              project={prj}
              key={index}
              ptClassName={{ cardMargin: 0, cardHeight: "100%" }}
            />
          );
        })
      )}
    </Stack>
  );
}

export default function ProjectsContainer() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const location = useLocation();
  const navigate = useNavigate();
  const [, setFilters] = useState({});
  const defaultPageSize = 6;
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page") || "1", 10);
  const [pageSize, setPageSize] = useState(
    parseInt(queryParams.get("limit") || defaultPageSize.toString(), 10)
  );
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [queryString, setQueryString] = useState(
    `?page=${currentPage}&limit=${pageSize}`
  );

  useEffect(() => {
    if (!queryParams.get("page") || !queryParams.get("limit")) {
      queryParams.set("page", currentPage.toString());
      queryParams.set("limit", pageSize.toString());
      navigate({ search: queryParams.toString() });
    }
  }, []);

  const handleApplyFilters = useCallback(
    (newFilters: any) => {
      setFilters(newFilters);
      const filterParams = new URLSearchParams(newFilters);
      filterParams.set("page", "1"); // Reset to the first page when applying new filters
      filterParams.set("limit", pageSize.toString());
      startTransition(() => {
        navigate({ search: filterParams.toString() });
        setQueryString(`?${filterParams.toString()}`);
      });
    },
    [pageSize]
  );

  const handlePageChange = (page: number) => {
    queryParams.set("page", page.toString());
    startTransition(() => {
      navigate({ search: queryParams.toString() });
      setQueryString(`?${queryParams.toString()}`);
    });
  };

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 14,
        px: 3,
        bgcolor:
          theme.palette.mode === "dark"
            ? "background.secondary"
            : "background.default",
      }}
    >
      <ToastContainer />
      <Grid
        item
        xs={12}
        sx={{
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            flexWrap: "wrap",
            mx: isMediumScreen ? "-0.5rem" : "0.3rem",
            p: 1,
          }}
          gap={isMediumScreen ? 2 : 1}
        >
          <Stack direction="row" gap={2} sx={{ flex: 1, alignItems: "center" }}>
            <Typography color="text.secondary">Items per page:</Typography>
            <Select
              value={pageSize}
              onChange={(event: SelectChangeEvent<number>) => {
                const newSize = event.target.value as number;
                setPageSize(newSize);
                queryParams.set("limit", newSize.toString());
                queryParams.set("page", "1"); // Reset to the first page when changing page size
                startTransition(() => {
                  navigate({ search: queryParams.toString() });
                  setQueryString(`?${queryParams.toString()}`);
                });
              }}
              disabled={projectData?.data?.projects.length === 0}
              displayEmpty
              inputProps={{ "aria-label": "Items per page" }}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              {[6, 12, 18, 24].map((size) => (
                <MenuItem
                  key={size}
                  value={size}
                  sx={{ color: "text.secondary" }}
                >
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <Stack
            display="flex"
            flexDirection="row"
            flexWrap="nowrap"
            justifyContent="flex-end"
            alignItems="flex-start"
            gap={1}
          >
            <SortModal />
            <FilterModal
              setQueryString={handleApplyFilters}
              disabled={projectData?.data?.projects.length === 0}
            />
          </Stack>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor:
              theme.palette.mode === "dark"
                ? "background.secondary"
                : "background.default",
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // Reset the error state
              const defaultParams = new URLSearchParams();
              defaultParams.set("page", "1");
              defaultParams.set("limit", defaultPageSize.toString());
              navigate({ search: defaultParams.toString() });
              setQueryString(`?${defaultParams.toString()}`);
            }}
          >
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    mt: 6,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  Loading...
                </Box>
              }
            >
              <ProjectsList
                queryString={queryString}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onDataChange={setProjectData}
              />
            </Suspense>
          </ErrorBoundary>
          {projectData?.data?.total ? (
            <Stack
              display="flex"
              direction="row"
              spacing={2}
              mt={2}
              sx={{ justifyContent: "center" }}
            >
              <Button
                onClick={() => {
                  const nextPage = currentPage - 1;
                  queryParams.set("page", nextPage.toString());
                  startTransition(() => {
                    navigate({ search: queryParams.toString() });
                    setQueryString(`?${queryParams.toString()}`);
                  });
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <Button
                disabled={currentPage * pageSize >= projectData?.data?.total}
                onClick={() => {
                  const nextPage = currentPage + 1;
                  queryParams.set("page", nextPage.toString());
                  startTransition(() => {
                    navigate({ search: queryParams.toString() });
                    setQueryString(`?${queryParams.toString()}`);
                  });
                }}
              >
                Next
              </Button>
            </Stack>
          ) : (
            <></>
          )}
        </Box>
      </Grid>
    </Stack>
  );
}
