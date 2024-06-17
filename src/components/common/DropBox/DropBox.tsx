import { Button, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
interface DropBoxProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const DropBox = ({ onDrop }: DropBoxProps) => {
  const theme = useTheme();
  const { getRootProps, getInputProps, open, acceptedFiles, isDragAccept } =
    useDropzone({
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      onDrop,
      noClick: true,
      noKeyboard: true,
      maxFiles: 30,
    });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef.current) return;

    const dataTransfer = new DataTransfer();
    acceptedFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });

    inputRef.current.files = dataTransfer.files;

    // Additional handling for Safari
    if (inputRef.current.webkitEntries.length) {
      inputRef.current.dataset.file = `${dataTransfer.files[0].name}`;
    }
  }, [acceptedFiles]);

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
        {...getRootProps({ className: "dropzone" })}
        style={{
          margin: "auto",
          marginTop: 3,
          backgroundColor: "slate.100",
          padding: 6,
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} ref={inputRef} type="file" />
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
            Drag n drop some files here, or click to select files
          </p>
        )}
        <Button
          type="button"
          onClick={open}
          sx={{
            mt: 12,
            borderRadius: "md",
            backgroundColor: "red.500",
            px: 2,
            py: 2,
            fontSize: "small",
            color: theme.palette.mode === "dark" ? "#8C8C95" : "#B9B9BF",
          }}
        >
          Click to select file
        </Button>
      </div>

      {acceptedFiles.map((image, index) => {
        return (
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
        );
      })}
    </div>
  );
};

export { DropBox };
