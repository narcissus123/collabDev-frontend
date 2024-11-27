import { instance } from "../interceptor/Interceptor";

const getUploadedFile = async (userId: string) => {
  const response = await instance.get(`/api/v1/user/resume/${userId}`);
  return response.data;
};

const uploadFile = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  if (!file) {
    throw new Error("No file selected for upload.");
  }
  const response = await instance.post(
    `/api/v1/user/resume/${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

const deleteUploadedFile = async (userId: string) => {
  const response = await instance.delete(`/api/v1/user/resume/${userId}`);
  return response.data;
};

export { getUploadedFile, uploadFile, deleteUploadedFile };