import { instance } from "../interceptor/Interceptor";

const updateProject = async (projectId: string, obj: any) => {
  try {
    const response = await instance.put(`api/v1/project/${projectId}`, obj);

    return response;
  } catch (error) {
    return error;
  }
};

const addProject = async (obj: any) => {
  try {
    const response = await instance.post("/api/v1/project/", obj);

    return response;
  } catch (error) {
    return error;
  }
};

const getAllProjects = async (params: any) => {
  const response = await instance.get(`/api/v1/project${params}`);
  return response.data;
};

export const getProjectById = async (projectId: any) => {
  try {
    const response = await instance.get(`/api/v1/project/${projectId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getProjectByownerId = async (ownerId: any) => {
  try {
    const response = await instance.get(`/api/v1/project/owner/${ownerId}`);

    return response.data;
  } catch (error) {
    return error;
  }
};

export { updateProject, getAllProjects, addProject };
