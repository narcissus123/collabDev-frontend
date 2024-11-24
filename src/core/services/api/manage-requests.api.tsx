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

// const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

// const getUserRequests = async (userId?: string) => {
//   try {
//     const response = await instance.get(`/api/v1/request/${userId}`);
//     // if (response.data.message) {
//     //   // Handle the case where no requests are found
//     //   console.log("No requests found:", response.data.message);
//     //   return []; // Return an empty array or handle appropriately
//     // }
//     return response.data; // Return the array of requests
//   } catch (error: any) {
//     console.error("Failed to retrieve requests:", error);
//     // const errorMessage = "Failed to retrieve requests.";
//     // console.error("errorMessage", errorMessage);
//     // throw new Error(errorMessage);
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(
//         error.response.data.message || "Failed to retrieve requests."
//       );
//     } else {
//       throw new Error(
//         error.message || "Network error: Please check your internet connection."
//       );
//     }
//   }
// };

// const getUserRequests = async (args?: string) => {
//   try {
//     await delay(2000);
//     const response = await instance.get(`/api/v1/request/${args}`);
//     console.error("response:", response);
//     // if (response && response.status === 200) {
//     //   return response.data;
//     // }
//     // if (!response || response?.status !== 200) {
//     //   throw new Error("Failed to fetch user requests");
//     // }
//     return response.data;
//   } catch (error: any) {
//     console.error("Something went wrong:", error);
//     // if (error.handled) {
//     //   // Error was already handled, no need to throw it again
//     //   return;
//     // }

//     const errorMessage = error?.data?.message || "Failed to retrieve requests.";
//     console.error("errorMessage", errorMessage);
//     throw new Error(errorMessage);
//   }
// };
