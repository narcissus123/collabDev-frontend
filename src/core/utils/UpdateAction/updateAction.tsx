interface Owner {
  _id: string;
  name: string;
  avatar: string;
}

interface Contributor {
  _id: string;
  name: string;
  avatar: string;
}

interface Role {
  name: string;
  requiresCollaborator: boolean;
}

interface FormValues {
  title: string;
  description: string;
  solution: string;
  techStack: string[];
  category: string;
  status: string;
  license: string;
  startDate: Date;
  dueDate: Date;
  likes: number;
  owner: Owner;
  screenshots: File[];
  coverImage: File[];
  location: string;
  contributors: Contributor[];
  sitemap: [];
  userStories: string[];
  contributionsGuidelines: string;
  deliverables: [];
  roles: Role[];
  links: string[];
}

export default function updateAction(state: FormValues): FormValues {
  return {
    ...state,
  };
}
