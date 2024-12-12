import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { Box, Stack, Typography, List, Skeleton } from "@mui/material";

import {
  deleteRequestById,
  getUserRequests,
} from "../../../core/services/api/manage-requests.api";
import ResponsiveDialog from "../../common/CustomModal/ConfirmationModal";
import { getRequestDisplayInfo } from "../../../core/utils/GetRequestDisplayInfo/GetRequestDisplayInfo";
import RequestCard from "./Card/RequestCard";
import HeaderControls from "./Controllers/HeaderControls";

interface InboxTabProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const InboxTab = ({ setValue }: InboxTabProps) => {
  const { userId } = useParams();
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "compact">("list");
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    data = [],
    error,
    isFetching,
  } = useSuspenseQuery<any>({
    queryKey: ["getUserRequests", userId],
    queryFn: () => getUserRequests(userId!),
    select: (response) => response?.data ?? [],
  });

  // Batch delete mutation
  const batchDeleteMutation = useMutation({
    mutationFn: (requestIds: string[]) =>
      Promise.all(requestIds.map((id) => deleteRequestById(id))),
    onSuccess: () => {
      toast.success("Selected requests removed from inbox");
      setSelectedRequests([]);
      setIsSelectionMode(false);
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["getUserRequests", userId],
        });
      }
      setOpenDeleteModal(false);
    },
    onError: (err) => {
      toast.error("Failed to remove some requests");
      console.error("Error:", err);
    },
  });

  const handleToggleSelect = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  // Calculate counts for badges
  const counts = {
    all: data.length,
    sent: data.filter(
      (req: any) =>
        (req.contributor._id === userId &&
          req.messageType === "collaboration_request") ||
        (req.contributor._id !== userId &&
          req.messageType === "invitation_request")
    ).length,
    received: data.filter(
      (req: any) =>
        (req.contributor._id === userId &&
          req.messageType === "invitation_request") ||
        (req.contributor._id !== userId &&
          req.messageType === "collaboration_request")
    ).length,
  };

  // Filter, delete and sort requests
  const processedRequests = [...data]
    .filter((req: any) => {
      if (currentTab === 1) {
        // Sent
        return (
          (req.contributor._id === userId &&
            req.messageType === "collaboration_request") ||
          (req.contributor._id !== userId &&
            req.messageType === "invitation_request")
        );
      }
      if (currentTab === 2) {
        // Received
        return (
          (req.contributor._id === userId &&
            req.messageType === "invitation_request") ||
          (req.contributor._id !== userId &&
            req.messageType === "collaboration_request")
        );
      }
      return true; // All
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return a.status.localeCompare(b.status);
    });

  if (error) {
    toast.error("Failed to load requests.");
    return null;
  }

  const handleDelete = () => {
    batchDeleteMutation.mutate(selectedRequests);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "lg", mx: "auto", p: 2 }}>
      {/* Header Controls */}
      <HeaderControls
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        counts={counts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedRequests={selectedRequests}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        onOpenDeleteModal={() => setOpenDeleteModal(true)}
      />

      {/* Request List */}
      {isFetching ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={100} />
          ))}
        </Stack>
      ) : processedRequests.length === 0 ? (
        <Stack alignItems="center" spacing={2} mt={4}>
          <Typography color="text.secondary">No requests found</Typography>
        </Stack>
      ) : (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            ...(viewMode === "compact" && {
              "& .MuiListItem-root": {
                py: 1,
              },
            }),
          }}
        >
          {processedRequests.map((req) => {
            const displayInfo = getRequestDisplayInfo(req, userId);

            return (
              <RequestCard
                key={req._id}
                request={req}
                viewMode={viewMode}
                isSelectionMode={isSelectionMode}
                selectedRequests={selectedRequests}
                onToggleSelect={handleToggleSelect}
                displayInfo={displayInfo}
                setValue={setValue}
              />
            );
          })}
          {openDeleteModal && (
            <ResponsiveDialog
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              title="Confirm Request Deletion"
              message="Are you sure you want to delete these requests? This action is permanent and cannot be undone."
              handleDelete={handleDelete}
              rightButtonColor="error"
            />
          )}
        </List>
      )}
    </Box>
  );
};

export default InboxTab;
