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
import { toast } from "react-toastify";

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

import ErrorFallback from "../common/ErrorFallback/ErrorFallback";
import { getAllProjectss } from "../../core/services/api/manage-projects.api";
import { ProjectType } from "../../configs/types/projectTypes";

import ProjectCard from "../common/ProjectCard/ProjectCard";
import SortModal from "./modals/SortModal";
import FilterModal from "./modals/FilterModal";

export default function ProjectsContainer() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const location = useLocation();
  const navigate = useNavigate();
  const [, setFilters] = useState({});
  const defaultPageSize = 2;
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page") || "1", 10);
  const [pageSize, setPageSize] = useState(
    parseInt(queryParams.get("limit") || defaultPageSize.toString(), 10)
  );
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

  const { data: project, error } = useSuspenseQuery({
    queryKey: ["getAllProjectss", queryString],
    queryFn: () => getAllProjectss(queryString),
  });

  if (error) {
    toast.error("Sorry. Something went wrong.");
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
            Yessssssssssssssssssssss
          </Box>
        }
      >
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
                mr: isMediumScreen ? "0rem" : "1.5rem",
                p: 1,
              }}
              gap={isMediumScreen ? 2 : 1}
            >
              <Stack
                direction="row"
                gap={2}
                sx={{ flex: 1, alignItems: "center" }}
              >
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
                  displayEmpty
                  inputProps={{ "aria-label": "Items per page" }}
                  size="small"
                  sx={{ color: "text.secondary" }}
                >
                  {[2, 5, 10, 20].map((size) => (
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
                <FilterModal setQueryString={handleApplyFilters} />
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
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid red",
                        mt: 24,
                        bg: "red",
                      }}
                    >
                      Yessssssssssssssssssssss
                    </Box>
                  }
                >
                  <Grid container gap={2}>
                    {project?.data?.projects?.map(
                      (prj: ProjectType, index: Key) => {
                        return <ProjectCard project={prj} key={index} />;
                      }
                    )}
                  </Grid>
                </Suspense>
              </ErrorBoundary>
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
                {project?.data?.total && (
                  <Button
                    disabled={currentPage * pageSize >= project?.data?.total}
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
                )}
              </Stack>
            </Box>
          </Grid>
        </Stack>
      </Suspense>
    </ErrorBoundary>
  );
}
