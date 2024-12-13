import { instance } from "../interceptor/Interceptor";

const updateUserInfo = async (userId: string, obj: any) => {
  const response = await instance.put(`api/v1/user/${userId}`, obj);
  return response.data;
};

export const getUserById = async (studentId: string) => {
  return await instance.get(`api/v1/user/${studentId}`);
};

export const searchUsers = async (query: string) => {
  return await instance.get(
    `api/v1/user/search?q=${encodeURIComponent(query)}`
  );
};

export { updateUserInfo };
