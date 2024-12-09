import { instance } from "../interceptor/Interceptor";

type FileType = "avatars" | "badges" | "resume";
type FileT = File | File[];

const getUploadedFile = async (userId: string, fileType: FileType) => {
  const response = await instance.get(`/api/v1/files/${userId}/${fileType}`);
  return response.data;
};

const uploadFile = async (userId: string, files: FileT, fileType: FileType) => {
  const formData = new FormData();
  if (Array.isArray(files)) {
    files.map((file) => {
      return formData.append(fileType.toString(), file);
    });
  } else {
    formData.append(fileType.toString(), files);
  }

  if (!files) {
    throw new Error("No file selected for upload.");
  }
  const response = await instance.post(
    `/api/v1/files/${userId}/${fileType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("response", response);
  return response.data;
};

const deleteUploadedFile = async (
  userId: string,
  fileType: string,
  fileKey: string
) => {
  const response = await instance.delete(
    `/api/v1/files/${userId}/${fileType}`,
    {
      data: { fileKey },
    }
  );
  return response.data;
};

export { getUploadedFile, uploadFile, deleteUploadedFile };
