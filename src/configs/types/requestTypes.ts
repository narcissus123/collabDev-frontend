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

export interface RequestFormType {
  owner: Owner;
  contributor: Contributor;
  messageType: string;
  project: string;
  message: string;
  status: string;
}

export interface Request {
  _id: string;
  owner: Owner;
  contributor: Contributor;
  messageType: "invitation_request" | "collaboration_request";
  project: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}
