import { IconButton, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";
import { DropBox } from "../../../common/DropBox/DropBox";
import { uploadFile } from "../../../../core/services/api/manage-fileupload.api";

interface ProfileDetailsFormProps {
  openBadgesModal: boolean;
  handleClose: () => void;
  profileTabInfo: User;
  handleProfileInfo: (updatedInfo: User) => void;
  developer: User | undefined;
}

interface FormValues {
  badges: string[];
}

export default function BadgesForm({
  openBadgesModal,
  handleClose,
  profileTabInfo,
  handleProfileInfo,
  developer,
}: ProfileDetailsFormProps) {
  const theme = useTheme();
  const [badges, setBadges] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser: { id: string; data: any }) =>
      updateUserInfo(updatedUser.id, updatedUser.data),

    onSuccess: (response: any) => {
      if (response) {
        toast.success("Your account information updated successfully!");
        setBadges([]);
        queryClient.invalidateQueries({
          queryKey: ["getUserById", developer?._id],
        });
        queryClient.refetchQueries({
          queryKey: ["getUserById", developer?._id],
        });
        handleProfileInfo(response);
      }
    },
  });

  const badgesUploadMutation = useMutation({
    mutationFn: (data: { userId: string; file: File[] }) =>
      uploadFile(data.userId, data.file, "badges"),
    onSuccess: () => {
      toast.success("Badge uploaded successfully!");
    },
  });

  const handleBadgesDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setBadges((prev) => [...prev, ...acceptedFiles]);
    }
  }, []);

  const handleBadgesDelete = useCallback(
    (index: number) => {
      setBadges((prevBadges) => {
        const updatedBadges = [...prevBadges];
        updatedBadges.splice(index, 1);
        return updatedBadges;
      });
    },
    [developer?.badges]
  );

  const { handleSubmit } = useForm<FormValues>({
    defaultValues: {
      badges: profileTabInfo.badges,
    },
  });

  const onSubmit = async () => {
    try {
      if (!developer?._id) {
        return;
      }

      const userId = developer._id;
      let badgeKey;
      if (badges) {
        const BadgesUpload = await badgesUploadMutation.mutateAsync({
          userId,
          file: badges,
        });
        badgeKey = BadgesUpload.data;
      }

      const updatedProfileTabInfo = {
        ...developer,
        badges: [...badgeKey, ...developer.badges],
      };
      mutation.mutate({ id: userId, data: updatedProfileTabInfo });
    } catch (error) {
      toast.error("Something went wrong. Please try later!");
    }
  };

  return (
    <CustomModal
      open={openBadgesModal}
      handleClose={() => handleClose()}
      framesx={{
        width: 600,
      }}
      headersx={{
        borderBottom: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
      }}
      title="Badges"
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ToastContainer />
        <Box sx={{ mb: 3 }}>
          <DropBox onDrop={handleBadgesDrop} />
          {(badges || developer?.badges) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-between",
                mt: 2,
                borderColor: "divider",
                width: "100%",
              }}
            >
              {badges.map((badge, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                      p: 2,
                      border: "1px solid red",
                      borderColor: "divider",
                      width: "100%",
                    }}
                  >
                    <Box>
                      <Box
                        component="span"
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "text.secondary"
                              : "border.secondary",
                        }}
                      >
                        {badges
                          ? badge.name
                          : developer?.badges[index].split("-").slice(-1)[0]}
                      </Box>
                      {badges && (
                        <Box
                          component="span"
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? "text.secondary"
                                : "border.secondary",
                            ml: "8px",
                          }}
                        >
                          ({Math.round(badge.size / 1024)} KB)
                        </Box>
                      )}
                    </Box>
                    <IconButton
                      onClick={() => handleBadgesDelete(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        <CustomButton
          leftButtonsx={{
            borderTop: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "secondary.main"
                : "border.secondary",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          righButtonText="Upload"
        />
      </Box>
    </CustomModal>
  );
}
