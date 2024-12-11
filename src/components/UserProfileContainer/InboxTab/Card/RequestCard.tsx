import { useState } from "react";
import {
  Stack,
  Typography,
  Avatar,
  Button,
  Checkbox,
  Box,
  useTheme,
  Divider,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ResponsiveDialog from "../../../common/CustomModal/ConfirmationModal";
import formattedDate from "../../../../core/utils/DateFormatter/formatDate";
import {
  acceptRequestById,
  rejectRequestById,
} from "../../../../core/services/api/manage-requests.api";
import { getImageUrl } from "../../../../core/utils/ImageUtils/imageUtils";

interface RequestCardProps {
  request: any;
  viewMode: "list" | "compact";
  isSelectionMode: boolean;
  selectedRequests: string[];
  onToggleSelect: (requestId: string) => void;
  displayInfo: {
    mainUser: {
      id: string;
      name: string;
      avatar: string;
    };
    requestType: string;
    isSentByMe: boolean;
    status: string;
  };
  setValue: (value: string) => void;
}

const RequestCard = ({
  request,
  viewMode,
  isSelectionMode,
  selectedRequests,
  onToggleSelect,
  displayInfo,
  setValue,
}: RequestCardProps) => {
  const theme = useTheme();
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [openAcceptModal, setOpenAcceptModal] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const { mainUser, requestType, isSentByMe, status } = displayInfo;

  const acceptRequestMUtation = useMutation({
    mutationFn: (requestId: string) => acceptRequestById(requestId),
    onSuccess: () => {
      toast.success("Request accepted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["getUserRequests", userId],
      });
      setOpenAcceptModal(false);
    },
    onError: (err) => {
      toast.error("Failed to accept the request.");
      console.error("Error:", err);
    },
  });

  const rejectRequestMUtation = useMutation({
    mutationFn: (requestId: string) => rejectRequestById(requestId),
    onSuccess: () => {
      toast.success("Requests rejected successfully");
      queryClient.invalidateQueries({
        queryKey: ["getUserRequests", userId],
      });
      setOpenRejectModal(false);
    },
    onError: (err) => {
      toast.error("Failed to reject the request");
      console.error("Error:", err);
    },
  });

  const handleAccept = (requestId: string) => {
    acceptRequestMUtation.mutate(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectRequestMUtation.mutate(requestId);
  };

  return (
    <Box>
      <Stack
        sx={{
          p: viewMode === "compact" ? 1 : 2,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {/* Main request info */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-start"
          width="100%"
        >
          {isSelectionMode && (
            <Checkbox
              checked={selectedRequests.includes(request._id)}
              onChange={() => onToggleSelect(request._id)}
              size={viewMode === "compact" ? "small" : "medium"}
            />
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <Link to={`/profile/${mainUser.id}`}>
                <Avatar
                  alt={mainUser.name}
                  src={getImageUrl(mainUser.avatar)}
                  sx={{
                    width: viewMode === "compact" ? 32 : 40,
                    height: viewMode === "compact" ? 32 : 40,
                  }}
                />
              </Link>
              <Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant={viewMode === "compact" ? "subtitle1" : "h6"}
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "primary.main"
                          : "black",
                    }}
                  >
                    {isSentByMe
                      ? `To: ${mainUser.name}`
                      : `From: ${mainUser.name}`}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: "grey.100",
                      color: "grey.800",
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      display: "flex",
                      direction: "row",
                      alignItems: "center",
                    }}
                  >
                    {requestType}
                    <Typography component="span" sx={{ px: 1 }}>
                      -
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        ...(() => {
                          switch (status) {
                            case "pending":
                              return { color: "warning.dark" };
                            case "accepted":
                              return { color: "success.light" };
                            case "rejected":
                              return { color: "error.dark" };
                            default:
                              return { color: "grey.800" };
                          }
                        })(),
                      }}
                    >
                      {status === "accepted"
                        ? "Accepted"
                        : status === "rejected"
                          ? "Declined"
                          : "Pending"}
                    </Typography>
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {formattedDate(request.createdAt)}
                </Typography>
              </Stack>
            </Stack>

            {/* Status badge for accepted requests */}
            {status === "accepted" && (
              <Typography
                component="span"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: "success.light",
                  color: "white",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
                onClick={() => setValue("4")}
              >
                Chat Available
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Message */}
        <Typography
          variant="body2"
          sx={{
            mt: viewMode === "compact" ? 1 : 2,
            ml: viewMode === "compact" ? 6 : 7,
            color: "text.secondary",
            fontSize: viewMode !== "compact" ? "0.87rem" : "inherit",
          }}
        >
          {request.message}
        </Typography>

        {/* Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, ml: viewMode === "compact" ? 6 : 7 }}
        >
          <Link
            to={`/projects/${request.project}`}
            style={{
              textDecoration: "none",
              marginLeft: "-0.5rem",
            }}
          >
            <Button
              size={viewMode === "compact" ? "small" : "medium"}
              endIcon={<LaunchIcon />}
            >
              View Project
            </Button>
          </Link>

          {!isSentByMe && status === "pending" ? (
            <Stack direction="row" spacing={1}>
              <Button
                size={viewMode === "compact" ? "small" : "medium"}
                variant="contained"
                onClick={() => setOpenAcceptModal(true)}
              >
                Accept
              </Button>
              <Button
                size={viewMode === "compact" ? "small" : "medium"}
                variant="outlined"
                onClick={() => setOpenRejectModal(true)}
              >
                Decline
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Stack>

      {/* Modals */}
      {openRejectModal && (
        <ResponsiveDialog
          openDeleteModal={openRejectModal}
          setOpenDeleteModal={setOpenRejectModal}
          title="Reject Request"
          message={`Are you sure that you want to reject
            ${
              request.messageType === "invitation_request"
                ? request.owner.name
                : request.contributor.name
            }
            request. This action cannot be undone.`}
          handleDelete={() => handleReject(request._id)}
          rightButtonColor="error"
          textButton="Reject"
        />
      )}
      {openAcceptModal && (
        <ResponsiveDialog
          openDeleteModal={openAcceptModal}
          setOpenDeleteModal={setOpenAcceptModal}
          title="Accept Request"
          message={`By accepting this request, you'll be able to start a conversation with 
            ${
              request.messageType === "invitation_request"
                ? request.owner.name
                : request.contributor.name
            }, discuss project details, and explore collaboration opportunities. This action cannot be undone.`}
          handleDelete={() => handleAccept(request._id)}
          rightButtonColor="success"
          textButton="Acccept"
        />
      )}
      <Divider />
    </Box>
  );
};

export default RequestCard;
