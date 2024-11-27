import { useRef, ChangeEvent, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";

import ErrorFallback from "../../../common/ErrorFallback/ErrorFallback";
import { UserAccounInputData } from "../../../../configs/data/UserAccounInputData";
import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Input from "../../../common/Input/Input";
import { DropBox } from "../../../common/DropBox/DropBox";
import {
  deleteUploadedFile,
  uploadFile,
} from "../../../../core/services/api/manage-fileupload.api";
import ResponsiveDialog from "../../../common/CustomModal/ConfirmationModal";

interface AccountDetailsFormProps {
  open: boolean;
  handleClose: () => void;
  developer: User | undefined;
  handleProfileInfo: () => void;
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
  handleProfileInfo,
}: AccountDetailsFormProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [avatar, setAvatar] = useState<File[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [resume, setResume] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState(
    `http://localhost:8080/public/userProfileImages/${developer?.avatar}`
  );
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Function to handle file selection
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;
      if (file) {
        setPreviewURL(URL.createObjectURL(file[0]));
        const fileArray: File[] = Array.from(file);
        setAvatar(fileArray);
      }
    },
    []
  );

  const handleResumeDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setResume(acceptedFiles[0]);
    }
  }, []);

  const handleResumeDelete = useCallback(() => {
    // If there's a fileKey in developer.resume, always open the modal
    if (developer?.resume?.fileKey) {
      setOpenDeleteModal(true);
    } else {
      // Only clear the resume state if there's no fileKey
      setResume(null);
    }
  }, [developer?.resume?.fileKey]);

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUploadedFile(userId),
    onSuccess: () => {
      toast.success("Resume deleted successfully.");
      setOpenDeleteModal(false);
      // Clear the resume state after successful deletion
      setResume(null);
      queryClient.invalidateQueries({
        queryKey: ["getUserById", developer?._id],
      });
      queryClient.refetchQueries({
        queryKey: ["getUserById", "resume", developer?._id],
      });
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
    deleteMutation.mutate(developer._id);
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
  });

  const mutation = useMutation({
    mutationFn: (updatedUser: { id: string; data: any }) =>
      updateUserInfo(updatedUser.id, updatedUser.data),

    onSuccess: (response: any) => {
      if (response) {
        toast.success("Your account information updated successfully!");
        queryClient.invalidateQueries({
          queryKey: [
            ["updateProject", response?.data?._id],
            ["getUserById", "resume", developer?._id],
          ],
        });
        handleProfileInfo();
      }
      queryClient.refetchQueries({
        queryKey: [
          ["updateProject", response?.data?._id],
          ["getUserById", "resume", developer?._id],
        ],
      });
    },
  });

  const resumeUploadMutation = useMutation({
    mutationFn: (data: { userId: string; file: File }) =>
      uploadFile(data.userId, data.file),
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
      queryClient.invalidateQueries({
        queryKey: ["getUserById", "resume", developer?._id],
      });
      queryClient.refetchQueries({
        queryKey: ["getUserById", "resume", developer?._id],
      });
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const updatedProfileTabInfo = {
        ...developer,
        ...data,
        avatar: avatar[0] || data.avatar,
      };

      const formData = createFormData(updatedProfileTabInfo, undefined, {
        file: [updatedProfileTabInfo?.avatar],
        name: "avatar",
      });

      const userId: string = updatedProfileTabInfo._id;

      mutation.mutate({ id: userId, data: formData });
      if (resume) {
        resumeUploadMutation.mutate({
          userId,
          file: resume,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CustomModal
        open={open}
        handleClose={() => handleClose()}
        framesx={{
          width: 600,
          border: "2px solid #000",
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
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <ToastContainer />
          <Box>
            {/* Avatar image */}
            {developer?.avatar !== "" && (
              <>
                <label htmlFor="avatar" style={{ cursor: "pointer" }}>
                  <Box
                    sx={{
                      width: "5.5rem",
                      height: "5.5rem",
                      borderRadius: "50%",
                      display: "inline-block",
                      overflow: "hidden",
                      position: "relative",
                      top: "-0.9rem",
                      left: "50%",
                      transform: "translatex(-50%)",
                      outline: "none",
                      backgroundColor: "grey",
                    }}
                  >
                    <img
                      src={previewURL}
                      alt="Avatar"
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        outline: "none",
                      }}
                    />
                    <input
                      id="avatar"
                      type="file"
                      style={{ display: "none", outline: "none" }}
                      required={false}
                      {...register("avatar", { required: true })}
                      onChange={(e) => handleFileChange(e)}
                      ref={fileInputRef}
                    />
                  </Box>
                </label>
              </>
            )}
          </Box>
          {UserAccounInputData.map((data) => (
            <Box sx={{ mb: 3 }} key={uuidv4()}>
              <Input
                id={data.id}
                ty={data.type}
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
          {/* here */}
          <Box sx={{ mb: 3 }}>
            <DropBox onDrop={handleResumeDrop} />
            {(resume || developer?.resume?.fileKey) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <span>
                    {resume
                      ? resume.name
                      : developer?.resume?.fileKey.split("-").slice(-1)[0]}
                  </span>
                  {resume && (
                    <span style={{ marginLeft: "8px", color: "gray" }}>
                      ({Math.round(resume.size / 1024)} KB)
                    </span>
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
