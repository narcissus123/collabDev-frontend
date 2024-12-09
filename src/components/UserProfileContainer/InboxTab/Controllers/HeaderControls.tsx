import { Stack, Tabs, Tab, Badge, IconButton, Tooltip } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import SortIcon from "@mui/icons-material/Sort";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { Delete } from "@mui/icons-material";

// Explicitly define the possible values
export type ViewMode = "list" | "compact";
export type SortBy = "date" | "status";

interface HeaderControlsProps {
  currentTab: number;
  setCurrentTab: (value: number) => void;
  counts: {
    all: number;
    sent: number;
    received: number;
  };
  viewMode: ViewMode;
  setViewMode: (value: ViewMode | ((prev: ViewMode) => ViewMode)) => void;
  sortBy: SortBy;
  setSortBy: (value: SortBy | ((prev: SortBy) => SortBy)) => void;
  selectedRequests: string[];
  isSelectionMode: boolean;
  setIsSelectionMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  onOpenDeleteModal: () => void;
}

const HeaderControls = ({
  currentTab,
  setCurrentTab,
  counts,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  selectedRequests,
  isSelectionMode,
  setIsSelectionMode,
  onOpenDeleteModal,
}: HeaderControlsProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          icon={
            <Badge badgeContent={counts.all} color="primary">
              <InboxIcon />
            </Badge>
          }
          label="All"
        />
        <Tab
          icon={
            <Badge badgeContent={counts.sent} color="primary">
              <SendIcon />
            </Badge>
          }
          label="Sent"
        />
        <Tab
          icon={
            <Badge badgeContent={counts.received} color="primary">
              <InboxIcon />
            </Badge>
          }
          label="Received"
        />
      </Tabs>

      <Stack direction="row" spacing={1} alignItems="center">
        {selectedRequests.length > 0 ? (
          <IconButton onClick={onOpenDeleteModal} color="error" size="small">
            <Badge badgeContent={selectedRequests.length} color="primary">
              <Delete />
            </Badge>
          </IconButton>
        ) : (
          <Tooltip title="Delete messages">
            <IconButton
              disabled={!counts}
              onClick={() => setIsSelectionMode((prev) => !prev)}
              color={isSelectionMode ? "default" : "primary"}
            >
              <Badge badgeContent={selectedRequests.length} color="primary">
                <Delete />
              </Badge>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={`Sort by ${sortBy === "date" ? "status" : "date"}`}>
          <IconButton
            disabled={!counts}
            onClick={() =>
              setSortBy((prev) => (prev === "date" ? "status" : "date"))
            }
            color={sortBy === "date" ? "primary" : "default"}
          >
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`Switch to ${viewMode === "list" ? "compact" : "list"} view`}
        >
          <IconButton
            disabled={!counts}
            onClick={() =>
              setViewMode((prev) => (prev === "list" ? "compact" : "list"))
            }
            color={viewMode === "list" ? "primary" : "default"}
          >
            {viewMode === "list" ? <ViewListIcon /> : <ViewModuleIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default HeaderControls;
