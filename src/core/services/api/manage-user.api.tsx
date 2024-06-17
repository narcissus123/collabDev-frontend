import { instance } from "../interceptor/Interceptor";

const updateUserInfo = async (userId: string, obj: any) => {
  try {
    const response = await instance.put(`api/v1/user/${userId}`, obj);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const getUserById = async (studentId: string) => {
  try {
    const response = await instance.get(`api/v1/user/${studentId}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

export { updateUserInfo, getUserById };
