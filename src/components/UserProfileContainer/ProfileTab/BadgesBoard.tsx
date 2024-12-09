import { useCallback, useEffect, useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Checkbox,
  Zoom,
  Tooltip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { User } from "../../../configs/types/userTypes";
import { deleteUploadedFile } from "../../../core/services/api/manage-fileupload.api";
import { updateUserInfo } from "../../../core/services/api/manage-user.api";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import BadgesForm from "./BadgesForm/BadgesForm";

interface ProfileDetailsFormProps {
  openBadgesModal: boolean;
  handleClose: () => void;
  profileTabInfo: User | undefined;
  developer: User | undefined;
}

const BadgesBoard = ({
  profileTabInfo,
  handleClose,
  openBadgesModal,
  developer,
}: ProfileDetailsFormProps) => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<number[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const theme = useTheme();
  const { isProfileOwner } = useAuth();
  const { userId } = useParams();

  const handleDeleteClick = () => {
    setIsDeleteMode(true);
  };

  console.log("https://collabdev-prod-storage-2024.s3.us-east-2.amazonaws.com/${path}", `https://collabdev-prod-storage-2024.s3.us-east-2.amazonaws.com/${path}`)
  const handleBadgeSelect = (index: number) => {
    setSelectedBadges((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedBadges([]);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser: { id: string; data: any }) =>
      updateUserInfo(updatedUser.id, updatedUser.data),

    onSuccess: (response: any) => {
      if (response) {
        toast.success("Your account information updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["getUserById", developer?._id],
        });
        queryClient.refetchQueries({
          queryKey: ["getUserById", developer?._id],
        });
      }
    },
  });

  // Fetch user data after closing badgesForm modal here for better UX.
  useEffect(() => {
    if (shouldRefetch && !openBadgesModal) {
      queryClient.invalidateQueries({
        queryKey: ["getUserById", developer?._id],
      });
      setShouldRefetch(false);
    }
  }, [shouldRefetch, openBadgesModal]);

  const handleFormSuccess = () => {
    setShouldRefetch(true);
  };

  const deleteMutation = useMutation({
    mutationFn: ({ id, badgeIndex }: { id: string; badgeIndex: number }) => {
      if (badgeIndex === null || !developer?.badges) {
        throw new Error("Badge index or developer badges are undefined");
      }

      const badgeKey = developer.badges[badgeIndex];
      return deleteUploadedFile(id, "badges", badgeKey);
    },
    onSuccess: () => {
      toast.success("Badge deleted successfully.");
    },
    onError: (err) => {
      console.error("Something went wrong.");
      throw err;
    },
  });

  const handleBadgesDelete = useCallback(
    (selectedBadgeIndex: number) => {
      if (!developer) {
        console.error("Developer is undefined. Cannot proceed with delete.");
        return;
      }

      deleteMutation.mutate({
        id: developer?._id,
        badgeIndex: selectedBadgeIndex,
      });
    },
    [deleteMutation, developer]
  );

  const handleConfirmDelete = () => {
    if (!developer?.badges) {
      console.error("Developer badges are undefined");
      return;
    }

    selectedBadges.forEach((index) => {
      handleBadgesDelete(index);
    });

    const updatedBadges = developer.badges.filter(
      (_, index) => !selectedBadges.includes(index)
    );

    // Update the user document with the remaining badges
    mutation.mutate({
      id: developer._id,
      data: { ...developer, badges: updatedBadges },
    });

    setIsDeleteMode(false);
    setSelectedBadges([]);
  };

  return (
    <Paper
      sx={{
        width: { sx: "100%", md: "27%" },
        bgcolor:
          theme.palette.mode === "dark" ? "background.secondary" : "#eeeeee",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          p: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            lineHeight: 1.7,
            fontSize: "1rem",
            color: theme.palette.mode === "dark" ? "text.secondary" : "",
          }}
        >
          Badges Board
        </Typography>

        {userId && isProfileOwner(userId) && (
          <Stack direction="row">
            <Zoom in>
              <Tooltip title="Edit Badge" placement="left">
                <IconButton
                  aria-label="edit"
                  sx={{
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={handleClose}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Zoom>
            <Zoom in>
              <Tooltip title="Delete Badge" placement="left">
                <IconButton
                  aria-label="delete"
                  disabled={
                    profileTabInfo?.badges &&
                    profileTabInfo?.badges.length === 0
                  }
                  sx={{
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  color={isDeleteMode ? "error" : "default"}
                  onClick={handleDeleteClick}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Zoom>
          </Stack>
        )}
      </Stack>

      <Stack
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 2,
          height: "100%",
          flex: 1,
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "wrap",
            width: "100%",
            gap: "8px",
            rowGap: "8px",
          }}
        >
          {profileTabInfo?.badges.map(
            (path, index) =>
              path.length > 3 && (
                <Box
                  key={index}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isDeleteMode && (
                    <Checkbox
                      checked={selectedBadges.includes(index)}
                      onChange={() => handleBadgeSelect(index)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        borderRadius: "4px",
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    />
                  )}
                  <img
                    src={`https://collabdev-prod-storage-2024.s3.us-east-2.amazonaws.com/${path}`}
                    alt={`${index}`}
                    width="60px"
                    height="60px"
                    style={{
                      marginRight: "1rem",
                      opacity: isDeleteMode ? 0.9 : 1,
                    }}
                  />
                </Box>
              )
          )}
        </Stack>
      </Stack>

      {isDeleteMode && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
            justifyContent: "center",
            my: 2,
          }}
        >
          <Button variant="outlined" onClick={handleCancelDelete} size="small">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={selectedBadges.length === 0}
            size="small"
          >
            Delete Selected ({selectedBadges.length})
          </Button>
        </Stack>
      )}

      {openBadgesModal && profileTabInfo && (
        <BadgesForm
          openBadgesModal={openBadgesModal}
          handleClose={handleClose}
          profileTabInfo={profileTabInfo}
          onSuccess={handleFormSuccess}
          developer={developer}
        />
      )}
    </Paper>
  );
};

export default BadgesBoard;
