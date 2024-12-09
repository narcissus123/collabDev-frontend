import { Box } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { ChangeEvent, Ref, useEffect } from "react";
import { UseFormRegister } from "react-hook-form";

interface AvatarUploadProps {
  previewURL: string;
  imageError: boolean;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: Ref<HTMLInputElement>;
  register: UseFormRegister<any>;
  userName?: string;
  setImageError: (value: boolean) => void;
}

const getInitials = (name: string): string => {
  if (!name) return "";
  const names = name.split(" ");
  return names
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
};

const AvatarUpload = ({
  previewURL,
  imageError,
  handleFileChange,
  setImageError,
  fileInputRef,
  register,
  userName = "",
}: AvatarUploadProps) => {
  return (
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
              {getInitials(userName ? getInitials(userName) : "")}
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
            {...register("avatar", {
              required: false,
              onChange: (e) => {
                handleFileChange(e);
              },
            })}
            ref={fileInputRef}
          />
        </Box>
      </label>
    </Box>
  );
};

export default AvatarUpload;
