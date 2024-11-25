import { instance } from "../interceptor/Interceptor";

const updateUserInfo = async (userId: string, obj: any) => {
  try {
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

// const getUserById = async (studentId: string) => {
//   try {
//     const response = await instance.get(`api/v1/user/${studentId}`);

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     return error;
//   }
// };

//const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUserById = async (studentId: string) => {
  //await delay(2000);
  return await instance.get(`api/v1/user/${studentId}`);
};

export { updateUserInfo };
