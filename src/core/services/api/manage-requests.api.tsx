import { instance } from "../interceptor/Interceptor";

const acceptRequestById = async (requestId: string) => {
  const response = await instance.put(`api/v1/request/accept/${requestId}`);
  return response;
};

const rejectRequestById = async (requestId: string) => {
  const response = await instance.put(`api/v1/request/reject/${requestId}`);
  return response;
};

export const deleteRequestById = async (requestId: string) => {
  await instance.delete(`api/v1/request/${requestId}`);
  return;
};

const createRequest = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/request/", obj);
    if (response.status === 201) {
      return response;
    }
  } catch (error: any) {
    console.error("Something went wrong:", error);
    throw new Error(
      error.response.data.message ||
        "Failed to send new request. Please try again later."
    );
  }
};

const getUserRequests = async (userId: string) => {
  const response = await instance.get<{ data: Request[] }>(
    `/api/v1/request/${userId}`
  );
  return response.data;
};

export { createRequest, getUserRequests, rejectRequestById, acceptRequestById };
