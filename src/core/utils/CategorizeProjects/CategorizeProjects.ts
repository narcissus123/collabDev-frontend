import { ProjectType } from "../../../configs/types/projectTypes";

export default function categorizeProjects(
  projects: ProjectType[],
  userId: string
) {
  const filteredMyProjects = projects.filter(
    (proj) => proj.owner._id === userId
  );

  const contributedProjects = projects.filter((proj) => {
    const isOwnerContributor = proj.contributors.some(
      (contributor) => contributor.name === proj.owner.name
    );
    return isOwnerContributor && proj.owner._id !== userId;
  });

  return { filteredMyProjects, contributedProjects };
}
