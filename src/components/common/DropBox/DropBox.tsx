import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useDropzone } from "react-dropzone";

interface DropBoxProps {
  onDrop: (acceptedFiles: File[]) => void;
  maxFiles?: number;
}

const DropBox = ({ onDrop, maxFiles = 30 }: DropBoxProps) => {
  const theme = useTheme();
  const { getRootProps, getInputProps, isDragAccept, acceptedFiles } =
    useDropzone({
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      onDrop,
      noClick: false,
      autoFocus: false,
      multiple: true,
      maxFiles,
    });

  return (
    <div
      style={{
        margin: "auto",
        height: "4/5",
        width: "11/12",
        border: "1px solid #ccc",
      }}
    >
      <div
        {...getRootProps()}
        style={{
          margin: "auto",
          marginTop: 3,
          backgroundColor: "slate.100",
          padding: 6,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragAccept ? (
          <p
            style={{
              color: theme.palette.mode === "dark" ? "#8C8C95" : "#B9B9BF",
            }}
          >
            Drop the files here ...
          </p>
        ) : (
          <p
            style={{
              color: theme.palette.mode === "dark" ? "#8C8C95" : "#B9B9BF",
            }}
          >
            Drag n drop your files here, or click to select files
          </p>
        )}

        <Box
          component="button"
          type="button"
          sx={{
            mt: 2,
            px: 3,
            py: 1,
            backgroundColor:
              theme.palette.mode === "dark" ? "#33c0ee" : "#B9B9BF",
            color: "#fff",
            border: "none",
            borderRadius: 1,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          Select Files
        </Box>
      </div>

      {acceptedFiles.map((image, index) => (
        <Box
          key={index}
          sx={{
            mt: "2rem",
            border: "1px solid #ccc",
            p: 1,
            color: theme.palette.mode === "dark" ? "#8C8C95" : "#B9B9BF",
          }}
        >
          {image.name} - {image.size} bytes
        </Box>
      ))}
    </div>
  );
};

export { DropBox };
