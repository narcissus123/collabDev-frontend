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

const getAllProjects = async (params?: any) => {
  try {
    const response = await instance.get(`/api/v1/project${params}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};

export const getAllProjectss = async (params: any) => {
  return await instance.get(`/api/v1/project${params}`);
};

export const getProjectById = async (projectId: any) => {
  try {
    const response = await instance.get(`/api/v1/project/${projectId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// export const getProjectById = async (projectId: any) => {
//   console.log("projectId", projectId);
//   return await instance.get(`/api/v1/project${projectId}`);
// };

export const getProjectByownerId = async (ownerId: any) => {
  try {
    const response = await instance.get(`/api/v1/project/owner/${ownerId}`);

    return response.data;
  } catch (error) {
    return error;
  }
};

export { updateProject, getAllProjects, addProject };

// const apiGetAllProjects = async (params?: any) => {
//   try {
//     const response = await instance.get(`/api/v1/project${params}`);

//     if (response.status === 200) {
//       return response.data;
//     }
//   } catch (error) {
//     return error;
//   }
// };

// const apiGetAllProjects = async (params?: any) => {
//   try {
//     const response = await instance.get(`/api/v1/project${params}`);

//     if (response.status === 200) {
//       return response.data;
//     }
//     throw new Error("Failed to fetch data");
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Error fetching data: ${error.message}`);
//     } else {
//       throw new Error(`Unknown error occurred`);
//     }
//   }
// };

// export const useAllProjects = (params?: any) => {
//   return useQuery({
//     queryKey: ["useAllProjects", params],
//     queryFn: () => apiGetAllProjects(params),
//   });
// };
