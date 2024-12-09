import { instance } from "../interceptor/Interceptor";

const updateUserInfo = async (userId: string, obj: any) => {
  console.log("obj", obj);
  const response = await instance.put(`api/v1/user/${userId}`, obj);
  console.log("response", response);
  return response.data;
};

export const getUserById = async (studentId: string) => {
  return await instance.get(`api/v1/user/${studentId}`);
};

export { updateUserInfo };
