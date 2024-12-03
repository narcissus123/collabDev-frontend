// utils.ts
import { Request } from "../../../configs/types/requestTypes";

export const getRequestDisplayInfo = (
  req: Request,
  userId: string | undefined
) => {
  const isCollaborationRequest = req.messageType === "collaboration_request";
  const isInvitationRequest = req.messageType === "invitation_request";
  const isSentByMe =
    (isCollaborationRequest && req.contributor._id === userId) ||
    (isInvitationRequest && req.owner._id === userId);

  return {
    mainUser: {
      id: isSentByMe
        ? isInvitationRequest
          ? req.contributor._id
          : req.owner._id
        : isInvitationRequest
          ? req.owner._id
          : req.contributor._id,
      name: isSentByMe
        ? isInvitationRequest
          ? req.contributor.name
          : req.owner.name
        : isInvitationRequest
          ? req.owner.name
          : req.contributor.name,
      avatar: isSentByMe
        ? isInvitationRequest
          ? req.contributor.avatar
          : req.owner.avatar
        : isInvitationRequest
          ? req.owner.avatar
          : req.contributor.avatar,
    },
    requestType: isInvitationRequest
      ? "Project Invitation"
      : "Collaboration Request",
    isSentByMe,
    status: req.status,
  };
};
