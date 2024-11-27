import { instance } from "../interceptor/Interceptor";

const updateUserInfo = async (userId: string, obj: any) => {
  try {
    console.log("FormData entries:");
    for (const pair of obj.entries()) {
      console.log(pair[0], pair[1]);
    }
    const response = await instance.put(`api/v1/user/${userId}`, obj);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    console.error("Something went wrong:", error);
    throw new Error(
      error.response.data.message ||
        "Failed to update profile information. Please try again later."
    );
  }
};

export const getUserById = async (studentId: string) => {
  //await delay(2000);
  return await instance.get(`api/v1/user/${studentId}`);
};

export { updateUserInfo };
