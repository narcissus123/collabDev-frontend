import {
  useTheme,
  Box,
  Button,
  Grid,
  MenuItem,
  Typography,
  Select,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Key, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ProjectType } from "../../configs/types/projectTypes";
import { getAllProjects } from "../../core/services/api/manage-projects.api";
import useFetch from "../../hooks/useFetch";
import ProjectCard from "../common/ProjectCard/ProjectCard";

import FilterModal from "./modals/FilterModal";
import SortModal from "./modals/SortModal";

interface ProjectsResponse {
  projects: ProjectType[];
  total: number;
}

export default function ProjectsContainer() {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const defaultPageSize = 2;
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({});
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

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    const filterParams = new URLSearchParams(newFilters);
    filterParams.set("page", "1"); // Reset to the first page when applying new filters
    filterParams.set("limit", pageSize.toString());
    setQueryString((prev) => `?${prev}&${filterParams.toString()}`);
    navigate({ search: filterParams.toString() });
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    setPageSize(newSize);
    queryParams.set("limit", newSize.toString());
    queryParams.set("page", "1"); // Reset to the first page when changing page size
    navigate({ search: queryParams.toString() });
  };

  useEffect(() => {
    const mergedParams = new URLSearchParams({
      ...Object.fromEntries(queryParams.entries()),
      page: currentPage.toString(),
      limit: pageSize.toString(),
    });

    setQueryString(`?${mergedParams.toString()}`);
  }, [location.search, filters]);

  const { isLoading, data } = useFetch<ProjectsResponse>(
    getAllProjects,
    queryString
  );

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
          <Stack direction="row" gap={2} sx={{ flex: 1, alignItems: "center" }}>
            <Typography color="text.secondary">Items per page:</Typography>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
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
          {isLoading ? (
            <Box
              sx={{
                flexGrow: 1,
                mt: "5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Loading...
            </Box>
          ) : (
            <Grid container gap={2}>
              {!isLoading &&
                data?.projects &&
                data?.projects?.map((project: ProjectType, index: Key) => {
                  return (
                    <ProjectCard project={project} key={index} index={index} />
                  );
                })}
            </Grid>
          )}
          <Stack
            display="flex"
            direction="row"
            spacing={2}
            mt={2}
            sx={{ justifyContent: "center" }}
          >
            <Button
              onClick={() => {
                const prevPage = currentPage - 1;
                queryParams.set("page", prevPage.toString());
                navigate({ search: queryParams.toString() });
              }}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {data?.total && (
              <Button
                disabled={currentPage * pageSize >= data?.total}
                onClick={() => {
                  const nextPage = currentPage + 1;
                  queryParams.set("page", nextPage.toString());
                  navigate({ search: queryParams.toString() });
                }}
              >
                Next
              </Button>
            )}
          </Stack>
        </Box>
      </Grid>
    </Stack>
  );
}
