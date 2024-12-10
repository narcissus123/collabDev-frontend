interface Endpoint {
  method: string;
  path: string;
  description: string;
}

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

interface Deliverable {
  name: string;
}

interface UserStory {
  name: string;
}

interface SiteMap {
  name: string;
}

interface Tech {
  id: string;
  label: string;
  value: string;
}

interface ProjectLinks {
  platform: string;
  url: string;
}

export interface ProjectForm {
  title: string;
  description: string;
  solution: string;
  techStack: Array<Tech>;
  owner: Owner;
  contributors: Contributor[];
  roles: Role[];
  location: string;
  logoStyle?: number;
  category:
    | "Technology"
    | "Education"
    | "Health and Fitness"
    | "Art"
    | "Finance"
    | "Social Networking"
    | "Software Development"
    | "Science and Research"
    | "Environmental and Sustainability"
    | "Entertainment and Media"
    | "Gaming"
    | "Non-Profit and Community"
    | "Travel and Hospitality"
    | "Agriculture and Food"
    | "Retail and E-commerce"
    | "Legal and Governance"
    | "Others";
  status: "In Progress" | "Completed" | "Seeking Collaborators";
  license:
    | "Academic Free License v3.0"
    | "Apache license 2.0"
    | "Artistic license 2.0"
    | "Boost Software License 1.0"
    | "BSD 2-clause 'Simplified' license"
    | "BSD 3-clause 'New' or 'Revised' license"
    | "BSD 3-clause Clear license"
    | "BSD 4-clause 'Original' or 'Old' license"
    | "BSD Zero-Clause license"
    | "Creative Commons license family"
    | "Creative Commons Zero v1.0 Universal"
    | "Creative Commons Attribution 4.0"
    | "Creative Commons Attribution ShareAlike 4.0"
    | "Do What The F*ck You Want To Public License"
    | "Educational Community License v2.0"
    | "Eclipse Public License 1.0"
    | "Eclipse Public License 2.0"
    | "European Union Public License 1.1"
    | "GNU Affero General Public License v3.0"
    | "GNU General Public License family"
    | "GNU General Public License v2.0"
    | "GNU General Public License v3.0"
    | "GNU Lesser General Public License family"
    | "GNU Lesser General Public License v2.1"
    | "GNU Lesser General Public License v3.0"
    | "ISC"
    | "LaTeX Project Public License v1.3c"
    | "Microsoft Public License"
    | "MIT"
    | "Mozilla Public License 2.0"
    | "Open Software License 3.0"
    | "PostgreSQL License"
    | "SIL Open Font License 1.1"
    | "University of Illinois/NCSA Open Source License"
    | "The Unlicense"
    | "zLib License";
  startDate: Date;
  dueDate: Date;
  likes: number;
  links: ProjectLinks[];
  coverImage: any[];
  screenshots: any[];
  sitemap: Array<SiteMap>;
  userStories: Array<UserStory>;
  contributionsGuidelines: string;
  deliverables: Array<Deliverable>;
  dataModel: string;
  endpoints: Endpoint[];
}

export interface ProjectType {
  _id: string;
  title: string;
  description: string;
  techStack: Tech[];
  owner: {
    _id: string;
    name: string;
    avatar: string;
  };
  contributors: {
    _id: string;
    name: string;
    avatar: string;
  }[];
  likes: number;
  status: string;
  startDate: string;
  dueDate: string;
  links: ProjectLinks[];
  logoStyle?: number;
  coverImage: string[];
  screenshots: string[];
  solution: string;
  sitemap: string[];
  contributionsGuidelines: string;
  location: string;
  userStories: string[];
  license: string;
  category: string;
  deliverables: string[];
  roles: {
    name: string;
    requiresCollaborator: boolean;
  }[];
  dataModel: string;
  endpoints: Endpoint[];
}

export interface Project {
  contributors: any;
  _id: string;
  title: string;
  description: string;
  techStack: Tech[];
  owner: string;
  likes: number;
  status: "In Progress" | "Completed" | "Seeking Collaborators";
  startDate: Date;
  dueDate?: Date | null;
  links: ProjectLinks[];
  coverImage?: string;
  screenshots: string[];
  solution: string;
  dataModel?: string;
  endpoints: string[];
  roadmap?: string;
  userStories: string[];
  contributionsGuidelines?: string;
  license:
    | "Academic Free License v3.0"
    | "Apache license 2.0"
    | "Artistic license 2.0"
    | "Boost Software License 1.0"
    | "BSD 2-clause 'Simplified' license"
    | "BSD 3-clause 'New' or 'Revised' license"
    | "BSD 3-clause Clear license"
    | "BSD 4-clause 'Original' or 'Old' license"
    | "BSD Zero-Clause license"
    | "Creative Commons license family"
    | "Creative Commons Zero v1.0 Universal"
    | "Creative Commons Attribution 4.0"
    | "Creative Commons Attribution ShareAlike 4.0"
    | "Do What The F*ck You Want To Public License"
    | "Educational Community License v2.0"
    | "Eclipse Public License 1.0"
    | "Eclipse Public License 2.0"
    | "European Union Public License 1.1"
    | "GNU Affero General Public License v3.0"
    | "GNU General Public License family"
    | "GNU General Public License v2.0"
    | "GNU General Public License v3.0"
    | "GNU Lesser General Public License family"
    | "GNU Lesser General Public License v2.1"
    | "GNU Lesser General Public License v3.0"
    | "ISC"
    | "LaTeX Project Public License v1.3c"
    | "Microsoft Public License"
    | "MIT"
    | "Mozilla Public License 2.0"
    | "Open Software License 3.0"
    | "PostgreSQL License"
    | "SIL Open Font License 1.1"
    | "University of Illinois/NCSA Open Source License"
    | "The Unlicense"
    | "zLib License";
  location?: string;
  category:
    | "Technology"
    | "Education"
    | "Health and Fitness"
    | "Art"
    | "Finance"
    | "Social Networking"
    | "Software Development"
    | "Science and Research"
    | "Environmental and Sustainability"
    | "Entertainment and Media"
    | "Gaming"
    | "Non-Profit and Community"
    | "Travel and Hospitality"
    | "Agriculture and Food"
    | "Retail and E-commerce"
    | "Legal and Governance"
    | "Others";
}
