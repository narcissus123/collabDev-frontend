import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemText,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { Request } from "../../../configs/types/requestTypes";
import {
  deleteRequestById,
  getUserRequests,
} from "../../../core/services/api/manage-requests.api";
import formattedDate from "../../../core/utils/DateFormatter/formatDate";
import useFetch from "../../../hooks/useFetch";

import AcceptanceForm from "./Forms/AcceptanceForm";
import RejectionForm from "./Forms/RejectionForm";

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "orange";
    case "accepted":
      return "lightgreen";
    default:
      return "default";
  }
}

const InboxTab = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { userId } = useParams();
  const [openRejectModal, setOpenRejectModal] = useState<string | null>(null);
  const [openAcceptModal, setOpenAcceptModal] = useState<string | null>(null);

  const { data: requests } = useFetch<Request[]>(getUserRequests, userId);

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteRequestById(requestId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <List>
      {requests
        ?.filter((req) => {
          const isCollaborationRequest =
            req.messageType === "collaboration_request";
          const isInvitationRequest = req.messageType === "invitation_request";
          const sentRequests =
            (req.contributor._id !== userId && isInvitationRequest) ||
            (req.contributor._id === userId && isCollaborationRequest);
          const pendingReceivedRequests =
            (req.contributor._id === userId &&
              isInvitationRequest &&
              req.status === "pending") ||
            (req.contributor._id !== userId &&
              isCollaborationRequest &&
              req.status === "pending");
          return sentRequests || pendingReceivedRequests;
        })
        .map((req) => {
          const isCollaborationRequest =
            req.messageType === "collaboration_request";
          const isInvitationRequest = req.messageType === "invitation_request";
          const isSender = userId === req.owner._id;
          const isReceiver = userId === req.contributor._id;
          const sentRequests =
            (req.contributor._id !== userId && isInvitationRequest) ||
            (req.contributor._id === userId && isCollaborationRequest);

          const avatarSrc =
            req.contributor._id !== userId
              ? `http://localhost:8080/public/userProfileImages/${req.contributor.avatar}`
              : `http://localhost:8080/public/userProfileImages/${req.owner.avatar}`;

          const name =
            req.contributor._id !== userId
              ? isInvitationRequest
                ? `To: ${req.contributor.name}`
                : `From: ${req.contributor.name}`
              : isCollaborationRequest
                ? `To: ${req.owner.name}`
                : `From: ${req.owner.name}`;

          return (
            <Box component="form" key={req._id}>
              <Stack
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                px={1}
                py={2.5}
              >
                <Stack
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Stack
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={2}
                  >
                    <Link
                      to={
                        req.contributor._id !== userId
                          ? `/profile/${req.contributor._id}`
                          : `/profile/${req.owner._id}`
                      }
                    >
                      <Avatar alt={name} src={avatarSrc} />
                    </Link>
                    <Stack>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "primary.main"
                              : "black",
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ACACAC" }}>
                        {formattedDate(req.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap={1}
                  >
                    {sentRequests && req.status === "accepted" && (
                      <IconButton
                        aria-label="close"
                        onClick={() => handleDeleteRequest(req._id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                <ListItemText
                  secondary={
                    <Box component="span">
                      <Box mb={2} component="span" sx={{ display: "inline" }}>
                        <Typography
                          variant="body1"
                          component="span"
                          color="text.secondary"
                          sx={{ mt: 1, pl: 4.5, py: 0.5 }}
                        >
                          {req.message}
                        </Typography>
                        <Stack
                          component="span"
                          display="flex"
                          flexDirection="row"
                          flexWrap="wrap"
                          alignItems="center"
                          justifyContent="space-between"
                          width="100%"
                        >
                          {(isCollaborationRequest && isReceiver) ||
                          (isInvitationRequest && isSender) ? (
                            <Stack
                              component="span"
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              justifyContent="flex-start"
                              gap={2}
                              mt={2}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "1rem",
                                  pl: 4.5,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "primary.main"
                                      : "neutral.dark",
                                }}
                              >
                                status:
                              </Typography>
                              <Typography
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  py: 0.5,
                                  px: 2,
                                  width: "auto",
                                  border: "1px solid",
                                  borderColor: getStatusColor(req.status),
                                  borderRadius: "2rem",
                                  color: getStatusColor(req.status),
                                }}
                              >
                                {req.status}
                              </Typography>
                            </Stack>
                          ) : (
                            <Stack
                              component="span"
                              sx={{
                                ml: 4.5,
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "nowrap",
                              }}
                            >
                              <Button
                                type="button"
                                variant="contained"
                                sx={{ mt: 2, mr: 1 }}
                                onClick={() => setOpenAcceptModal(req._id)}
                              >
                                Accept
                              </Button>
                              <Button
                                type="button"
                                sx={{ mt: 2 }}
                                variant="outlined"
                                onClick={() => setOpenRejectModal(req._id)}
                              >
                                Reject
                              </Button>
                            </Stack>
                          )}
                          <Stack
                            component="span"
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                            order={isMediumScreen ? -1 : 1}
                            ml={isMediumScreen ? 4.5 : 0}
                            my={isMediumScreen ? 1 : 0}
                          >
                            <Link
                              style={{
                                textDecoration: "none",
                              }}
                              to={`http://localhost:3000/projects/${req.project}`}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  color:
                                    theme.palette.mode === "dark"
                                      ? "primary.main"
                                      : "neutral.dark",
                                }}
                              >
                                Go to project
                              </Typography>
                            </Link>
                            <LaunchIcon />
                          </Stack>
                        </Stack>
                      </Box>
                      {openRejectModal === req._id && (
                        <RejectionForm
                          openRejectModal={Boolean(openRejectModal)}
                          handleClose={() => setOpenRejectModal(null)}
                          req={req}
                        />
                      )}
                      {openAcceptModal === req._id && (
                        <AcceptanceForm
                          openAcceptModal={Boolean(openAcceptModal)}
                          handleClose={() => setOpenAcceptModal(null)}
                          req={req}
                        />
                      )}
                    </Box>
                  }
                />
              </Stack>
              <Divider sx={{ mx: 2 }} />
            </Box>
          );
        })}
    </List>
  );
};

export default InboxTab;
