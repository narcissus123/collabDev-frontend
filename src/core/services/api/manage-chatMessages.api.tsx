import { instance } from "../interceptor/Interceptor";

const getAllUserChatMessages = async (userId: string) => {
  try {
    const response = await instance.get(`/api/v1/chatMessage/${userId}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

const getUserChatMessageById = async (
  userId: any,
  receiverId: any,
  pageNumber: any,
  limit?: any
) => {
  try {
    const response = await instance.get(
      `/api/v1/chatMessage/${userId}/${receiverId}`,
      {
        params: { page: pageNumber, limit: limit | 10 },
      }
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

export { getAllUserChatMessages, getUserChatMessageById };
