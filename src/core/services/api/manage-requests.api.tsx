import { instance } from "../interceptor/Interceptor";

const acceptRequestById = async (requestId: string, request: any) => {
  try {
    const response = await instance.put(
      `api/v1/request/accept/${requestId}`,
      request
    );

    return response;
  } catch (error) {
    return error;
  }
};

const rejectRequestById = async (requestId: string) => {
  try {
    const response = await instance.put(`api/v1/request/reject`, requestId);

    return response;
  } catch (error) {
    return error;
  }
};

export const deleteRequestById = async (requestId: string) => {
  try {
    const response = await instance.delete(`api/v1/request/${requestId}`);

    return response;
  } catch (error) {
    return error;
  }
};

const createRequest = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/request/", obj);
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const getUserRequests = async (args?: string) => {
  try {
    const response = await instance.get(`/api/v1/request/${args}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

export { createRequest, getUserRequests, rejectRequestById, acceptRequestById };
