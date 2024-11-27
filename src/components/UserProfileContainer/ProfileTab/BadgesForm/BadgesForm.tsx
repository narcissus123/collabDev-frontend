import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { User } from "../../../../configs/types/userTypes";
import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
import CustomButton from "../../../common/CustomButton/CustomButton";
import CustomModal from "../../../common/CustomModal/CustomModal";

interface ProfileDetailsFormProps {
  openBadgesModal: boolean;
  handleClose: () => void;
  profileTabInfo: User;
  handleProfileInfo: (userInfo: User) => void;
}

interface FormValues {
  badges: string[];
}

export default function BadgesForm({
  openBadgesModal,
  handleClose,
  profileTabInfo,
  handleProfileInfo,
}: ProfileDetailsFormProps) {
  const theme = useTheme();

  const [multipleImages, setMultipleImages] = useState<File[]>([]);
  // const [multipleImages, setMultipleImages] = useState<File[]>(
  //   profileTabInfo.badges?.map((badge) => new File([], badge)) || []
  // );
  const changeMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray: File[] = Array.from(files);
      setMultipleImages((prevImages: File[]) => [...prevImages, ...fileArray]);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      badges: profileTabInfo.badges,
    },
  });

  const onSubmit = async () => {
    try {
      const updatedProfileTabInfo = {
        ...profileTabInfo,
      };
      const formData = createFormData(
        updatedProfileTabInfo,
        { files: multipleImages, name: "badges" },
        { file: [updatedProfileTabInfo?.avatar], name: "avatar" }
      );

      // Log the FormData content
      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = (await updateUserInfo(
        updatedProfileTabInfo._id,
        formData
      )) as any;

      if (response) {
        toast.success("Your badges board updated successfully!");
        handleProfileInfo(response);
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("You are not signed in! Please sign in.");
        }
      }
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
        border: "2px solid #000",
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
        <label>
          Badges form
          <input
            key="1"
            id="badges"
            type="file"
            accept="image/*"
            multiple={true}
            placeholder=""
            required={false}
            {...register("badges", { required: true })}
            onChange={changeMultipleFiles}
          />
        </label>
        {errors.badges && <p className="error">Please select an image</p>}
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

// ///////////////////////////////
// // import { IconButton, Stack, Typography, useTheme } from "@mui/material";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import Box from "@mui/material/Box";
// // import { useForm } from "react-hook-form";
// // import { ToastContainer, toast } from "react-toastify";

// // import { User } from "../../../../configs/types/userTypes";
// // import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
// // import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";
// // import CustomButton from "../../../common/CustomButton/CustomButton";
// // import CustomModal from "../../../common/CustomModal/CustomModal";
// // import { DropBox } from "../../../common/DropBox/DropBox";
// // import { useFormContext } from "../../../../context/FormContext/FormContext";
// // import { useDragAndDrop } from "../../../../hooks/useDragAndDrop";
// // import { useState } from "react";

// // interface ProfileDetailsFormProps {
// //   openBadgesModal: boolean;
// //   handleClose: () => void;
// //   profileTabInfo: User;
// //   handleProfileInfo: (userInfo: User) => void;
// // }

// // interface FormValues {
// //   badges: string[];
// // }

// // export default function BadgesForm({
// //   openBadgesModal,
// //   handleClose,
// //   profileTabInfo,
// //   handleProfileInfo,
// // }: ProfileDetailsFormProps) {
// //   const theme = useTheme();

// //   // const { data, updateFormData } = useFormContext();

// //   // const { handleSubmit, setValue } = useForm<ProjectForm>({
// //   //   defaultValues: getDefaultValues(data),
// //   // });

// //   const {
// //     setValue,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm<FormValues>({
// //     defaultValues: {
// //       badges: profileTabInfo.badges,
// //     },
// //   });

// //   // Saving image from the file system.
// //   // const multipleImages = true;
// //   // const [onScreenshotDrop, screenshotImages] = useDragAndDrop(
// //   //   multipleImages,
// //   //   setValue,
// //   //   "badges",
// //   //   data.badges
// //   // );

// //   const [multipleImages, setMultipleImages] = useState<File[]>([]);

// //   const changeMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = e.target.files;
// //     if (files) {
// //       const fileArray: File[] = Array.from(files);
// //       setMultipleImages((prevImages: File[]) => [...prevImages, ...fileArray]);
// //     }
// //   };

// //   const onSubmit = async () => {
// //     try {
// //       const updatedProfileTabInfo = {
// //         ...profileTabInfo,
// //       };
// //       const formData = createFormData(
// //         updatedProfileTabInfo,
// //         { files: multipleImages, name: "badges" },
// //         { file: [updatedProfileTabInfo?.avatar], name: "avatar" }
// //       );

// //       const response = (await updateUserInfo(
// //         updatedProfileTabInfo._id,
// //         formData
// //       )) as any;

// //       if (response) {
// //         toast.success("Your badges board updated successfully!");
// //         handleProfileInfo(response);
// //       } else {
// //         if (response.status === 400 || response.status === 403) {
// //           toast.error("You are not signed in! Please sign in.");
// //         }
// //       }
// //     } catch (error) {
// //       toast.error("Something went wrong. Please try later!");
// //     }
// //   };

// //   return (
// //     <CustomModal
// //       open={openBadgesModal}
// //       handleClose={() => handleClose()}
// //       framesx={{
// //         width: 600,
// //         border: "2px solid #000",
// //       }}
// //       headersx={{
// //         borderBottom: "1px solid",
// //         borderColor:
// //           theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
// //       }}
// //       title="Badges"
// //     >
// //       <ToastContainer/>
// //        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
// //        <Box sx={{ mb: 3 }}>
// //             <DropBox onDrop={handleResumeDrop} />
// //             {(resume || developer?.resume?.fileKey) && (
// //               <Box
// //                 sx={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "space-between",
// //                   mt: 2,
// //                   p: 2,
// //                   border: "1px solid",
// //                   borderColor: "divider",
// //                 }}
// //               >
// //                 <Box>
// //                   <span>
// //                     {resume
// //                       ? resume.name
// //                       : developer?.resume?.fileKey.split("-").slice(-1)[0]}
// //                   </span>
// //                   {resume && (
// //                     <span style={{ marginLeft: "8px", color: "gray" }}>
// //                       ({Math.round(resume.size / 1024)} KB)
// //                     </span>
// //                   )}
// //                 </Box>
// //                 <IconButton
// //                   onClick={handleResumeDelete}
// //                   color="error"
// //                   size="small"
// //                 >
// //                   <DeleteIcon />
// //                 </IconButton>
// //               </Box>
// //             )}
// //           </Box>
// //     </Box>
// //     </CustomModal>
// //   );
// // }

// import { useTheme } from "@mui/material";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { ToastContainer, toast } from "react-toastify";

// import { User } from "../../../../configs/types/userTypes";
// import { updateUserInfo } from "../../../../core/services/api/manage-user.api";
// import CustomButton from "../../../common/CustomButton/CustomButton";
// import CustomModal from "../../../common/CustomModal/CustomModal";
// import { DropBox } from "../../../common/DropBox/DropBox";
// import { createFormData } from "../../../../core/utils/CreateFormData/createFormData";

// interface ProfileDetailsFormProps {
//   openBadgesModal: boolean;
//   handleClose: () => void;
//   profileTabInfo: User;
//   handleProfileInfo: (userInfo: User) => void;
// }

// interface FormValues {
//   badges: string[];
// }

// export default function BadgesForm({
//   openBadgesModal,
//   handleClose,
//   profileTabInfo,
//   handleProfileInfo,
// }: ProfileDetailsFormProps) {
//   const theme = useTheme();
//   const [badgeImages, setBadgeImages] = useState<File[]>(
//     profileTabInfo.badges?.map((badge) => new File([], badge)) || []
//   );

//   const {
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       badges: profileTabInfo.badges,
//     },
//   });

//   const handleBadgeDrop = (acceptedFiles: File[]) => {
//     setBadgeImages((prev) => [...prev, ...acceptedFiles]);
//     setValue(
//       "badges",
//       acceptedFiles.map((file) => file.name)
//     );
//   };

//   const handleDeleteBadge = (index: number) => {
//     setBadgeImages((prev) => {
//       const updated = [...prev];
//       updated.splice(index, 1);
//       return updated;
//     });
//     setValue(
//       "badges",
//       badgeImages.filter((_, i) => i !== index).map((file) => file.name)
//     );
//   };

//   // Update the mutation configuration
//   // const mutation = useMutation({
//   //   mutationFn: async (data: { id: string; formData: FormData }) => {
//   //     const response = await updateUserInfo(data.id, data.formData);
//   //     return response;
//   //   },
//   //   onSuccess: (response) => {
//   //     toast.success("Your badges board updated successfully!");
//   //     handleProfileInfo(response);
//   //     handleClose();
//   //   },
//   //   onError: (error: any) => {
//   //     console.error("Error details:", error);
//   //     if (error.response?.status === 400 || error.response?.status === 403) {
//   //       toast.error("You are not signed in! Please sign in.");
//   //     } else {
//   //       toast.error("Something went wrong. Please try later!");
//   //     }
//   //   },
//   // });

//   // const onSubmit = async () => {
//   //   try {
//   //     // Create FormData object directly
//   //     const formData = new FormData();

//   //     // Append the basic user info
//   //     (Object.keys(profileTabInfo) as Array<keyof User>).forEach((key) => {
//   //       if (key !== "badges" && key !== "avatar") {
//   //         const value = profileTabInfo[key];
//   //         if (value !== undefined && value !== null) {
//   //           formData.append(key, String(value));
//   //         }
//   //       }
//   //     });

//   //     // Append each badge file
//   //     badgeImages.forEach((file) => {
//   //       formData.append("badges", file);
//   //     });

//   //     // If there's an avatar, append it
//   //     if (profileTabInfo.avatar) {
//   //       formData.append("avatar", profileTabInfo.avatar);
//   //     }

//   //     mutation.mutate({
//   //       id: profileTabInfo._id,
//   //       formData: formData,
//   //     });
//   //   } catch (error) {
//   //     toast.error("Something went wrong. Please try later!");
//   //   }
//   // };

//   const onSubmit = async () => {
//     try {
//       const updatedProfileTabInfo = {
//         ...profileTabInfo,
//       };
//       const formData = createFormData(
//         updatedProfileTabInfo,
//         { files: badgeImages, name: "badges" },
//         { file: [updatedProfileTabInfo?.avatar], name: "avatar" }
//       );

//       const response = (await updateUserInfo(
//         updatedProfileTabInfo._id,
//         formData
//       )) as any;

//       if (response) {
//         toast.success("Your badges board updated successfully!");
//         handleProfileInfo(response);
//       } else {
//         if (response.status === 400 || response.status === 403) {
//           toast.error("You are not signed in! Please sign in.");
//         }
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try later!");
//     }
//   };

//   return (
//     <CustomModal
//       open={openBadgesModal}
//       handleClose={handleClose}
//       framesx={{
//         width: 600,
//         border: "2px solid #000",
//       }}
//       headersx={{
//         borderBottom: "1px solid",
//         borderColor:
//           theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
//       }}
//       title="Badges"
//     >
//       <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
//         <ToastContainer />

//         <Box
//           sx={{
//             border: "1px solid",
//             borderColor: theme.palette.mode === "dark" ? "#33c0ee" : "#B9B9BF",
//             mb: 3,
//           }}
//         >
//           <DropBox onDrop={handleBadgeDrop} />
//         </Box>

//         <Stack
//           direction="row"
//           flexWrap="wrap"
//           gap={2}
//           sx={{
//             p: 1,
//             overflowX: "auto",
//           }}
//         >
//           {badgeImages.map((image, index) => (
//             <Box key={index} position="relative">
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt={`Badge ${index + 1}`}
//                 style={{
//                   maxWidth: "100px",
//                   maxHeight: "100px",
//                   objectFit: "cover",
//                 }}
//               />
//               <IconButton
//                 sx={{
//                   position: "absolute",
//                   top: 0,
//                   right: 0,
//                   zIndex: 1,
//                   backgroundColor: "rgba(255, 255, 255, 0.5)",
//                   color: "#d32f2f",
//                   boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
//                   borderRadius: "50%",
//                   padding: "4px",
//                   transition: "background-color 0.3s ease",
//                   "&:hover": {
//                     backgroundColor: "#d32f2f",
//                     color: "#ffffff",
//                   },
//                 }}
//                 onClick={() => handleDeleteBadge(index)}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           ))}
//         </Stack>

//         {errors.badges && (
//           <Box sx={{ color: "error.main", mt: 1, ml: 1 }}>
//             Please select at least one badge
//           </Box>
//         )}

//         <CustomButton
//           leftButtonsx={{
//             borderTop: "1px solid",
//             borderColor:
//               theme.palette.mode === "dark"
//                 ? "secondary.main"
//                 : "border.secondary",
//             justifyContent: "flex-end",
//             alignItems: "center",
//           }}
//           righButtonText="Upload"
//         />
//       </Box>
//     </CustomModal>
//   );
// }
