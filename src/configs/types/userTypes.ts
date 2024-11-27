interface SocialMedia {
  platform: string;
  url: string;
}

interface Resume {
  fileKey: string;
  lastUpdated: Date;
}

export interface User {
  about: string;
  availability: {
    status: "Available" | "Partially Available" | "Unavailable";
    hoursPerDay: number;
    daysPerWeek: number;
  };
  avatar: string;
  badges: string[];
  bio: string;
  createdAt: string;
  email: string;
  languages: string[];
  name: string;
  passions: string[];
  preferredContact: string;
  role: "user" | "admin";
  skills: string[];
  socialMedia: SocialMedia[];
  resume: Resume;
  updatedAt: string;
  __v: number;
  _id: string;
}
