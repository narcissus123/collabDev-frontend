import { useRef, ChangeEvent, useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { useForm } from "react-hook-form";
import ErrorFallback from "../../../common/ErrorFallback/ErrorFallback";
import { UserAccounInputData } from "../../../../configs/data/UserAccounInputData";
import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Input from "../../../common/Input/Input";
import { DropBox } from "../../../common/DropBox/DropBox";
import {
  deleteUploadedFile,
  uploadFile,
} from "../../../../core/services/api/manage-fileupload.api";
import ResponsiveDialog from "../../../common/CustomModal/ConfirmationModal";
// import AvatarUpload from "../../../common/Avatar/Avatar";
import { useAuth } from "../../../../context/AuthContext/AuthContext";
import { getImageUrl } from "../../../../core/utils/ImageUtils/imageUtils";

interface AccountDetailsFormProps {
  open: boolean;
  handleClose: () => void;
  developer: User | undefined;
}

interface FormValues {
  name: string;
  bio: string;
  avatar: string;
  email: string;
  resume?: File;
}

export default function AccountDetailsForm({
  open,
  handleClose,
  developer,
}: AccountDetailsFormProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [avatar, setAvatar] = useState<File[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [resume, setResume] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState("");
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState(false);
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    if (developer?.avatar) {
      setPreviewURL(getImageUrl(developer.avatar));
    }
  }, [developer]);

  // Clean up object URL when component unmounts or when previewURL changes
  useEffect(() => {
    return () => {
      if (previewURL && previewURL.startsWith("blob:")) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;
      if (file && file[0]) {
        // Revoke previous object URL if it exists
        if (previewURL && previewURL.startsWith("blob:")) {
          URL.revokeObjectURL(previewURL);
        }
        // Create new preview URL
        const newPreviewURL = URL.createObjectURL(file[0]);
        setPreviewURL(newPreviewURL);
        setImageError(false); // Reset error state when new file is selected
        const fileArray: File[] = Array.from(file);
        setAvatar(fileArray);
      }
    },
    [previewURL]
  );

  const getInitials = (name: string): string => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const mutation = useMutation({
    mutationFn: (updatedUser: { id: string; data: any }) =>
      updateUserInfo(updatedUser.id, updatedUser.data),

    onSuccess: (response: any) => {
      if (response) {
        setCurrentUser(response);
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

  const resumeUploadMutation = useMutation({
    mutationFn: (data: { userId: string; file: File }) =>
      uploadFile(data.userId, data.file, "resume"),
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
    },
  });

  const handleResumeDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setResume(acceptedFiles[0]);
    }
  }, []);

  const handleResumeDelete = useCallback(() => {
    // If there's a fileKey in developer.resume, always open the modal
    if (developer?.resume) {
      setOpenDeleteModal(true);
    } else {
      // Only clear the resume state if there's no fileKey
      setResume(null);
    }
  }, [developer?.resume]);

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => {
      if (!developer?.resume) {
        throw new Error("Developer resume is undefined");
      }
      return deleteUploadedFile(userId, "resume", developer.resume);
    },
    onSuccess: () => {
      toast.success("Resume deleted successfully.");
      setOpenDeleteModal(false);
    },
    onError: (err) => {
      console.error("Something went wrong.");
      throw err;
    },
  });

  const handleDelete = useCallback(() => {
    if (!developer) {
      console.error("Developer is undefined. Cannot proceed with delete.");
      return;
    }
    deleteMutation.mutate(developer?._id);
    mutation.mutate({ id: developer?._id, data: { resume: "" } });
    setResume(null);
  }, [deleteMutation, developer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: developer?.name,
      bio: developer?.bio,
      avatar: developer?.avatar,
      email: developer?.email,
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: any) => {
    try {
      if (!developer?._id) {
        return;
      }

      const userId = developer._id;
      let avatarKey, resumeKey;
      const updateData: any = { ...developer, ...data };

      if (avatar[0]) {
        const avatarUpload = await uploadFile(userId, avatar[0], "avatars");
        avatarKey = avatarUpload.data[0];
        updateData.avatar = avatarKey;
      } else {
        // Don't include avatar in update if no new avatar
        delete updateData.avatar;
      }

      if (resume) {
        const resumeUpload = await resumeUploadMutation.mutateAsync({
          userId,
          file: resume,
        });
        resumeKey = resumeUpload.data[0];
        updateData.resume = resumeKey;
      }

      mutation.mutate({ id: userId, data: updateData });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => console.error("Error boundary caught:", error)}
    >
      <CustomModal
        open={open}
        handleClose={() => handleClose()}
        framesx={{
          width: 600,
        }}
        headersx={{
          borderBottom: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "secondary.main"
              : "border.secondary",
        }}
        title="Account Details"
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: "-3rem",
            alignItems: "space-between",
          }}
        >
          <Box>
            {/* Avatar image */}
            <Box>
              <label htmlFor="avatar" style={{ cursor: "pointer" }}>
                <Box
                  sx={{
                    width: "5.5rem",
                    height: "5.5rem",
                    borderRadius: "50%",
                    display: "inline-block",
                    overflow: "hidden",
                    position: "relative",
                    top: "-0.2rem",
                    left: "50%",
                    transform: "translatex(-50%)",
                    outline: "none",
                    backgroundColor: "grey",
                  }}
                >
                  {imageError || !previewURL ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#bdbdbd",
                        color: "white",
                        fontSize: "2rem",
                      }}
                    >
                      {getInitials(
                        developer?.name ? getInitials(developer?.name) : ""
                      )}
                    </span>
                  ) : (
                    <img
                      src={previewURL}
                      alt="Avatar"
                      onError={() => setImageError(true)}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        outline: "none",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "6px",
                      right: "29px",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      padding: "2px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    <AddPhotoAlternateIcon />
                  </Box>
                  <input
                    id="avatar"
                    type="file"
                    style={{ display: "none", outline: "none" }}
                    {...register("avatar", { required: false })}
                    onChange={(e) => handleFileChange(e)}
                    ref={fileInputRef}
                  />
                </Box>
              </label>
            </Box>
          </Box>
          {UserAccounInputData.map((data) => (
            <Box sx={{ mb: 3 }} key={uuidv4()}>
              <Input
                id={data.id}
                ty={data.type}
                formLabel={true}
                placeholder={data.placeholder}
                labelText={data.labelText}
                sx={data.sx}
                margin={data.margin as "normal" | "dense"}
                inputSize={isMediumScreen ? "small" : "medium"}
                required={data.required}
                fullWidth={data.fullWidth}
                multiline={data.multiline}
                variant={data.variant as "standard" | "outlined" | "filled"}
                errors={errors}
                {...(register &&
                  register(data.register.name as "email" | "name" | "bio", {
                    ...data.register.schema,
                  }))}
              />
            </Box>
          ))}
          <Box sx={{ mb: 3 }}>
            <DropBox onDrop={handleResumeDrop} />
            {(resume || developer?.resume) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
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
                    {resume
                      ? resume.name
                      : developer?.resume.split("-").slice(-1)[0]}
                  </Box>
                  {resume && (
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
                      ({Math.round(resume.size / 1024)} KB)
                    </Box>
                  )}
                </Box>
                <IconButton
                  onClick={handleResumeDelete}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
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
            righButtonText="Edit"
            type="button"
          />
        </Box>
      </CustomModal>

      {openDeleteModal && (
        <ResponsiveDialog
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          title="Confirm Resume Deletion"
          message="Deleting this resume will remove it permanently. Do you want to proceed?"
          handleDelete={handleDelete}
          rightButtonColor="error"
        />
      )}
    </ErrorBoundary>
  );
}
