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

export const addCollaborator = async (
  projectId: string,
  collaboratorId: string
) => {
  const response = await instance.post(
    `/api/v1/project/${projectId}/collaborators/${collaboratorId}`
  );
  return response;
};

interface GetAllProjectsParams {
  signal?: AbortSignal;
  queryString: string;
}

const getAllProjects = async ({
  signal,
  queryString,
}: GetAllProjectsParams) => {
  const response = await instance.get(`/api/v1/project${queryString}`, {
    signal,
  });
  return response.data;
};

interface GetProjectByIdParams {
  signal?: AbortSignal;
  projectId: string;
}

export const getProjectById = async ({
  signal,
  projectId,
}: GetProjectByIdParams) => {
  try {
    const response = await instance.get(`/api/v1/project/${projectId}`, {
      signal,
    });
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

export const deleteProjectById = async (projectId: any) => {
  try {
    const response = await instance.delete(`/api/v1/project/${projectId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export { updateProject, getAllProjects, addProject };
