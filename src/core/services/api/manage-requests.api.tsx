import { instance } from "../interceptor/Interceptor";

const acceptRequestById = async (requestId: string, request: any) => {
  try {
    const response = await instance.put(
      `api/v1/request/accept/${requestId}`,
      request
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error: any) {
    console.error("Something went wrong:", error);
    throw new Error(
      error.response.data.message ||
        "Failed to accept request. Please try again later."
    );
  }
};

const rejectRequestById = async (requestId: string) => {
  try {
    const response = await instance.put(`api/v1/request/reject`, requestId);
    if (response.status === 200) {
      return response;
    }
  } catch (error: any) {
    console.error("Something went wrong:", error);
    throw new Error(
      error.response.data.message ||
        "Failed to reject request. Please try again later."
    );
  }
};

export const deleteRequestById = async (requestId: string) => {
  return await instance.delete(`api/v1/request/${requestId}`);
};

const createRequest = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/request/", obj);
    if (response.status === 20) {
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
