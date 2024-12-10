import { ProjectForm } from "../types/projectTypes";

export const getDefaultValues = (data?: Partial<ProjectForm>): ProjectForm => {
  return {
    title: data?.title || "",
    description: data?.description || "",
    solution: data?.solution || "",
    techStack: data?.techStack || [],
    owner: {
      _id: data?.owner?._id || "",
      name: data?.owner?.name || "",
      avatar: data?.owner?.avatar || "",
    },
    contributors: data?.contributors || [],
    roles: data?.roles || [{ name: "", requiresCollaborator: false }],
    location: data?.location || "",
    category: data?.category || "Technology",
    status: data?.status || "Seeking Collaborators",
    license: data?.license || "MIT",
    startDate: data?.startDate || new Date(),
    dueDate: data?.dueDate || new Date(),
    likes: data?.likes || 0,
    logoStyle: data?.logoStyle || 0,
    links: data?.links || [],
    coverImage: data?.coverImage || [],
    screenshots: data?.screenshots || [],
    sitemap: data?.sitemap || [{ name: "" }],
    userStories: data?.userStories || [{ name: "" }],
    contributionsGuidelines: data?.contributionsGuidelines || "",
    deliverables: data?.deliverables || [{ name: "" }],
    dataModel: data?.dataModel || "",
    endpoints: data?.endpoints || [],
  };
};
